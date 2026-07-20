const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { readJson, sendJson, sendHtml, redirect, parseRequestUrl, getBearerToken, getCookie } = require('./utils/http');
const { hashPassword, publicUser, signToken, verifyPassword, verifyToken } = require('./utils/auth');
const { query, transaction } = require('./db');
const { adminPage } = require('./adminPage');
const { adminLoginPage } = require('./adminLoginPage');

function createApp() {
  return http.createServer(handleRequest);
}

async function handleRequest(req, res) {
    if (req.method === 'OPTIONS') return sendJson(res, 204, {});

    try {
      const { pathname, query: urlQuery } = parseRequestUrl(req);

      if (req.method === 'GET' && pathname === '/health') return sendJson(res, 200, { ok: true });
      if (req.method === 'GET' && pathname === '/api/debug') return sendJson(res, 200, debugInfo());

      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readJson(req) : {};
      const auth = await authenticate(req);
      const adminAuth = await authenticateAdmin(req);

      if (req.method === 'GET' && pathname === '/logo.png') return sendPublicImage(res, 'logo.png', 'image/png');
      if (req.method === 'GET' && pathname === '/favicon.png') return sendPublicImage(res, 'favicon.png', 'image/png');
      if (req.method === 'GET' && pathname === '/favicon.ico') return sendPublicImage(res, 'favicon.ico', 'image/x-icon');
      if (req.method === 'GET' && pathname === '/admin/login') return sendHtml(res, 200, adminLoginPage());
      if (req.method === 'POST' && pathname === '/api/admin/login') return await adminLogin(res, body);
      if (req.method === 'POST' && pathname === '/api/admin/logout') return adminLogout(res);

      if (req.method === 'GET' && pathname === '/') {
        return redirect(res, '/admin');
      }

      const adminPages = new Set(['/admin', '/admin/users', '/admin/goals', '/admin/transactions', '/admin/reports', '/admin/settings']);
      if (req.method === 'GET' && adminPages.has(pathname)) {
        if (!adminAuth.admin) return redirect(res, '/admin/login');
        return sendHtml(res, 200, adminPage(pathname.replace('/admin/', '') || 'dashboard'));
      }

      if (pathname.startsWith('/api/admin/') && !adminAuth.admin) {
        return sendJson(res, 401, { message: 'Admin unauthorized' });
      }

      if (req.method === 'GET' && pathname === '/api/admin/summary') return await adminSummary(res);
      if (req.method === 'GET' && pathname === '/api/admin/me') return adminMe(res, adminAuth.admin);
      if (req.method === 'PUT' && pathname === '/api/admin/settings') return await updateAdminSettings(res, adminAuth.admin, body);
      if (req.method === 'PUT' && pathname === '/api/admin/password') return await updateAdminPassword(res, adminAuth.admin, body);
      if (req.method === 'GET' && pathname === '/api/admin/users') return await adminUsers(res);
      if (req.method === 'POST' && pathname === '/api/admin/users') return await adminCreateUser(res, body);
      if (req.method === 'PUT' && match(pathname, /^\/api\/admin\/users\/([^/]+)$/)) return await adminUpdateUser(res, pathname, body);
      if (req.method === 'DELETE' && match(pathname, /^\/api\/admin\/users\/([^/]+)$/)) return await adminDeleteUser(res, pathname);
      if (req.method === 'PUT' && match(pathname, /^\/api\/admin\/users\/([^/]+)\/password$/)) return await adminResetUserPassword(res, pathname, body);
      if (req.method === 'GET' && pathname === '/api/admin/goals') return await adminGoals(res);
      if (req.method === 'PUT' && match(pathname, /^\/api\/admin\/goals\/([^/]+)$/)) return await adminUpdateGoal(res, pathname, body);
      if (req.method === 'DELETE' && match(pathname, /^\/api\/admin\/goals\/([^/]+)$/)) return await adminDeleteGoal(res, pathname);
      if (req.method === 'GET' && pathname === '/api/admin/transactions') return await adminTransactions(res);
      if (req.method === 'PUT' && match(pathname, /^\/api\/admin\/transactions\/([^/]+)$/)) return await adminUpdateTransaction(res, pathname, body);
      if (req.method === 'DELETE' && match(pathname, /^\/api\/admin\/transactions\/([^/]+)$/)) return await adminDeleteTransaction(res, pathname);

      if (req.method === 'POST' && pathname === '/api/auth/register') return await register(res, body);
      if (req.method === 'POST' && pathname === '/api/auth/login') return await login(res, body);

      if (pathname.startsWith('/api/') && !auth.user) {
        return sendJson(res, 401, { message: 'Unauthorized' });
      }

      if (req.method === 'GET' && pathname === '/api/auth/me') return sendJson(res, 200, { user: publicUser(auth.user) });
      if (req.method === 'POST' && pathname === '/api/auth/logout') return sendJson(res, 200, { message: 'Logged out' });

      if (req.method === 'GET' && pathname === '/api/dashboard') return await dashboard(res, auth.user.id);

      if (req.method === 'GET' && pathname === '/api/goals') return await listGoals(res, auth.user.id, urlQuery);
      if (req.method === 'POST' && pathname === '/api/goals') return await createGoal(res, auth.user.id, body);
      if (req.method === 'PUT' && match(pathname, /^\/api\/goals\/([^/]+)$/)) return await updateGoal(res, auth.user.id, pathname, body);
      if (req.method === 'DELETE' && match(pathname, /^\/api\/goals\/([^/]+)$/)) return await deleteGoal(res, auth.user.id, pathname);

      if (req.method === 'POST' && pathname === '/api/savings') return await addSavings(res, auth.user.id, body);

      if (req.method === 'GET' && pathname === '/api/transactions') return await listTransactions(res, auth.user.id, urlQuery);

      if (req.method === 'GET' && pathname === '/api/profile') return sendJson(res, 200, { user: publicUser(auth.user) });
      if (req.method === 'PUT' && pathname === '/api/profile') return await updateProfile(res, auth.user.id, body);
      if (req.method === 'PATCH' && pathname === '/api/profile/preferences') return await updatePreferences(res, auth.user.id, body);
      if (req.method === 'PUT' && pathname === '/api/profile/password') return await changePassword(res, auth.user.id, body);

      if (req.method === 'GET' && pathname === '/api/reports') return await reports(res, auth.user.id, urlQuery);
      if (req.method === 'GET' && pathname === '/api/reports/export') return await exportReport(res, auth.user.id, urlQuery);

      return sendJson(res, 404, { message: 'Route not found' });
    } catch (error) {
      const message = error.code === 'ECONNREFUSED'
        ? 'Tidak bisa konek ke MySQL. Pastikan MySQL hidup dan .env sudah benar.'
        : error.message || 'Bad request';
      return sendJson(res, 400, { message });
    }
}

