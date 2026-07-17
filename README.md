# Ethena Backend

Backend Node.js + MySQL untuk aplikasi mobile Ethena Smart Saving.

Backend ini juga menyediakan dashboard admin berbasis web untuk memantau pengguna mobile, goals, transaksi, dan ringkasan tabungan.

## Kenapa `localhost:3000` Tadi Route Not Found?

Sebelumnya root route `/` belum dibuat, jadi browser menampilkan:

```json
{ "message": "Route not found" }
```

Sekarang `/` sudah menjadi dashboard admin. Endpoint health tetap:

```text
http://localhost:3000/health
```

Dashboard admin:

```text
http://localhost:3000
http://localhost:3000/admin
```

Login admin:

```text
http://localhost:3000/admin/login
```

Default admin setelah seeder:

```text
email: admin@ethena.local
password: admin123
```

## Deploy ke Vercel

Backend sudah disiapkan untuk Vercel melalui `api/index.js` dan `vercel.json`.

Saat import project di Vercel, gunakan pengaturan:

```text
Root Directory: Backend
Framework Preset: Other
Build Command: -
Output Directory: -
Install Command: npm install
```

Tambahkan Environment Variables di Vercel:

```env
JWT_SECRET=isi-dengan-secret-yang-kuat
DB_HOST=host-database-online
DB_PORT=3306
DB_USER=user-database
DB_PASSWORD=password-database
DB_NAME=ethena_db
```

Catatan: Vercel tidak bisa memakai MySQL lokal seperti `localhost` dari XAMPP/Laragon. Gunakan database MySQL online, lalu jalankan migration dan seed ke database tersebut sebelum dashboard dipakai.

## Setup MySQL

1. Pastikan MySQL hidup. Bisa pakai XAMPP, Laragon, MySQL Workbench, atau service MySQL biasa.

2. Buat file `.env` dari contoh:

```bash
cd Backend
copy .env.example .env
```

3. Sesuaikan isi `.env`:

```env
PORT=3000
JWT_SECRET=ubah-secret-ini

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ethena_db
```

Kalau MySQL kamu pakai password, isi `DB_PASSWORD`.

4. Install dependency:

```bash
npm install
```

5. Jalankan migration untuk membuat database dan tabel:

```bash
npm run migrate
```

6. Jalankan seeder untuk mengisi data demo:

```bash
npm run seed
```

Atau pakai shortcut untuk menjalankan migration + seeder sekaligus:

```bash
npm run db:init
```

7. Jalankan server:

```bash
npm start
```

Default API:

```text
http://localhost:3000
```

Demo login:

```text
email: alex.morgan@example.com
password: password123
```

Demo admin:

```text
email: admin@ethena.local
password: admin123
```

## Auth

Semua endpoint `/api/*` selain register dan login membutuhkan header:

```text
Authorization: Bearer <token>
```

### Register

```http
POST /api/auth/register
```

```json
{
  "fullName": "Alex Morgan",
  "email": "alex@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "alex.morgan@example.com",
  "password": "password123"
}
```

## Endpoint Mobile

```text
GET    /
GET    /admin
GET    /health

GET    /api/auth/me
POST   /api/auth/logout

GET    /api/dashboard

GET    /api/goals
GET    /api/goals?status=active
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id

POST   /api/savings

GET    /api/transactions
GET    /api/transactions?type=income
GET    /api/transactions?search=emergency

GET    /api/profile
PUT    /api/profile
PATCH  /api/profile/preferences
PUT    /api/profile/password

GET    /api/reports
GET    /api/reports/export
```

## Endpoint Admin

Endpoint ini dipakai dashboard admin web:

```text
GET /api/admin/summary
GET /api/admin/users
GET /api/admin/goals
GET /api/admin/transactions
```

## Migration dan Seeder

Folder migration:

```text
Backend/database/migrations
```

Folder seeder:

```text
Backend/database/seeders
```

Command yang tersedia:

```bash
npm run migrate
npm run seed
npm run db:init
npm run db:reset
```

`db:reset` akan menghapus database sesuai `DB_NAME`. Setelah reset, jalankan lagi:

```bash
npm run migrate
npm run seed
```

## Payload Create Goal

```json
{
  "title": "New Laptop",
  "category": "Electronics",
  "targetAmount": 15000000,
  "targetDate": "2026-12-20",
  "coverUrl": null
}
```

## Payload Add Savings

Gunakan `goalId` dari response `GET /api/goals`.

```json
{
  "goalId": "goal_emergency",
  "amount": 150000,
  "category": "Salary",
  "notes": "Daily save",
  "date": "2026-07-16T10:00:00.000Z",
  "proofUrl": null
}
```

## File Database

Migration SQL ada di:

```text
Backend/database/migrations/001_create_core_tables.sql
```

Seeder demo ada di:

```text
Backend/database/seeders/001_demo_data.js
```
