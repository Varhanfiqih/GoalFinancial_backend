function adminLoginPage() {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ethena Admin Login</title>
  <style>
    :root {
      --bg: #101321;
      --panel: #202437;
      --panel-soft: #292e43;
      --line: rgba(255,255,255,.09);
      --text: #f8f9ff;
      --muted: #9da6bb;
      --primary: #6679ff;
      --purple: #8b5cf6;
      --green: #71d6c3;
      --danger: #ff7380;
      --shadow: 0 28px 90px rgba(0,0,0,.34);
    }
    * { box-sizing: border-box; }
    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 12% 8%, rgba(102,121,255,.30), transparent 30%),
        radial-gradient(circle at 88% 16%, rgba(113,214,195,.16), transparent 28%),
        linear-gradient(135deg, #101321 0%, #171a29 60%, #0d101b 100%);
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,.85), transparent 86%);
    }
    .shell {
      position: relative;
      width: min(980px, 100%);
      min-height: 560px;
      display: grid;
      grid-template-columns: .95fr 1.05fr;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: 28px;
      background: rgba(26,30,46,.82);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }
    .showcase {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 34px;
      padding: 34px;
      background:
        radial-gradient(circle at 26% 30%, rgba(102,121,255,.22), transparent 36%),
        linear-gradient(145deg, rgba(102,121,255,.10), rgba(113,214,195,.06));
      border-right: 1px solid var(--line);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border-radius: 15px;
      color: white;
      font-weight: 900;
      background: linear-gradient(135deg, var(--primary), var(--purple));
      box-shadow: 0 14px 30px rgba(102,121,255,.28);
    }
    h1, h2, h3, p { margin: 0; }
    .brand h1 {
      font-size: 17px;
      letter-spacing: .02em;
    }
    .brand p, .muted { color: var(--muted); }
    .hero {
      max-width: 420px;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: #d5dbff;
      background: rgba(255,255,255,.06);
      font-size: 12px;
      font-weight: 900;
    }
    .hero h2 {
      margin-top: 18px;
      font-size: clamp(34px, 4.4vw, 48px);
      line-height: 1.03;
      letter-spacing: -.055em;
    }
    .hero p {
      max-width: 390px;
      margin-top: 14px;
      color: #b9c1d6;
      font-size: 15px;
      line-height: 1.65;
    }
    .mock-card {
      width: min(100%, 430px);
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background: rgba(15,18,31,.62);
      box-shadow: 0 16px 46px rgba(0,0,0,.22);
    }
    .metric {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
    }
    .metric strong {
      display: block;
      margin-top: 4px;
      font-size: 27px;
      letter-spacing: -.035em;
    }
    .chart {
      height: 112px;
      display: flex;
      align-items: end;
      gap: 9px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }
    .bar {
      flex: 1;
      min-width: 9px;
      border-radius: 999px 999px 7px 7px;
      background: linear-gradient(180deg, var(--green), var(--primary));
    }
    .content {
      display: grid;
      place-items: center;
      padding: 38px;
      background: rgba(12,15,27,.46);
    }
    .card {
      width: min(390px, 100%);
      padding: 30px;
      border: 1px solid var(--line);
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.032));
      box-shadow: 0 22px 60px rgba(0,0,0,.21);
    }
    .card h3 {
      font-size: 28px;
      line-height: 1.1;
      letter-spacing: -.035em;
    }
    .card > p {
      margin-top: 10px;
      color: var(--muted);
      line-height: 1.6;
      font-size: 15px;
    }
    form {
      display: grid;
      gap: 15px;
      margin-top: 24px;
    }
    label {
      display: grid;
      gap: 8px;
      color: #d0d7ea;
      font-size: 13px;
      font-weight: 800;
    }
    input {
      width: 100%;
      border: 1px solid rgba(255,255,255,.11);
      border-radius: 14px;
      padding: 14px 15px;
      font: inherit;
      color: var(--text);
      outline: none;
      background: rgba(10,13,24,.62);
      transition: .18s ease;
    }
    input::placeholder { color: #68728a; }
    input:focus {
      border-color: rgba(102,121,255,.86);
      box-shadow: 0 0 0 4px rgba(102,121,255,.15);
    }
    button {
      width: 100%;
      border: 0;
      border-radius: 15px;
      margin-top: 5px;
      padding: 14px 18px;
      font: inherit;
      font-weight: 900;
      color: white;
      cursor: pointer;
      background: linear-gradient(135deg, var(--primary), var(--purple));
      box-shadow: 0 16px 34px rgba(102,121,255,.28);
      transition: transform .18s ease, filter .18s ease;
    }
    button:hover { transform: translateY(-1px); filter: brightness(1.05); }
    button:disabled { cursor: wait; opacity: .78; transform: none; }
    .error {
      display: none;
      padding: 12px 14px;
      border: 1px solid rgba(255,115,128,.26);
      border-radius: 14px;
      background: rgba(255,115,128,.12);
      color: #ffd0d5;
      font-size: 14px;
    }
    @media (max-width: 900px) {
      body { padding: 18px; }
      .shell {
        min-height: auto;
        grid-template-columns: 1fr;
      }
      .showcase {
        min-height: auto;
        padding: 26px;
        border-right: 0;
        border-bottom: 1px solid var(--line);
      }
      .hero h2 { font-size: clamp(30px, 8vw, 42px); }
      .mock-card { display: none; }
      .content { padding: 26px; }
    }
    @media (max-width: 480px) {
      body { padding: 0; }
      .shell {
        min-height: 100vh;
        border: 0;
        border-radius: 0;
      }
      .card { padding: 24px; border-radius: 21px; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="showcase" aria-hidden="true">
      <div class="brand">
        <div class="logo">E</div>
        <div>
          <h1>ETHENA ADMIN</h1>
          <p>Financial goals control center</p>
        </div>
      </div>

      <div class="hero">
        <span class="eyebrow">● Realtime mobile insight</span>
        <h2>Kelola tabungan dengan dashboard yang rapi.</h2>
        <p>Pantau pengguna mobile, goals, transaksi, dan laporan keuangan dalam satu admin panel yang modern.</p>
      </div>

      <div class="mock-card">
        <div class="metric">
          <div>
            <span class="muted">Total Savings</span>
            <strong>Rp 34,1 jt</strong>
          </div>
          <span class="eyebrow">+12.58%</span>
        </div>
        <div class="chart">
          <span class="bar" style="height:42%"></span>
          <span class="bar" style="height:64%"></span>
          <span class="bar" style="height:38%"></span>
          <span class="bar" style="height:76%"></span>
          <span class="bar" style="height:54%"></span>
          <span class="bar" style="height:88%"></span>
          <span class="bar" style="height:59%"></span>
          <span class="bar" style="height:72%"></span>
          <span class="bar" style="height:47%"></span>
          <span class="bar" style="height:81%"></span>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="card">
        <h3>Login Admin</h3>
        <p>Masuk untuk mengelola dashboard backend Ethena dan memantau aktivitas aplikasi mobile.</p>

        <form id="loginForm">
          <div class="error" id="errorBox"></div>
          <label>
            Email Admin
            <input name="email" type="email" placeholder="Masukkan email admin" autocomplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Masukkan password" autocomplete="current-password" required />
          </label>
          <button id="submitButton" type="submit">Masuk Dashboard</button>
        </form>
      </div>
    </section>
  </main>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      var errorBox = document.getElementById('errorBox');
      var button = document.getElementById('submitButton');
      var form = new FormData(event.currentTarget);

      errorBox.style.display = 'none';
      button.disabled = true;
      button.textContent = 'Memproses...';

      try {
        var response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.get('email'),
            password: form.get('password')
          })
        });
        var data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Login gagal. Cek email dan password admin.');
        }
        window.location.href = '/admin';
      } catch (error) {
        errorBox.textContent = error.message;
        errorBox.style.display = 'block';
      } finally {
        button.disabled = false;
        button.textContent = 'Masuk Dashboard';
      }
    });
  </script>
</body>
</html>`;
}

module.exports = { adminLoginPage };