function debugInfo() {
  return {
    ok: true,
    node: process.version,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
      hasPostgresPrismaUrl: Boolean(process.env.POSTGRES_PRISMA_URL),
      hasPostgresUrlNonPooling: Boolean(process.env.POSTGRES_URL_NON_POOLING),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
    },
  };
}

function sendPublicImage(res, fileName, contentType) {
  const imagePath = path.join(__dirname, '..', 'public', fileName);
  fs.readFile(imagePath, (error, data) => {
    if (error) return sendJson(res, 404, { message: 'Image not found' });
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    });
    res.end(data);
  });
}

async function authenticate(req) {
  const payload = verifyToken(getBearerToken(req));
  if (!payload?.sub) return { user: null };
  const rows = await query('SELECT * FROM users WHERE id = :id LIMIT 1', { id: payload.sub });
  return { user: rows[0] ? mapUser(rows[0]) : null };
}

async function authenticateAdmin(req) {
  const payload = verifyToken(getCookie(req, 'admin_token'));
  if (!payload?.adminSub) return { admin: null };
  const rows = await query('SELECT * FROM admins WHERE id = :id LIMIT 1', { id: payload.adminSub });
  return { admin: rows[0] ? mapAdmin(rows[0]) : null };
}

function match(pathname, regex) {
  return regex.test(pathname);
}

function getId(pathname) {
  return pathname.split('/').filter(Boolean).at(-1);
}

async function register(res, body) {
  const fullName = required(body.fullName, 'fullName');
  const email = required(body.email, 'email').toLowerCase();
  const password = required(body.password, 'password');

  if (password.length < 6) return sendJson(res, 422, { message: 'Password minimal 6 karakter' });

  const existing = await query('SELECT id FROM users WHERE email = :email LIMIT 1', { email });
  if (existing.length > 0) return sendJson(res, 409, { message: 'Email sudah terdaftar' });

  const hashed = hashPassword(password);
  const id = createId('user');
  await query(
    `INSERT INTO users (id, full_name, email, password_hash, salt, biometric_login, dark_mode, notifications)
     VALUES (:id, :fullName, :email, :passwordHash, :salt, 0, 0, 1)`,
    { id, fullName, email, passwordHash: hashed.hash, salt: hashed.salt },
  );

  const user = await getUserById(id);
  return sendJson(res, 201, { token: signToken({ sub: user.id }), user: publicUser(user) });
}

async function login(res, body) {
  const email = required(body.email, 'email').toLowerCase();
  const password = required(body.password, 'password');
  const rows = await query('SELECT * FROM users WHERE email = :email LIMIT 1', { email });
  const user = rows[0] ? mapUser(rows[0]) : null;

  if (!user || !verifyPassword(password, user)) {
    return sendJson(res, 401, { message: 'Email atau password salah' });
  }

  return sendJson(res, 200, { token: signToken({ sub: user.id }), user: publicUser(user) });
}

async function adminLogin(res, body) {
  const email = required(body.email, 'email').toLowerCase();
  const password = required(body.password, 'password');
  const rows = await query('SELECT * FROM admins WHERE email = :email LIMIT 1', { email });
  const admin = rows[0] ? mapAdmin(rows[0]) : null;

  if (!admin || !verifyPassword(password, admin)) {
    return sendJson(res, 401, { message: 'Email atau password admin salah' });
  }

  const token = signToken({ adminSub: admin.id, role: admin.role }, 60 * 60 * 12);
  res.setHeader('Set-Cookie', [
    `admin_token=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 12}`,
  ]);
  return sendJson(res, 200, {
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    },
  });
}

function adminLogout(res) {
  res.setHeader('Set-Cookie', ['admin_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0']);
  return sendJson(res, 200, { message: 'Admin logged out' });
}

function adminMe(res, admin) {
  return sendJson(res, 200, {
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    },
  });
}

async function updateAdminSettings(res, admin, body) {
  const fullName = required(body.fullName, 'fullName');
  const email = required(body.email, 'email').toLowerCase();

  const existing = await query('SELECT id FROM admins WHERE email = :email AND id <> :id LIMIT 1', {
    email,
    id: admin.id,
  });
  if (existing.length > 0) return sendJson(res, 409, { message: 'Email admin sudah digunakan' });

  await query(
    'UPDATE admins SET full_name = :fullName, email = :email WHERE id = :id',
    { fullName, email, id: admin.id },
  );

  const rows = await query('SELECT * FROM admins WHERE id = :id LIMIT 1', { id: admin.id });
  return adminMe(res, mapAdmin(rows[0]));
}

async function updateAdminPassword(res, admin, body) {
  const currentPassword = required(body.currentPassword, 'currentPassword');
  const newPassword = required(body.newPassword, 'newPassword');
  if (newPassword.length < 6) return sendJson(res, 422, { message: 'Password baru minimal 6 karakter' });

  const rows = await query('SELECT * FROM admins WHERE id = :id LIMIT 1', { id: admin.id });
  const currentAdmin = rows[0] ? mapAdmin(rows[0]) : null;
  if (!currentAdmin || !verifyPassword(currentPassword, currentAdmin)) {
    return sendJson(res, 401, { message: 'Password lama salah' });
  }

  const hashed = hashPassword(newPassword);
  await query(
    'UPDATE admins SET password_hash = :passwordHash, salt = :salt WHERE id = :id',
    { passwordHash: hashed.hash, salt: hashed.salt, id: admin.id },
  );

  return sendJson(res, 200, { message: 'Password admin berhasil diperbarui' });
}

async function adminSummary(res) {
  const rows = await query(
    `SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM goals WHERE status = 'active') AS activeGoals,
      (SELECT COUNT(*) FROM goals WHERE status = 'completed') AS completedGoals,
      (SELECT COALESCE(SUM(saved_amount), 0) FROM goals) AS totalSaved,
      (SELECT COALESCE(SUM(target_amount), 0) FROM goals) AS totalTarget,
      (SELECT COUNT(*) FROM transactions) AS totalTransactions,
      (SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) FROM transactions) AS totalIncome,
      (SELECT COALESCE(SUM(CASE WHEN type = 'outcome' THEN amount ELSE 0 END), 0) FROM transactions) AS totalOutcome`,
  );
  const summary = rows[0] || {};

  return sendJson(res, 200, {
    totalUsers: Number(summary.totalUsers),
    activeGoals: Number(summary.activeGoals),
    completedGoals: Number(summary.completedGoals),
    totalSaved: Number(summary.totalSaved),
    totalTarget: Number(summary.totalTarget),
    totalTransactions: Number(summary.totalTransactions),
    totalIncome: Number(summary.totalIncome),
    totalOutcome: Number(summary.totalOutcome),
  });
}

async function adminUsers(res) {
  const rows = await query(
    `SELECT
      u.id,
      u.full_name,
      u.email,
      u.created_at,
      COALESCE(g.goal_count, 0) AS goal_count,
      COALESCE(g.total_saved, 0) AS total_saved,
      COALESCE(g.total_target, 0) AS total_target,
      COALESCE(t.transaction_count, 0) AS transaction_count
     FROM users u
     LEFT JOIN (
       SELECT user_id, COUNT(*) AS goal_count, SUM(saved_amount) AS total_saved, SUM(target_amount) AS total_target
       FROM goals
       GROUP BY user_id
     ) g ON g.user_id = u.id
     LEFT JOIN (
       SELECT user_id, COUNT(*) AS transaction_count
       FROM transactions
       GROUP BY user_id
     ) t ON t.user_id = u.id
     ORDER BY u.created_at DESC`,
  );

  return sendJson(res, 200, {
    users: rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      goalCount: Number(row.goal_count),
      totalSaved: Number(row.total_saved),
      totalTarget: Number(row.total_target),
      transactionCount: Number(row.transaction_count),
      createdAt: toIso(row.created_at),
    })),
  });
}

async function adminCreateUser(res, body) {
  const fullName = required(body.fullName, 'fullName');
  const email = required(body.email, 'email').toLowerCase();
  const password = required(body.password, 'password');
  if (password.length < 6) return sendJson(res, 422, { message: 'Password minimal 6 karakter' });

  const existing = await query('SELECT id FROM users WHERE email = :email LIMIT 1', { email });
  if (existing.length > 0) return sendJson(res, 409, { message: 'Email user sudah terdaftar' });

  const hashed = hashPassword(password);
  const id = createId('user');
  await query(
    `INSERT INTO users (id, full_name, email, password_hash, salt, biometric_login, dark_mode, notifications)
     VALUES (:id, :fullName, :email, :passwordHash, :salt, 0, 0, 1)`,
    { id, fullName, email, passwordHash: hashed.hash, salt: hashed.salt },
  );

  return sendJson(res, 201, { user: publicUser(await getUserById(id)) });
}

async function adminUpdateUser(res, pathname, body) {
  const id = getId(pathname);
  const current = await getUserById(id);
  if (!current) return sendJson(res, 404, { message: 'User tidak ditemukan' });

  const fullName = required(body.fullName ?? current.fullName, 'fullName');
  const email = required(body.email ?? current.email, 'email').toLowerCase();
  const existing = await query('SELECT id FROM users WHERE email = :email AND id <> :id LIMIT 1', { email, id });
  if (existing.length > 0) return sendJson(res, 409, { message: 'Email user sudah digunakan' });

  await query(
    'UPDATE users SET full_name = :fullName, email = :email WHERE id = :id',
    { fullName, email, id },
  );

  return sendJson(res, 200, { user: publicUser(await getUserById(id)) });
}

async function adminDeleteUser(res, pathname) {
  const id = getId(pathname);
  const current = await getUserById(id);
  if (!current) return sendJson(res, 404, { message: 'User tidak ditemukan' });

  await query('DELETE FROM users WHERE id = :id', { id });
  return sendJson(res, 200, { message: 'User berhasil dihapus' });
}

async function adminResetUserPassword(res, pathname, body) {
  const id = pathname.split('/').filter(Boolean).at(-2);
  const current = await getUserById(id);
  if (!current) return sendJson(res, 404, { message: 'User tidak ditemukan' });

  const password = required(body.password, 'password');
  if (password.length < 6) return sendJson(res, 422, { message: 'Password baru minimal 6 karakter' });

  const hashed = hashPassword(password);
  await query(
    'UPDATE users SET password_hash = :passwordHash, salt = :salt WHERE id = :id',
    { passwordHash: hashed.hash, salt: hashed.salt, id },
  );

  return sendJson(res, 200, { message: 'Password user berhasil direset' });
}

async function adminGoals(res) {
  const rows = await query(
    `SELECT
      g.*,
      u.full_name AS user_name,
      u.email AS user_email
     FROM goals g
     JOIN users u ON u.id = g.user_id
     ORDER BY g.created_at DESC
     LIMIT 100`,
  );

  return sendJson(res, 200, {
    goals: rows.map((row) => ({
      ...withProgress(mapGoal(row)),
      userName: row.user_name,
      userEmail: row.user_email,
    })),
  });
}

async function adminUpdateGoal(res, pathname, body) {
  const id = getId(pathname);
  const rows = await query('SELECT * FROM goals WHERE id = :id LIMIT 1', { id });
  const current = rows[0] ? mapGoal(rows[0]) : null;
  if (!current) return sendJson(res, 404, { message: 'Goal tidak ditemukan' });

  const targetAmount = body.targetAmount == null ? current.targetAmount : positiveNumber(body.targetAmount, 'targetAmount');
  const savedAmount = body.savedAmount == null ? current.savedAmount : Math.max(0, Number(body.savedAmount));
  if (!Number.isFinite(savedAmount)) return sendJson(res, 422, { message: 'savedAmount harus berupa angka' });
  const status = body.status || current.status;
  if (!['active', 'completed', 'archived'].includes(status)) return sendJson(res, 422, { message: 'Status goal tidak valid' });

  await query(
    `UPDATE goals SET
      title = :title,
      category = :category,
      saved_amount = :savedAmount,
      target_amount = :targetAmount,
      target_date = :targetDate,
      cover_url = :coverUrl,
      status = :status,
      completed_at = :completedAt
     WHERE id = :id`,
    {
      id,
      title: body.title ?? current.title,
      category: body.category ?? current.category,
      savedAmount,
      targetAmount,
      targetDate: body.targetDate ?? current.targetDate,
      coverUrl: body.coverUrl ?? current.coverUrl,
      status,
      completedAt: status === 'completed' ? (current.completedAt || new Date()) : null,
    },
  );

  return adminGoals(res);
}

async function adminDeleteGoal(res, pathname) {
  const id = getId(pathname);
  const result = await query('DELETE FROM goals WHERE id = :id', { id });
  if (result.affectedRows === 0) return sendJson(res, 404, { message: 'Goal tidak ditemukan' });
  return sendJson(res, 200, { message: 'Goal berhasil dihapus' });
}

async function adminTransactions(res) {
  const rows = await query(
    `SELECT
      t.*,
      u.full_name AS user_name,
      u.email AS user_email,
      g.title AS goal_title,
      g.category AS goal_category
     FROM transactions t
     JOIN users u ON u.id = t.user_id
     LEFT JOIN goals g ON g.id = t.goal_id
     ORDER BY t.transaction_date DESC
     LIMIT 100`,
  );

  return sendJson(res, 200, {
    transactions: rows.map((row) => ({
      ...mapTransaction(row),
      userName: row.user_name,
      userEmail: row.user_email,
      goalTitle: row.goal_title,
      goalCategory: row.goal_category,
    })),
  });
}

async function adminUpdateTransaction(res, pathname, body) {
  const id = getId(pathname);

  const result = await transaction(async (connection) => {
    const [rows] = await connection.execute('SELECT * FROM transactions WHERE id = :id LIMIT 1', { id });
    if (rows.length === 0) return null;

    const current = mapTransaction(rows[0]);
    const nextAmount = body.amount == null ? current.amount : positiveNumber(body.amount, 'amount');
    const nextType = body.type || current.type;
    if (!['income', 'outcome'].includes(nextType)) throw new Error('Tipe transaksi tidak valid');

    await connection.execute(
      `UPDATE transactions SET
        title = :title,
        type = :type,
        amount = :amount,
        category = :category,
        notes = :notes,
        transaction_date = :transactionDate
       WHERE id = :id`,
      {
        id,
        title: body.title ?? current.title,
        type: nextType,
        amount: nextAmount,
        category: body.category ?? current.category,
        notes: body.notes ?? current.notes,
        transactionDate: body.date ? new Date(body.date) : new Date(current.date),
      },
    );

    if (current.goalId && (current.type === 'income' || nextType === 'income')) {
      const currentContribution = current.type === 'income' ? Number(current.amount || 0) : 0;
      const nextContribution = nextType === 'income' ? Number(nextAmount || 0) : 0;
      const delta = nextContribution - currentContribution;

      if (delta !== 0) {
        await connection.execute(
          `UPDATE goals
           SET saved_amount = GREATEST(0, saved_amount + :delta),
               status = CASE
                 WHEN GREATEST(0, saved_amount + :delta) >= target_amount THEN 'completed'
                 WHEN status = 'completed' THEN 'active'
                 ELSE status
               END,
               completed_at = CASE
                 WHEN GREATEST(0, saved_amount + :delta) >= target_amount THEN COALESCE(completed_at, NOW())
                 ELSE NULL
               END
           WHERE id = :goalId`,
          { delta, goalId: current.goalId },
        );
      }
    }

    return true;
  });

  if (!result) return sendJson(res, 404, { message: 'Transaksi tidak ditemukan' });
  return adminTransactions(res);
}

async function adminDeleteTransaction(res, pathname) {
  const id = getId(pathname);

  const result = await transaction(async (connection) => {
    const [rows] = await connection.execute('SELECT * FROM transactions WHERE id = :id LIMIT 1', { id });
    if (rows.length === 0) return null;

    const current = mapTransaction(rows[0]);
    await connection.execute('DELETE FROM transactions WHERE id = :id', { id });

    if (current.goalId && current.type === 'income') {
      await connection.execute(
        `UPDATE goals
         SET saved_amount = GREATEST(0, saved_amount - :amount),
             status = CASE WHEN status = 'completed' THEN 'active' ELSE status END,
             completed_at = NULL
         WHERE id = :goalId`,
        { amount: Number(current.amount || 0), goalId: current.goalId },
      );
    }

    return true;
  });

  if (!result) return sendJson(res, 404, { message: 'Transaksi tidak ditemukan' });
  return sendJson(res, 200, { message: 'Transaksi berhasil dihapus' });
}

async function dashboard(res, userId) {
  const goals = await getGoals(userId);
  const transactions = await getTransactions(userId);
  const totalSaved = goals.reduce((total, goal) => total + Number(goal.savedAmount || 0), 0);
  const totalTarget = goals.reduce((total, goal) => total + Number(goal.targetAmount || 0), 0);

  return sendJson(res, 200, {
    totalSaved,
    totalTarget,
    growthPercent: 12.5,
    activeGoals: goals.filter((goal) => goal.status === 'active').slice(0, 3).map(withProgress),
    completedGoals: goals.filter((goal) => goal.status === 'completed').map(withProgress),
    weeklyGrowth: [
      { day: 'Mon', amount: 300000 },
      { day: 'Tue', amount: 450000 },
      { day: 'Wed', amount: 250000 },
      { day: 'Thu', amount: 600000 },
      { day: 'Fri', amount: 1200000 },
      { day: 'Sat', amount: 150000 },
      { day: 'Sun', amount: 100000 },
    ],
    recentTransactions: transactions.slice(0, 5),
  });
}

async function listGoals(res, userId, urlQuery) {
  let goals = await getGoals(userId);
  if (urlQuery.status) goals = goals.filter((goal) => goal.status === urlQuery.status);
  return sendJson(res, 200, { goals: goals.map(withProgress) });
}

async function createGoal(res, userId, body) {
  const id = createId('goal');
  const title = required(body.title, 'title');
  const targetAmount = positiveNumber(body.targetAmount, 'targetAmount');
  const category = body.category || 'Other';
  const targetDate = body.targetDate || null;
  const coverUrl = body.coverUrl || null;

  await query(
    `INSERT INTO goals (id, user_id, title, category, saved_amount, target_amount, target_date, cover_url, status)
     VALUES (:id, :userId, :title, :category, :savedAmount, :targetAmount, :targetDate, :coverUrl, 'active')`,
    {
      id,
      userId,
      title,
      category,
      savedAmount: Number(body.savedAmount || 0),
      targetAmount,
      targetDate,
      coverUrl,
    },
  );

  const goal = await getGoalById(userId, id);
  return sendJson(res, 201, { goal: withProgress(goal) });
}

async function updateGoal(res, userId, pathname, body) {
  const id = getId(pathname);
  const current = await getGoalById(userId, id);
  if (!current) return sendJson(res, 404, { message: 'Goal tidak ditemukan' });

  await query(
    `UPDATE goals SET
      title = :title,
      category = :category,
      target_amount = :targetAmount,
      target_date = :targetDate,
      cover_url = :coverUrl,
      status = :status
     WHERE id = :id AND user_id = :userId`,
    {
      id,
      userId,
      title: body.title ?? current.title,
      category: body.category ?? current.category,
      targetAmount: body.targetAmount == null ? current.targetAmount : positiveNumber(body.targetAmount, 'targetAmount'),
      targetDate: body.targetDate ?? current.targetDate,
      coverUrl: body.coverUrl ?? current.coverUrl,
      status: body.status ?? current.status,
    },
  );

  const goal = await getGoalById(userId, id);
  return sendJson(res, 200, { goal: withProgress(goal) });
}

async function deleteGoal(res, userId, pathname) {
  const id = getId(pathname);
  const result = await query('DELETE FROM goals WHERE id = :id AND user_id = :userId', { id, userId });
  if (result.affectedRows === 0) return sendJson(res, 404, { message: 'Goal tidak ditemukan' });
  return sendJson(res, 200, { message: 'Goal dihapus' });
}

async function addSavings(res, userId, body) {
  const goalId = required(body.goalId, 'goalId');
  const amount = positiveNumber(body.amount, 'amount');

  const result = await transaction(async (connection) => {
    const [goalRows] = await connection.execute(
      'SELECT * FROM goals WHERE id = :goalId AND user_id = :userId LIMIT 1',
      { goalId, userId },
    );
    if (goalRows.length === 0) return null;

    const goal = mapGoal(goalRows[0]);
    const nextSaved = Number(goal.savedAmount) + amount;
    const nextStatus = nextSaved >= Number(goal.targetAmount) ? 'completed' : goal.status;
    const completedAt = nextStatus === 'completed' ? new Date() : goal.completedAt;

    await connection.execute(
      `UPDATE goals
       SET saved_amount = :nextSaved, status = :nextStatus, completed_at = :completedAt
       WHERE id = :goalId AND user_id = :userId`,
      { nextSaved, nextStatus, completedAt, goalId, userId },
    );

    const transactionId = createId('trx');
    await connection.execute(
      `INSERT INTO transactions
       (id, user_id, goal_id, title, type, amount, category, notes, proof_url, transaction_date)
       VALUES (:id, :userId, :goalId, :title, 'income', :amount, :category, :notes, :proofUrl, :transactionDate)`,
      {
        id: transactionId,
        userId,
        goalId,
        title: body.title || 'Savings Entry',
        amount,
        category: body.category || 'Other',
        notes: body.notes || '',
        proofUrl: body.proofUrl || null,
        transactionDate: body.date ? new Date(body.date) : new Date(),
      },
    );

    return { goalId, transactionId };
  });

  if (!result) return sendJson(res, 404, { message: 'Goal tidak ditemukan' });

  const goal = await getGoalById(userId, result.goalId);
  const transactions = await getTransactions(userId);
  const createdTransaction = transactions.find((item) => item.id === result.transactionId);
  return sendJson(res, 201, { goal: withProgress(goal), transaction: createdTransaction });
}

async function listTransactions(res, userId, urlQuery) {
  let transactions = await getTransactions(userId);
  if (urlQuery.type) transactions = transactions.filter((trx) => trx.type === urlQuery.type);
  if (urlQuery.search) {
    const needle = urlQuery.search.toLowerCase();
    transactions = transactions.filter((trx) =>
      [trx.title, trx.category, trx.goal?.title].filter(Boolean).some((value) => value.toLowerCase().includes(needle)),
    );
  }
  return sendJson(res, 200, { transactions, groups: groupTransactions(transactions) });
}

async function updateProfile(res, userId, body) {
  const current = await getUserById(userId);
  await query(
    'UPDATE users SET full_name = :fullName, email = :email WHERE id = :userId',
    {
      userId,
      fullName: body.fullName ?? current.fullName,
      email: body.email ? String(body.email).toLowerCase() : current.email,
    },
  );
  return sendJson(res, 200, { user: publicUser(await getUserById(userId)) });
}

async function updatePreferences(res, userId, body) {
  const current = await getUserById(userId);
  await query(
    `UPDATE users SET
      biometric_login = :biometricLogin,
      dark_mode = :darkMode,
      notifications = :notifications
     WHERE id = :userId`,
    {
      userId,
      biometricLogin: toBoolNumber(body.biometricLogin ?? current.preferences.biometricLogin),
      darkMode: toBoolNumber(body.darkMode ?? current.preferences.darkMode),
      notifications: toBoolNumber(body.notifications ?? current.preferences.notifications),
    },
  );
  return sendJson(res, 200, { user: publicUser(await getUserById(userId)) });
}

async function changePassword(res, userId, body) {
  const currentPassword = required(body.currentPassword, 'currentPassword');
  const newPassword = required(body.newPassword, 'newPassword');
  const user = await getUserById(userId);

  if (!verifyPassword(currentPassword, user)) return sendJson(res, 401, { message: 'Password lama salah' });

  const hashed = hashPassword(newPassword);
  await query(
    'UPDATE users SET password_hash = :passwordHash, salt = :salt WHERE id = :userId',
    { userId, passwordHash: hashed.hash, salt: hashed.salt },
  );
  return sendJson(res, 200, { message: 'Password berhasil diganti' });
}

async function reports(res, userId, urlQuery) {
  const goals = await getGoals(userId);
  const transactions = (await getTransactions(userId)).filter((trx) => trx.type === 'income');
  const totalSaved = transactions.reduce((total, trx) => total + Number(trx.amount), 0);
  const targetTotal = goals.reduce((total, goal) => total + Number(goal.targetAmount || 0), 0);

  return sendJson(res, 200, {
    range: urlQuery.range || '2024',
    summary: {
      totalSaved,
      averageMonthly: Math.round(totalSaved / 12),
      targetProgress: targetTotal ? Math.round((totalSaved / targetTotal) * 100) : 0,
      growthPercent: 12.5,
    },
    savingsGrowth: [
      { month: 'Jan', amount: 3000 },
      { month: 'Feb', amount: 4500 },
      { month: 'Mar', amount: 4000 },
      { month: 'Apr', amount: 6000 },
      { month: 'May', amount: 8500 },
    ],
    categoryDistribution: [
      { category: 'Emergency', percent: 45 },
      { category: 'Travel', percent: 30 },
      { category: 'Invest', percent: 15 },
      { category: 'Other', percent: 10 },
    ],
  });
}

async function exportReport(res, userId, urlQuery) {
  return sendJson(res, 200, {
    format: urlQuery.format || 'json',
    generatedAt: new Date().toISOString(),
    goals: (await getGoals(userId)).map(withProgress),
    transactions: await getTransactions(userId),
  });
}

async function getUserById(id) {
  const rows = await query('SELECT * FROM users WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapUser(rows[0]) : null;
}

async function getGoalById(userId, id) {
  const rows = await query('SELECT * FROM goals WHERE id = :id AND user_id = :userId LIMIT 1', { id, userId });
  return rows[0] ? mapGoal(rows[0]) : null;
}

async function getGoals(userId) {
  const rows = await query('SELECT * FROM goals WHERE user_id = :userId ORDER BY created_at DESC', { userId });
  return rows.map(mapGoal);
}

async function getTransactions(userId) {
  const rows = await query(
    `SELECT
      t.*,
      g.title AS goal_title,
      g.category AS goal_category
     FROM transactions t
     LEFT JOIN goals g ON g.id = t.goal_id
     WHERE t.user_id = :userId
     ORDER BY t.transaction_date DESC`,
    { userId },
  );
  return rows.map(mapTransaction);
}

function mapUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    salt: row.salt,
    preferences: {
      biometricLogin: Boolean(row.biometric_login),
      darkMode: Boolean(row.dark_mode),
      notifications: Boolean(row.notifications),
    },
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function mapAdmin(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    salt: row.salt,
    role: row.role,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function mapGoal(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category,
    savedAmount: Number(row.saved_amount),
    targetAmount: Number(row.target_amount),
    targetDate: row.target_date ? toDateOnly(row.target_date) : null,
    coverUrl: row.cover_url,
    status: row.status,
    completedAt: toIso(row.completed_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function mapTransaction(row) {
  return {
    id: row.id,
    userId: row.user_id,
    goalId: row.goal_id,
    title: row.title,
    type: row.type,
    amount: Number(row.amount),
    category: row.category,
    notes: row.notes || '',
    proofUrl: row.proof_url,
    date: toIso(row.transaction_date),
    createdAt: toIso(row.created_at),
    goal: row.goal_id
      ? {
          id: row.goal_id,
          title: row.goal_title,
          category: row.goal_category,
        }
      : null,
  };
}

function withProgress(goal) {
  const progress = goal.targetAmount ? Math.min(Number(goal.savedAmount || 0) / Number(goal.targetAmount), 1) : 0;
  return { ...goal, progress, percentage: Math.round(progress * 100) };
}

function groupTransactions(transactions) {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  const groups = {};
  for (const trx of transactions) {
    const dateName = new Date(trx.date).toDateString();
    const label = dateName === today ? 'Today' : dateName === yesterday ? 'Yesterday' : dateName;
    groups[label] = groups[label] || [];
    groups[label].push(trx);
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

function required(value, field) {
  if (value == null || String(value).trim() === '') throw new Error(`${field} wajib diisi`);
  return String(value).trim();
}

function positiveNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new Error(`${field} harus lebih dari 0`);
  return number;
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function toBoolNumber(value) {
  return value ? 1 : 0;
}

function toIso(value) {
  return value ? new Date(value).toISOString() : null;
}

function toDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

module.exports = { createApp, handleRequest };
