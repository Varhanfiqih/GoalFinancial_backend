function adminPage(page = 'dashboard') {
  const currentPage = ['dashboard', 'users', 'goals', 'transactions', 'reports', 'settings'].includes(page)
    ? page
    : 'dashboard';

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ethena Admin Dashboard</title>
  <style>
    :root {
      --bg: #171a29;
      --sidebar: #292d3d;
      --card: #2b3044;
      --card-2: #222638;
      --line: rgba(255,255,255,.075);
      --text: #f8f9ff;
      --muted: #9ca6bd;
      --primary: #6679ff;
      --green: #63d7b4;
      --red: #ff7380;
      --yellow: #f4bf75;
      --purple: #9b7bff;
      --shadow: 0 12px 34px rgba(0,0,0,.18);
    }
    * { box-sizing: border-box; }
    html {
      min-height: 100%;
      overflow-y: auto;
    }
    body {
      margin: 0;
      min-height: 100%;
      overflow-y: auto;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 82% 0%, rgba(102,121,255,.18), transparent 30%),
        linear-gradient(135deg, #1b1e2d, #151827 68%);
    }
    h1, h2, h3, p { margin: 0; }
    button, input { font: inherit; }
    .layout {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 238px minmax(0, 1fr);
      align-items: start;
    }
    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px 14px;
      overflow-y: auto;
      background: rgba(41,45,61,.96);
      border-right: 1px solid var(--line);
      box-shadow: 18px 0 50px rgba(0,0,0,.15);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 8px 22px;
    }
    .logo {
      width: 36px;
      height: 36px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), #8b5cf6);
      color: white;
      font-weight: 900;
      box-shadow: 0 13px 28px rgba(102,121,255,.28);
    }
    .brand strong { display: block; font-size: 14px; letter-spacing: .02em; }
    .brand span, .menu-title, .muted { color: var(--muted); }
    .brand span { font-size: 11px; }
    .menu-title {
      margin: 14px 10px 8px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .nav-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin: 3px 0;
      padding: 10px 11px;
      border-radius: 11px;
      color: #c9d0e2;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
    }
    .nav-item span:first-child {
      display: inline-flex;
      align-items: center;
      gap: 9px;
    }
    .nav-icon {
      width: 24px;
      height: 24px;
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: #dfe4ff;
      background: rgba(255,255,255,.065);
      font-size: 11px;
      font-style: normal;
      font-weight: 900;
    }
    .nav-item.active, .nav-item:hover {
      color: white;
      background: rgba(102,121,255,.22);
    }
    .sidebar-footer {
      margin-top: auto;
      padding-top: 16px;
    }
    .admin-card {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      padding: 11px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(255,255,255,.075), rgba(255,255,255,.035));
    }
    .admin-card strong,
    .admin-card span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .admin-card strong {
      font-size: 13px;
      letter-spacing: -.01em;
    }
    .admin-card span {
      margin-top: 2px;
      color: var(--muted);
      font-size: 11px;
    }
    .badge {
      min-width: 22px;
      padding: 2px 7px;
      border-radius: 999px;
      color: white;
      background: var(--primary);
      font-size: 10px;
      font-weight: 900;
      text-align: center;
    }
    .badge.hidden { display: none; }
    .main {
      min-width: 0;
      min-height: 100vh;
      padding: 18px;
      padding-bottom: 36px;
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin: -18px -18px 18px;
      padding: 14px 18px;
      border-bottom: 1px solid var(--line);
      background: rgba(34,38,56,.86);
      backdrop-filter: blur(18px);
    }
    .search {
      width: min(380px, 100%);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 13px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255,255,255,.045);
      color: var(--muted);
    }
    .search input {
      width: 100%;
      border: 0;
      outline: 0;
      color: var(--text);
      background: transparent;
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .logout, .notification-button {
      border: 0;
      cursor: pointer;
      color: var(--text);
      background: rgba(255,255,255,.06);
    }
    .notification-wrap {
      position: relative;
    }
    .notification-button {
      width: 43px;
      height: 43px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border: 1px solid var(--line);
      border-radius: 14px;
      transition: transform .18s ease, border-color .18s ease, background .18s ease;
    }
    .notification-button:hover {
      transform: translateY(-1px);
      border-color: rgba(102,121,255,.42);
      background: rgba(102,121,255,.16);
    }
    .notification-button svg {
      width: 20px;
      height: 20px;
      stroke: #dfe4ff;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .notification-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      min-width: 18px;
      height: 18px;
      display: inline-grid;
      place-items: center;
      padding: 0 5px;
      border: 2px solid #222638;
      border-radius: 999px;
      color: white;
      background: var(--red);
      font-size: 10px;
      font-weight: 900;
    }
    .notification-panel {
      position: absolute;
      right: 0;
      top: calc(100% + 10px);
      z-index: 20;
      width: min(360px, calc(100vw - 28px));
      display: none;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(34,38,56,.98);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .notification-panel.show { display: block; }
    .notification-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 13px 14px;
      border-bottom: 1px solid var(--line);
    }
    .notification-head strong {
      font-size: 13px;
    }
    .notification-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .notification-clear,
    .notification-remove {
      border: 1px solid var(--line);
      color: #ffd0d5;
      background: rgba(255,115,128,.10);
      cursor: pointer;
      font-weight: 900;
    }
    .notification-clear {
      padding: 6px 9px;
      border-radius: 999px;
      font-size: 10px;
    }
    .notification-clear:disabled {
      cursor: default;
      opacity: .45;
    }
    .notification-list {
      max-height: 320px;
      overflow-y: auto;
    }
    .notification-item {
      display: grid;
      grid-template-columns: 30px 1fr auto;
      align-items: start;
      gap: 10px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255,255,255,.055);
    }
    .notification-item:last-child { border-bottom: 0; }
    .notification-dot {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      color: #dfe4ff;
      background: rgba(102,121,255,.18);
      font-size: 11px;
      font-weight: 900;
    }
    .notification-item h3 {
      margin: 0 0 3px;
      font-size: 12px;
      line-height: 1.35;
    }
    .notification-item p {
      margin: 0;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.45;
    }
    .notification-remove {
      width: 28px;
      height: 28px;
      display: inline-grid;
      place-items: center;
      border-radius: 9px;
      font-size: 16px;
      line-height: 1;
    }
    .notification-remove:hover,
    .notification-clear:hover {
      background: rgba(255,115,128,.18);
    }
    .avatar, .mini-avatar {
      display: grid;
      place-items: center;
      border-radius: 50%;
      font-weight: 900;
    }
    .avatar {
      width: 38px;
      height: 38px;
      font-size: 12px;
      background: linear-gradient(135deg, var(--yellow), var(--purple));
      color: #181a27;
    }
    .mini-avatar {
      width: 30px;
      height: 30px;
      font-size: 12px;
      flex: 0 0 auto;
      background: rgba(102,121,255,.22);
      color: #dfe4ff;
    }
    .logout, .form-button {
      padding: 9px 12px;
      border-radius: 11px;
      font-size: 13px;
      font-weight: 900;
      border: 1px solid var(--line);
    }
    .form-button {
      color: white;
      background: linear-gradient(135deg, rgba(102,121,255,.86), rgba(139,92,246,.86));
    }
    .logout {
      width: 100%;
      margin-top: 10px;
      background: rgba(255,115,128,.14);
      color: #ffd0d5;
    }
    .logout:hover { background: rgba(255,115,128,.22); }
    .page-title {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
    }
    .page-title h1 {
      font-size: 21px;
      letter-spacing: -.03em;
    }
    .breadcrumb {
      color: var(--muted);
      font-size: 12px;
    }
    .page-block { display: none; }
    .page-block.active { display: block; }
    .page-block.active.grid,
    .page-block.active.kpi-grid,
    .page-block.active.dashboard-grid,
    .page-block.active.settings-grid {
      display: grid;
    }
    .kpi-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 13px;
      margin-bottom: 14px;
    }
    .grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 14px;
      margin-bottom: 14px;
    }
    .dashboard-grid {
      grid-template-columns: minmax(0, 1.45fr) minmax(330px, .55fr);
      gap: 14px;
      margin-bottom: 14px;
    }
    .settings-grid {
      grid-template-columns: minmax(280px, .78fr) minmax(0, 1.22fr);
      gap: 14px;
      align-items: start;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(43,48,68,.88);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .section { padding: 15px; }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 13px;
    }
    .section-head h2 {
      font-size: 14px;
      letter-spacing: -.02em;
    }
    .kpi {
      min-height: 106px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .kpi::after {
      content: "";
      position: absolute;
      right: 14px;
      top: 16px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: conic-gradient(var(--primary) 68%, rgba(255,255,255,.10) 0);
      mask: radial-gradient(circle, transparent 52%, #000 54%);
    }
    .kpi:nth-child(2)::after { background: conic-gradient(var(--green) 56%, rgba(255,255,255,.10) 0); }
    .kpi:nth-child(3)::after { background: conic-gradient(var(--yellow) 78%, rgba(255,255,255,.10) 0); }
    .kpi:nth-child(4)::after { background: conic-gradient(var(--purple) 46%, rgba(255,255,255,.10) 0); }
    .kpi-label {
      color: #c3cadb;
      font-size: 11px;
      font-weight: 800;
    }
    .kpi-value {
      margin-top: 8px;
      font-size: clamp(20px, 2.2vw, 26px);
      line-height: 1;
      font-weight: 900;
      letter-spacing: -.04em;
    }
    .trend {
      display: inline-flex;
      color: var(--green);
      font-size: 12px;
      font-weight: 800;
    }
    .trend.red { color: var(--red); }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 9px;
      border-radius: 999px;
      color: #dbe0ff;
      background: rgba(102,121,255,.16);
      font-size: 11px;
      font-weight: 900;
      white-space: nowrap;
    }
    .pill.good { color: #c6ffef; background: rgba(99,215,180,.14); }
    .pill.bad { color: #ffd0d5; background: rgba(255,115,128,.14); }
    .pill.warn { color: #ffe5bd; background: rgba(244,191,117,.13); }
    .promo {
      padding: 16px;
      min-height: 126px;
      background:
        radial-gradient(circle at 85% 20%, rgba(255,255,255,.28), transparent 24%),
        linear-gradient(135deg, #6276ee, #7857e8);
    }
    .promo h2 {
      max-width: 260px;
      font-size: 17px;
      line-height: 1.35;
      letter-spacing: -.03em;
    }
    .promo p { margin-top: 8px; color: #eef1ff; font-size: 13px; }
    .side-stack {
      display: grid;
      gap: 14px;
    }
    .chart-summary {
      display: flex;
      gap: 22px;
      flex-wrap: wrap;
      margin: 4px 0 18px;
    }
    .chart-summary strong {
      display: block;
      margin-bottom: 3px;
      font-size: 20px;
      letter-spacing: -.03em;
    }
    .bars {
      height: 190px;
      display: flex;
      align-items: end;
      gap: 12px;
      padding: 16px 8px 0;
      border-top: 1px solid var(--line);
      background:
        linear-gradient(to bottom, transparent 24%, rgba(255,255,255,.045) 25%, transparent 26%),
        linear-gradient(to bottom, transparent 49%, rgba(255,255,255,.045) 50%, transparent 51%),
        linear-gradient(to bottom, transparent 74%, rgba(255,255,255,.045) 75%, transparent 76%);
    }
    .bar-group {
      flex: 1;
      min-width: 22px;
      height: 100%;
      display: flex;
      align-items: end;
      justify-content: center;
      gap: 5px;
      position: relative;
    }
    .bar-group span {
      width: 11px;
      min-height: 8px;
      border-radius: 999px 999px 5px 5px;
    }
    .bar-income { background: linear-gradient(180deg, var(--green), #4aa3ff); }
    .bar-outcome { background: linear-gradient(180deg, var(--yellow), #ec6f7e); opacity: .88; }
    .bar-label {
      position: absolute;
      bottom: -24px;
      left: 50%;
      transform: translateX(-50%);
      color: var(--muted);
      font-size: 11px;
      white-space: nowrap;
    }
    .legend {
      display: flex;
      gap: 14px;
      justify-content: center;
      margin-top: 32px;
      color: var(--muted);
      font-size: 12px;
    }
    .dot {
      width: 9px;
      height: 9px;
      display: inline-block;
      margin-right: 6px;
      border-radius: 50%;
      background: var(--green);
    }
    .dot.yellow { background: var(--yellow); }
    .progress-list {
      display: grid;
      gap: 12px;
    }
    .progress-item {
      display: grid;
      grid-template-columns: 72px 1fr 38px;
      align-items: center;
      gap: 10px;
      color: #cbd2e4;
      font-size: 12px;
    }
    .track {
      height: 7px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
    }
    .fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--primary), var(--green));
    }
    .table-wrap {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      min-width: 680px;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px 9px;
      border-top: 1px solid var(--line);
      text-align: left;
      vertical-align: middle;
      font-size: 12px;
    }
    th {
      color: var(--muted);
      font-size: 10px;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    td { color: #dce1ef; }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 170px;
    }
    .field, .settings-form {
      display: grid;
      gap: 12px;
    }
    .settings-form {
      gap: 14px;
    }
    .field {
      gap: 8px;
      color: #cbd2e4;
      font-size: 12px;
      font-weight: 800;
    }
    .field input,
    .field select {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 11px;
      padding: 11px 12px;
      color: var(--text);
      outline: none;
      background: rgba(255,255,255,.055);
    }
    .field select option {
      color: #171a29;
    }
    .field input:focus,
    .field select:focus {
      border-color: rgba(102,121,255,.86);
      box-shadow: 0 0 0 4px rgba(102,121,255,.14);
    }
    .settings-profile-card {
      min-height: 100%;
      background:
        radial-gradient(circle at 84% 10%, rgba(99,215,180,.17), transparent 28%),
        linear-gradient(145deg, rgba(43,48,68,.94), rgba(34,38,56,.92));
    }
    .settings-identity {
      display: grid;
      justify-items: center;
      gap: 10px;
      padding: 10px 0 18px;
      text-align: center;
      border-bottom: 1px solid var(--line);
    }
    .settings-avatar {
      width: 76px;
      height: 76px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.20);
      border-radius: 24px;
      color: #171a29;
      background: linear-gradient(135deg, var(--yellow), var(--green));
      box-shadow: 0 18px 36px rgba(99,215,180,.16);
      font-size: 24px;
      font-weight: 900;
    }
    .settings-identity h2 {
      margin: 0;
      font-size: 18px;
      letter-spacing: -.03em;
    }
    .settings-identity p {
      color: var(--muted);
      font-size: 12px;
      word-break: break-word;
    }
    .settings-metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 14px;
    }
    .settings-metric {
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: rgba(255,255,255,.045);
    }
    .settings-metric span {
      display: block;
      color: var(--muted);
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .settings-metric strong {
      display: block;
      margin-top: 6px;
      font-size: 13px;
      color: #f5f7ff;
    }
    .settings-stack {
      display: grid;
      gap: 14px;
    }
    .settings-card-head {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      align-items: center;
      gap: 11px;
      margin-bottom: 14px;
    }
    .settings-icon {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      color: #dfe4ff;
      background: rgba(102,121,255,.18);
      font-size: 16px;
      font-weight: 900;
    }
    .settings-card-head h2 {
      margin: 0;
      font-size: 15px;
      letter-spacing: -.02em;
    }
    .settings-card-head p {
      margin-top: 3px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }
    .settings-system {
      grid-column: 1 / -1;
    }
    .settings-system .info-list {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .form-button {
      width: fit-content;
      cursor: pointer;
    }
    .form-button.secondary {
      background: rgba(255,255,255,.07);
      color: #dfe4ff;
    }
    .user-form-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr)) auto auto;
      gap: 10px;
      align-items: end;
      margin-bottom: 14px;
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(255,255,255,.035);
    }
    .report-filter {
      display: none;
      grid-template-columns: repeat(2, minmax(120px, 1fr)) auto;
      gap: 9px;
      align-items: end;
      margin-bottom: 15px;
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: rgba(255,255,255,.035);
    }
    .report-filter.show { display: grid; }
    .actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .action-button {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 6px 9px;
      color: #dfe4ff;
      background: rgba(255,255,255,.06);
      cursor: pointer;
      font-size: 11px;
      font-weight: 900;
    }
    .action-button.danger {
      color: #ffd0d5;
      background: rgba(255,115,128,.14);
    }
    .message {
      display: none;
      padding: 10px 12px;
      border-radius: 11px;
      font-size: 12px;
      color: #c6ffef;
      background: rgba(99,215,180,.13);
    }
    .message.error-message {
      color: #ffd0d5;
      background: rgba(255,115,128,.13);
    }
    .info-list {
      display: grid;
      gap: 10px;
    }
    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 11px;
      border: 1px solid var(--line);
      border-radius: 12px;
      font-size: 12px;
      background: rgba(255,255,255,.04);
    }
    .info-row strong { text-align: right; }
    .empty, .error {
      padding: 14px;
      border-radius: 12px;
      font-size: 12px;
      color: var(--muted);
      text-align: center;
      background: rgba(255,255,255,.045);
    }
    .error {
      margin-bottom: 14px;
      color: #ffd0d5;
      border: 1px solid rgba(255,115,128,.24);
      background: rgba(255,115,128,.12);
      text-align: left;
    }
    .loading {
      position: fixed;
      inset: auto 22px 22px auto;
      z-index: 10;
      display: none;
      padding: 12px 14px;
      border: 1px solid var(--line);
      border-radius: 13px;
      color: #dfe4ff;
      background: rgba(43,48,68,.92);
      box-shadow: var(--shadow);
    }
    .loading.show { display: block; }
    @media (max-width: 1160px) {
      .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .dashboard-grid, .grid, .settings-grid { grid-template-columns: 1fr; }
      .settings-system .info-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .user-form-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 880px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar {
        position: static;
        height: auto;
        padding: 18px;
      }
      .sidebar-footer {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        align-items: center;
        margin-top: 12px;
        padding-top: 12px;
      }
      .admin-card { min-width: 0; }
      .logout {
        width: auto;
        margin-top: 0;
        white-space: nowrap;
      }
      .nav-list {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 4px;
      }
      .menu-title { display: none; }
      .nav-item { flex: 0 0 auto; width: auto; }
      .nav-item .badge { display: none; }
      .main { padding: 16px; }
      .topbar {
        position: static;
        margin: -16px -16px 16px;
        align-items: center;
      }
      .top-actions { justify-content: flex-end; }
    }
    @media (max-width: 560px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .user-form-grid,
      .report-filter.show { grid-template-columns: 1fr; }
      .page-title { align-items: flex-start; flex-direction: column; }
      .search { width: 100%; }
      .topbar {
        align-items: stretch;
        flex-direction: column;
      }
      .sidebar-footer { grid-template-columns: 1fr; }
      .logout { width: 100%; }
      .settings-metrics,
      .settings-system .info-list { grid-template-columns: 1fr; }
      .settings-card-head {
        grid-template-columns: 38px minmax(0, 1fr);
      }
      .settings-card-head .pill {
        grid-column: 1 / -1;
        width: fit-content;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">E</div>
        <div>
          <strong>ETHENA</strong>
          <span>Admin Dashboard</span>
        </div>
      </div>

      <div class="menu-title">Menu</div>
      <nav class="nav-list" aria-label="Admin navigation">
        <a class="nav-item" data-nav="dashboard" href="/admin"><span><i class="nav-icon">D</i>Dashboard</span><span class="badge hidden" id="navDashboard">01</span></a>
        <a class="nav-item" data-nav="users" href="/admin/users"><span><i class="nav-icon">U</i>Users</span><span class="badge hidden" id="navUsers">0</span></a>
        <a class="nav-item" data-nav="goals" href="/admin/goals"><span><i class="nav-icon">G</i>Goals</span><span class="badge hidden" id="navGoals">0</span></a>
        <a class="nav-item" data-nav="transactions" href="/admin/transactions"><span><i class="nav-icon">T</i>Transactions</span><span class="badge hidden" id="navTransactions">0</span></a>
      </nav>

      <div class="menu-title">Apps</div>
      <nav class="nav-list" aria-label="Admin apps">
        <a class="nav-item" data-nav="reports" href="/admin/reports"><span><i class="nav-icon">R</i>Financial Reports</span></a>
        <a class="nav-item" data-nav="settings" href="/admin/settings"><span><i class="nav-icon">S</i>Settings</span></a>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-card">
          <div class="avatar" id="adminAvatar">A</div>
          <div>
            <strong id="adminNameTop">Admin</strong>
            <span id="adminEmailSidebar">admin@ethena.local</span>
          </div>
        </div>
        <button class="logout" id="logoutButton" type="button">Logout</button>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <label class="search">
          <span class="nav-icon">S</span>
          <input id="searchInput" placeholder="Search users, goals, transactions..." />
        </label>
        <div class="top-actions">
          <div class="notification-wrap">
            <button class="notification-button" id="notificationButton" type="button" aria-label="Buka notifikasi" title="Notifikasi">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
                <path d="M13.7 21a2 2 0 0 1-3.4 0"></path>
              </svg>
              <span class="notification-badge" id="notificationBadge">0</span>
            </button>
            <div class="notification-panel" id="notificationPanel">
              <div class="notification-head">
                <strong>Notifikasi Terbaru</strong>
                <div class="notification-actions">
                  <span class="pill" id="notificationTotal">0 aktivitas</span>
                  <button class="notification-clear" id="clearNotificationsButton" type="button">Hapus semua</button>
                </div>
              </div>
              <div class="notification-list" id="notificationList"></div>
            </div>
          </div>
        </div>
      </header>

      <section class="page-title">
        <div>
          <h1 id="pageHeading">Dashboard</h1>
          <p class="muted" id="pageDescription">Pantau pengguna mobile, target tabungan, transaksi, dan laporan keuangan.</p>
        </div>
        <div class="breadcrumb" id="breadcrumb">Ethena / Dashboard</div>
      </section>

      <div id="errorBox"></div>

      <section class="page-block kpi-grid" data-pages="dashboard" id="stats"></section>

      <section class="page-block dashboard-grid" data-pages="dashboard reports">
        <article class="card section">
          <div class="section-head">
            <h2>Savings Analytics</h2>
            <span class="pill">Monthly</span>
          </div>
          <form class="report-filter" id="reportFilterForm">
            <label class="field">
              Dari Tanggal
              <input id="reportStartDate" name="startDate" type="date" />
            </label>
            <label class="field">
              Sampai Tanggal
              <input id="reportEndDate" name="endDate" type="date" />
            </label>
            <button class="form-button secondary" id="reportResetButton" type="button">Reset</button>
          </form>
          <div class="chart-summary">
            <div><strong id="incomeTotal">Rp0</strong><span class="muted">Income</span></div>
            <div><strong id="outcomeTotal">Rp0</strong><span class="muted">Outcome</span></div>
            <div><strong id="ratioTotal">0%</strong><span class="muted">Saving Ratio</span></div>
          </div>
          <div class="bars" id="monthlyBars"></div>
          <div class="legend">
            <span><i class="dot"></i>Income</span>
            <span><i class="dot yellow"></i>Outcome</span>
          </div>
        </article>

        <div class="side-stack">
          <article class="card promo">
            <h2>Admin panel modern untuk aplikasi menabung kamu.</h2>
            <p>Data mobile tersambung lewat API backend Node.js + MySQL.</p>
          </article>

          <article class="card section">
            <div class="section-head">
              <h2>Goal Progress</h2>
              <span class="pill good" id="goalCountPill">0 goals</span>
            </div>
            <div class="progress-list" id="goalProgress"></div>
          </article>
        </div>
      </section>

      <section class="page-block card section" data-pages="users" id="users">
        <div class="section-head">
          <h2>Mobile Users</h2>
          <span class="pill" id="userCount">0 user</span>
        </div>
        <form id="userForm" class="user-form-grid">
          <input type="hidden" name="id" />
          <label class="field">
            Nama User
            <input name="fullName" placeholder="Nama lengkap" required />
          </label>
          <label class="field">
            Email
            <input name="email" type="email" placeholder="email@contoh.com" required />
          </label>
          <label class="field">
            Password
            <input name="password" type="password" placeholder="Wajib saat tambah user" minlength="6" />
          </label>
          <button class="form-button" id="userSubmitButton" type="submit">Tambah User</button>
          <button class="form-button secondary" id="userCancelButton" type="button">Batal Edit</button>
        </form>
        <div class="message" id="userMessage"></div>
        <div id="usersTable"></div>
      </section>

      <section class="page-block card section" data-pages="goals" id="goals">
        <div class="section-head">
          <h2>Goals Terbaru</h2>
          <span class="pill warn">Active & Completed</span>
        </div>
        <div class="message" id="goalMessage"></div>
        <div id="goalsTable"></div>
      </section>

      <section class="page-block card section" data-pages="transactions" id="transactions">
        <div class="section-head">
          <h2>Transaksi Terbaru</h2>
          <span class="pill good" id="transactionCount">0 transaksi</span>
        </div>
        <div class="message" id="transactionMessage"></div>
        <div id="transactionsTable"></div>
      </section>

      <section class="page-block settings-grid" data-pages="settings" id="settings">
        <article class="card section settings-profile-card">
          <div class="settings-identity">
            <div class="settings-avatar" id="settingsAvatar">A</div>
            <div>
              <h2 id="settingsNameText">Admin</h2>
              <p id="settingsEmailText">admin@ethena.local</p>
            </div>
            <span class="pill good">Active Admin</span>
          </div>
          <div class="settings-metrics">
            <div class="settings-metric">
              <span>Role</span>
              <strong id="adminRoleCardText">-</strong>
            </div>
            <div class="settings-metric">
              <span>Session</span>
              <strong>12 Jam</strong>
            </div>
          </div>
        </article>

        <div class="settings-stack">
          <article class="card section">
            <div class="settings-card-head">
              <div class="settings-icon">A</div>
              <div>
                <h2>Profil Admin</h2>
                <p>Perbarui nama dan email admin yang tampil di dashboard.</p>
              </div>
              <span class="pill">Account</span>
            </div>
            <form class="settings-form" id="settingsForm">
              <div class="message" id="settingsMessage"></div>
              <label class="field">
                Nama Admin
                <input id="adminFullNameInput" name="fullName" placeholder="Nama lengkap admin" required />
              </label>
              <label class="field">
                Email Admin
                <input id="adminEmailInput" name="email" type="email" placeholder="admin@ethena.local" required />
              </label>
              <button class="form-button" type="submit">Simpan Profil</button>
            </form>
          </article>

          <article class="card section">
            <div class="settings-card-head">
              <div class="settings-icon">K</div>
              <div>
                <h2>Keamanan Password</h2>
                <p>Gunakan password baru minimal 6 karakter untuk menjaga akses admin.</p>
              </div>
              <span class="pill warn">Security</span>
            </div>
            <form class="settings-form" id="passwordForm">
              <div class="message" id="passwordMessage"></div>
              <label class="field">
                Password Lama
                <input name="currentPassword" type="password" autocomplete="current-password" placeholder="Masukkan password lama" required />
              </label>
              <label class="field">
                Password Baru
                <input name="newPassword" type="password" autocomplete="new-password" placeholder="Minimal 6 karakter" minlength="6" required />
              </label>
              <button class="form-button" type="submit">Update Password</button>
            </form>
          </article>
        </div>

        <article class="card section settings-system">
          <div class="settings-card-head">
            <div class="settings-icon">S</div>
            <div>
              <h2>System Info</h2>
              <p>Status koneksi backend, autentikasi, dan lingkungan API.</p>
            </div>
            <span class="pill good">Backend</span>
          </div>
          <div class="info-list">
            <div class="info-row"><span>API Base</span><strong id="apiBaseText">-</strong></div>
            <div class="info-row"><span>Database</span><strong id="dbStatusText">Checking...</strong></div>
            <div class="info-row"><span>Auth</span><strong>Cookie Admin + Bearer Mobile</strong></div>
            <div class="info-row"><span>Role</span><strong id="adminRoleText">-</strong></div>
          </div>
        </article>
      </section>
    </main>
  </div>

  <div class="loading" id="loadingToast">Memuat data dashboard...</div>

  <script>
    var currentPage = '${currentPage}';
    var rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
    var number = new Intl.NumberFormat('id-ID');
    var state = { summary: {}, users: [], goals: [], transactions: [], admin: null };
    var notificationStorageKey = 'ethena_admin_dismissed_notifications';
    var dismissedNotifications = loadDismissedNotifications();
    var navSeenStorageKey = 'ethena_admin_seen_nav_counts';
    var seenNavCounts = loadSeenNavCounts();
    var pageMeta = {
      dashboard: ['Dashboard', 'Ringkasan utama aplikasi mobile Ethena.', 'Ethena / Dashboard'],
      users: ['Mobile Users', 'Daftar pengguna yang register dan login dari aplikasi mobile.', 'Ethena / Users'],
      goals: ['Saving Goals', 'Pantau semua target tabungan pengguna mobile.', 'Ethena / Goals'],
      transactions: ['Transaction History', 'Riwayat transaksi income dan outcome dari semua pengguna.', 'Ethena / Transactions'],
      reports: ['Financial Reports', 'Analitik pemasukan, pengeluaran, dan rasio tabungan.', 'Ethena / Reports'],
      settings: ['Settings', 'Kelola profil admin, password, dan informasi backend.', 'Ethena / Settings']
    };

    async function loadAdmin() {
      var errorBox = document.getElementById('errorBox');
      var loadingToast = document.getElementById('loadingToast');
      errorBox.innerHTML = '';
      loadingToast.classList.add('show');
      renderPageChrome();

      try {
        var responses = await Promise.all([
          fetchJson('/api/admin/summary'),
          fetchJson('/api/admin/users'),
          fetchJson('/api/admin/goals'),
          fetchJson('/api/admin/transactions'),
          fetchJson('/api/admin/me')
        ]);

        state.summary = responses[0];
        state.users = responses[1].users || [];
        state.goals = responses[2].goals || [];
        state.transactions = responses[3].transactions || [];
        state.admin = responses[4].admin || null;

        renderAll();
        document.getElementById('dbStatusText').textContent = 'Connected';
      } catch (error) {
        document.getElementById('dbStatusText').textContent = 'Disconnected';
        errorBox.innerHTML = '<div class="error"><strong>Dashboard belum bisa dimuat.</strong><br>' + escapeHtml(error.message) + '<br><span class="muted">Pastikan MySQL hidup, database sudah migrate/seed, dan server backend berjalan.</span></div>';
      } finally {
        loadingToast.classList.remove('show');
      }
    }

    async function fetchJson(url, options) {
      var response = await fetch(url, options || {});
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return {};
      }
      var data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengambil data ' + url);
      return data;
    }

    function renderPageChrome() {
      var meta = pageMeta[currentPage] || pageMeta.dashboard;
      document.getElementById('pageHeading').textContent = meta[0];
      document.getElementById('pageDescription').textContent = meta[1];
      document.getElementById('breadcrumb').textContent = meta[2];

      document.querySelectorAll('[data-pages]').forEach(function(block) {
        var pages = block.getAttribute('data-pages').split(' ');
        block.classList.toggle('active', pages.includes(currentPage));
      });

      document.querySelectorAll('[data-nav]').forEach(function(nav) {
        nav.classList.toggle('active', nav.getAttribute('data-nav') === currentPage);
      });
    }

    function renderAll() {
      var query = document.getElementById('searchInput').value.trim().toLowerCase();
      var reportTransactions = currentPage === 'reports' ? filterReportTransactions(state.transactions) : state.transactions;
      renderPageChrome();
      renderStats(state.summary);
      renderAnalytics(reportTransactions);
      renderReportFilter();
      renderGoalProgress(state.goals);
      renderUsers(filterUsers(state.users, query));
      renderGoals(filterGoals(state.goals, query));
      renderTransactions(filterTransactions(state.transactions, query));
      renderNotificationCenter();
      renderSettings();
      markCurrentPageViewed();
      updateNavCounts();
    }

    function renderStats(data) {
      var stats = [
        ['Total Users', number.format(data.totalUsers || state.users.length), '↑ 2.65% sejak minggu lalu', ''],
        ['Active Goals', number.format(data.activeGoals || 0), '↓ 0.82% perlu dipantau', 'red'],
        ['Total Saved', rupiah.format(Number(data.totalSaved || 0)), '↑ 10.51% total tabungan', ''],
        ['Transactions', number.format(data.totalTransactions || state.transactions.length), 'Aktivitas terbaru mobile', '']
      ];

      document.getElementById('stats').innerHTML = stats.map(function(item) {
        return '<article class="card kpi">' +
          '<div><div class="kpi-label">' + item[0] + '</div><div class="kpi-value">' + item[1] + '</div></div>' +
          '<span class="trend ' + item[3] + '">' + item[2] + '</span>' +
        '</article>';
      }).join('');
    }

    function renderAnalytics(transactions) {
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      var now = new Date();
      var monthKeys = [];
      for (var i = 5; i >= 0; i--) {
        var date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthKeys.push({ key: date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0'), label: months[date.getMonth()] });
      }

      var grouped = {};
      monthKeys.forEach(function(month) {
        grouped[month.key] = { income: 0, outcome: 0, label: month.label };
      });

      transactions.forEach(function(trx) {
        var trxDate = new Date(trx.date || trx.createdAt);
        if (Number.isNaN(trxDate.getTime())) return;
        var key = trxDate.getFullYear() + '-' + String(trxDate.getMonth() + 1).padStart(2, '0');
        if (!grouped[key]) return;
        var amount = Number(trx.amount || 0);
        if (trx.type === 'outcome') grouped[key].outcome += amount;
        else grouped[key].income += amount;
      });

      var values = monthKeys.map(function(month) { return grouped[month.key]; });
      var max = values.reduce(function(current, item) {
        return Math.max(current, item.income, item.outcome);
      }, 1);
      var income = values.reduce(function(total, item) { return total + item.income; }, 0);
      var outcome = values.reduce(function(total, item) { return total + item.outcome; }, 0);
      var ratio = income > 0 ? Math.max(0, Math.round(((income - outcome) / income) * 100)) : 0;

      document.getElementById('incomeTotal').textContent = rupiah.format(income);
      document.getElementById('outcomeTotal').textContent = rupiah.format(outcome);
      document.getElementById('ratioTotal').textContent = ratio + '%';
      document.getElementById('monthlyBars').innerHTML = values.map(function(item) {
        var incomeHeight = Math.max(8, Math.round((item.income / max) * 100));
        var outcomeHeight = Math.max(8, Math.round((item.outcome / max) * 100));
        return '<div class="bar-group">' +
          '<span class="bar-income" title="Income ' + rupiah.format(item.income) + '" style="height:' + incomeHeight + '%"></span>' +
          '<span class="bar-outcome" title="Outcome ' + rupiah.format(item.outcome) + '" style="height:' + outcomeHeight + '%"></span>' +
          '<small class="bar-label">' + item.label + '</small>' +
        '</div>';
      }).join('');
    }

    function renderGoalProgress(goals) {
      document.getElementById('goalCountPill').textContent = goals.length + ' goals';
      if (!goals.length) {
        document.getElementById('goalProgress').innerHTML = '<div class="empty">Belum ada goal.</div>';
        return;
      }
      document.getElementById('goalProgress').innerHTML = goals.slice(0, 5).map(function(goal) {
        var percentage = Math.max(0, Math.min(100, Number(goal.percentage || 0)));
        return '<div class="progress-item">' +
          '<span>' + escapeHtml(shortText(goal.title, 10)) + '</span>' +
          '<div class="track"><div class="fill" style="width:' + percentage + '%"></div></div>' +
          '<strong>' + percentage + '%</strong>' +
        '</div>';
      }).join('');
    }

    function renderUsers(users) {
      document.getElementById('userCount').textContent = users.length + ' user';
      if (!users.length) {
        document.getElementById('usersTable').innerHTML = '<div class="empty">Belum ada user yang cocok.</div>';
        return;
      }
      document.getElementById('usersTable').innerHTML = table(
        ['Nama', 'Email', 'Goals', 'Saved', 'Bergabung', 'Aksi'],
        users.map(function(user) {
          return [
            '<div class="user-cell"><div class="mini-avatar">' + initials(user.fullName) + '</div><div><strong>' + escapeHtml(user.fullName) + '</strong><br><span class="muted">Mobile user</span></div></div>',
            escapeHtml(user.email),
            number.format(user.goalCount || 0),
            rupiah.format(Number(user.totalSaved || 0)),
            formatDate(user.createdAt),
            '<div class="actions">' +
              '<button class="action-button" data-user-action="edit" data-id="' + escapeHtml(user.id) + '">Edit</button>' +
              '<button class="action-button" data-user-action="password" data-id="' + escapeHtml(user.id) + '">Reset Password</button>' +
              '<button class="action-button danger" data-user-action="delete" data-id="' + escapeHtml(user.id) + '">Delete</button>' +
            '</div>'
          ];
        })
      );
    }

    function renderGoals(goals) {
      if (!goals.length) {
        document.getElementById('goalsTable').innerHTML = '<div class="empty">Belum ada goal yang cocok.</div>';
        return;
      }
      document.getElementById('goalsTable').innerHTML = table(
        ['Goal', 'User', 'Progress', 'Status', 'Aksi'],
        goals.map(function(goal) {
          var statusClass = goal.status === 'completed' ? 'good' : 'warn';
          return [
            '<strong>' + escapeHtml(goal.title) + '</strong><br><span class="muted">' + rupiah.format(Number(goal.savedAmount || 0)) + ' / ' + rupiah.format(Number(goal.targetAmount || 0)) + '</span>',
            escapeHtml(goal.userName || '-'),
            Number(goal.percentage || 0) + '%',
            '<span class="pill ' + statusClass + '">' + escapeHtml(goal.status || 'active') + '</span>',
            '<div class="actions">' +
              '<button class="action-button" data-goal-action="edit" data-id="' + escapeHtml(goal.id) + '">Edit</button>' +
              '<button class="action-button danger" data-goal-action="delete" data-id="' + escapeHtml(goal.id) + '">Delete</button>' +
            '</div>'
          ];
        })
      );
    }

    function renderTransactions(transactions) {
      document.getElementById('transactionCount').textContent = transactions.length + ' transaksi';
      if (!transactions.length) {
        document.getElementById('transactionsTable').innerHTML = '<div class="empty">Belum ada transaksi yang cocok.</div>';
        return;
      }
      document.getElementById('transactionsTable').innerHTML = table(
        ['Judul', 'User', 'Goal', 'Tipe', 'Amount', 'Tanggal', 'Aksi'],
        transactions.map(function(trx) {
          var typeClass = trx.type === 'income' ? 'good' : 'bad';
          return [
            '<strong>' + escapeHtml(trx.title) + '</strong>',
            escapeHtml(trx.userName || '-'),
            escapeHtml(trx.goalTitle || '-'),
            '<span class="pill ' + typeClass + '">' + escapeHtml(trx.type || '-') + '</span>',
            rupiah.format(Number(trx.amount || 0)),
            formatDate(trx.date),
            '<div class="actions">' +
              '<button class="action-button" data-transaction-action="edit" data-id="' + escapeHtml(trx.id) + '">Edit</button>' +
              '<button class="action-button danger" data-transaction-action="delete" data-id="' + escapeHtml(trx.id) + '">Delete</button>' +
            '</div>'
          ];
        })
      );
    }

    function renderNotifications() {
      var items = [];

      state.transactions.slice(0, 5).forEach(function(trx) {
        items.push({
          type: 'TRX',
          title: (trx.type === 'income' ? 'Transaksi masuk' : 'Transaksi keluar') + ': ' + rupiah.format(Number(trx.amount || 0)),
          description: (trx.userName || 'User') + ' • ' + (trx.title || 'Transaksi') + ' • ' + formatDate(trx.date),
          date: trx.date || trx.createdAt
        });
      });

      state.goals.slice(0, 4).forEach(function(goal) {
        items.push({
          type: 'GOAL',
          title: 'Goal ' + (goal.status === 'completed' ? 'selesai' : 'aktif') + ': ' + (goal.title || '-'),
          description: (goal.userName || 'User') + ' • Progress ' + Number(goal.percentage || 0) + '%',
          date: goal.updatedAt || goal.createdAt
        });
      });

      state.users.slice(0, 3).forEach(function(user) {
        items.push({
          type: 'USER',
          title: 'User mobile terdaftar',
          description: (user.fullName || 'User') + ' • ' + (user.email || '-') + ' • ' + formatDate(user.createdAt),
          date: user.createdAt
        });
      });

      items.sort(function(a, b) {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });
      items = items.slice(0, 8);

      document.getElementById('notificationBadge').textContent = items.length;
      document.getElementById('notificationTotal').textContent = items.length + ' aktivitas';

      if (!items.length) {
        document.getElementById('notificationList').innerHTML = '<div class="empty">Belum ada aktivitas terbaru.</div>';
        return;
      }

      document.getElementById('notificationList').innerHTML = items.map(function(item) {
        return '<article class="notification-item">' +
          '<div class="notification-dot">' + escapeHtml(item.type) + '</div>' +
          '<div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.description) + '</p></div>' +
        '</article>';
      }).join('');
    }

    function buildNotificationItems() {
      var items = [];

      state.transactions.slice(0, 5).forEach(function(trx, index) {
        items.push({
          id: 'trx:' + (trx.id || trx.createdAt || trx.date || index),
          type: 'TRX',
          title: (trx.type === 'income' ? 'Transaksi masuk' : 'Transaksi keluar') + ': ' + rupiah.format(Number(trx.amount || 0)),
          description: (trx.userName || 'User') + ' - ' + (trx.title || 'Transaksi') + ' - ' + formatDate(trx.date),
          date: trx.date || trx.createdAt
        });
      });

      state.goals.slice(0, 4).forEach(function(goal, index) {
        items.push({
          id: 'goal:' + (goal.id || goal.updatedAt || goal.createdAt || index),
          type: 'GOAL',
          title: 'Goal ' + (goal.status === 'completed' ? 'selesai' : 'aktif') + ': ' + (goal.title || '-'),
          description: (goal.userName || 'User') + ' - Progress ' + Number(goal.percentage || 0) + '%',
          date: goal.updatedAt || goal.createdAt
        });
      });

      state.users.slice(0, 3).forEach(function(user, index) {
        items.push({
          id: 'user:' + (user.id || user.createdAt || index),
          type: 'USER',
          title: 'User mobile terdaftar',
          description: (user.fullName || 'User') + ' - ' + (user.email || '-') + ' - ' + formatDate(user.createdAt),
          date: user.createdAt
        });
      });

      items.sort(function(a, b) {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });

      return items.slice(0, 8);
    }

    function renderNotificationCenter() {
      var allItems = buildNotificationItems();
      var items = allItems.filter(function(item) {
        return !dismissedNotifications.includes(item.id);
      });
      var clearButton = document.getElementById('clearNotificationsButton');

      document.getElementById('notificationBadge').textContent = items.length;
      document.getElementById('notificationTotal').textContent = items.length + ' aktivitas';
      clearButton.disabled = items.length === 0;

      if (!items.length) {
        document.getElementById('notificationList').innerHTML = '<div class="empty">Belum ada aktivitas terbaru.</div>';
        return;
      }

      document.getElementById('notificationList').innerHTML = items.map(function(item) {
        return '<article class="notification-item" data-notification-id="' + escapeHtml(item.id) + '">' +
          '<div class="notification-dot">' + escapeHtml(item.type) + '</div>' +
          '<div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.description) + '</p></div>' +
          '<button class="notification-remove" type="button" data-notification-remove="' + escapeHtml(item.id) + '" aria-label="Hapus notifikasi">x</button>' +
        '</article>';
      }).join('');
    }

    function loadDismissedNotifications() {
      try {
        var stored = JSON.parse(localStorage.getItem(notificationStorageKey) || '[]');
        return Array.isArray(stored) ? stored : [];
      } catch (error) {
        return [];
      }
    }

    function saveDismissedNotifications() {
      localStorage.setItem(notificationStorageKey, JSON.stringify(dismissedNotifications));
    }

    function dismissNotification(id) {
      if (!dismissedNotifications.includes(id)) {
        dismissedNotifications.push(id);
        saveDismissedNotifications();
      }
      renderNotificationCenter();
    }

    function clearVisibleNotifications() {
      buildNotificationItems().forEach(function(item) {
        if (!dismissedNotifications.includes(item.id)) {
          dismissedNotifications.push(item.id);
        }
      });
      saveDismissedNotifications();
      renderNotificationCenter();
    }

    function renderSettings() {
      var admin = state.admin || {};
      document.getElementById('adminNameTop').textContent = admin.fullName || 'Admin';
      document.getElementById('adminEmailSidebar').textContent = admin.email || 'admin@ethena.local';
      document.getElementById('adminAvatar').textContent = initials(admin.fullName || 'Admin').slice(0, 1);
      document.getElementById('settingsAvatar').textContent = initials(admin.fullName || 'Admin').slice(0, 2);
      document.getElementById('settingsNameText').textContent = admin.fullName || 'Admin';
      document.getElementById('settingsEmailText').textContent = admin.email || 'admin@ethena.local';
      document.getElementById('adminFullNameInput').value = admin.fullName || '';
      document.getElementById('adminEmailInput').value = admin.email || '';
      document.getElementById('adminRoleText').textContent = admin.role || '-';
      document.getElementById('adminRoleCardText').textContent = admin.role || '-';
      document.getElementById('apiBaseText').textContent = window.location.origin;
    }

    function table(headers, rows) {
      return '<div class="table-wrap"><table><thead><tr>' +
        headers.map(function(head) { return '<th>' + head + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
        rows.map(function(row) {
          return '<tr>' + row.map(function(cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>';
        }).join('') +
        '</tbody></table></div>';
    }

    function filterUsers(users, query) {
      if (!query) return users;
      return users.filter(function(user) {
        return String(user.fullName || '').toLowerCase().includes(query) ||
          String(user.email || '').toLowerCase().includes(query);
      });
    }

    function filterGoals(goals, query) {
      if (!query) return goals;
      return goals.filter(function(goal) {
        return String(goal.title || '').toLowerCase().includes(query) ||
          String(goal.userName || '').toLowerCase().includes(query) ||
          String(goal.status || '').toLowerCase().includes(query);
      });
    }

    function filterTransactions(transactions, query) {
      if (!query) return transactions;
      return transactions.filter(function(trx) {
        return String(trx.title || '').toLowerCase().includes(query) ||
          String(trx.userName || '').toLowerCase().includes(query) ||
          String(trx.goalTitle || '').toLowerCase().includes(query) ||
          String(trx.type || '').toLowerCase().includes(query);
      });
    }

    function filterReportTransactions(transactions) {
      var startValue = document.getElementById('reportStartDate').value;
      var endValue = document.getElementById('reportEndDate').value;
      if (!startValue && !endValue) return transactions;

      var startTime = startValue ? new Date(startValue + 'T00:00:00').getTime() : null;
      var endTime = endValue ? new Date(endValue + 'T23:59:59').getTime() : null;

      return transactions.filter(function(trx) {
        var time = new Date(trx.date || trx.createdAt).getTime();
        if (Number.isNaN(time)) return false;
        if (startTime != null && time < startTime) return false;
        if (endTime != null && time > endTime) return false;
        return true;
      });
    }

    function renderReportFilter() {
      document.getElementById('reportFilterForm').classList.toggle('show', currentPage === 'reports');
    }

    function dateInputValue(value) {
      if (!value) return '';
      var date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 10);
    }

    function navTotals() {
      return {
        users: state.users.length,
        goals: state.goals.length,
        transactions: state.transactions.length
      };
    }

    function loadSeenNavCounts() {
      try {
        var stored = JSON.parse(localStorage.getItem(navSeenStorageKey) || '{}');
        return {
          users: Number(stored.users || 0),
          goals: Number(stored.goals || 0),
          transactions: Number(stored.transactions || 0)
        };
      } catch (error) {
        return { users: 0, goals: 0, transactions: 0 };
      }
    }

    function saveSeenNavCounts() {
      localStorage.setItem(navSeenStorageKey, JSON.stringify(seenNavCounts));
    }

    function markPageViewed(page) {
      var totals = navTotals();
      if (page === 'dashboard') {
        seenNavCounts.users = totals.users;
        seenNavCounts.goals = totals.goals;
        seenNavCounts.transactions = totals.transactions;
      }
      if (page === 'users') seenNavCounts.users = totals.users;
      if (page === 'goals') seenNavCounts.goals = totals.goals;
      if (page === 'transactions') seenNavCounts.transactions = totals.transactions;
      saveSeenNavCounts();
    }

    function markCurrentPageViewed() {
      markPageViewed(currentPage);
    }

    function setNavBadge(id, value, labelValue) {
      var badge = document.getElementById(id);
      badge.textContent = labelValue || String(value);
      badge.classList.toggle('hidden', value <= 0);
    }

    function updateNavCounts() {
      var totals = navTotals();
      var userUnread = Math.max(0, totals.users - seenNavCounts.users);
      var goalUnread = Math.max(0, totals.goals - seenNavCounts.goals);
      var transactionUnread = Math.max(0, totals.transactions - seenNavCounts.transactions);
      var dashboardUnread = userUnread + goalUnread + transactionUnread;

      setNavBadge('navDashboard', dashboardUnread, '01');
      setNavBadge('navUsers', userUnread);
      setNavBadge('navGoals', goalUnread);
      setNavBadge('navTransactions', transactionUnread);
    }

    function showMessage(id, message, isError) {
      var box = document.getElementById(id);
      box.textContent = message;
      box.classList.toggle('error-message', Boolean(isError));
      box.style.display = 'block';
    }

    function resetUserForm() {
      var form = document.getElementById('userForm');
      form.reset();
      form.elements.id.value = '';
      form.elements.password.placeholder = 'Wajib saat tambah user';
      document.getElementById('userSubmitButton').textContent = 'Tambah User';
    }

    function fillUserForm(user) {
      var form = document.getElementById('userForm');
      form.elements.id.value = user.id;
      form.elements.fullName.value = user.fullName || '';
      form.elements.email.value = user.email || '';
      form.elements.password.value = '';
      form.elements.password.placeholder = 'Kosongkan jika tidak reset password';
      document.getElementById('userSubmitButton').textContent = 'Simpan User';
      showMessage('userMessage', 'Mode edit: ubah nama/email lalu klik Simpan User. Gunakan tombol Reset Password untuk ganti password.', false);
    }

    function promptValue(label, currentValue) {
      var value = window.prompt(label, currentValue ?? '');
      if (value == null) return null;
      return String(value).trim();
    }

    async function editGoalInline(goal) {
      var title = promptValue('Nama goal:', goal.title || '');
      if (title == null) return;
      var category = promptValue('Kategori goal:', goal.category || 'Other');
      if (category == null) return;
      var savedAmount = promptValue('Saved amount:', Number(goal.savedAmount || 0));
      if (savedAmount == null) return;
      var targetAmount = promptValue('Target amount:', Number(goal.targetAmount || 0));
      if (targetAmount == null) return;
      var targetDate = promptValue('Target date (YYYY-MM-DD, boleh kosong):', goal.targetDate || '');
      if (targetDate == null) return;
      var status = promptValue('Status (active/completed/archived):', goal.status || 'active');
      if (status == null) return;

      await fetchJson('/api/admin/goals/' + encodeURIComponent(goal.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          category: category || 'Other',
          savedAmount: savedAmount,
          targetAmount: targetAmount,
          targetDate: targetDate || null,
          status: status || 'active'
        })
      });
    }

    async function editTransactionInline(trx) {
      var title = promptValue('Judul transaksi:', trx.title || '');
      if (title == null) return;
      var type = promptValue('Tipe transaksi (income/outcome):', trx.type || 'income');
      if (type == null) return;
      var amount = promptValue('Amount:', Number(trx.amount || 0));
      if (amount == null) return;
      var category = promptValue('Kategori transaksi:', trx.category || 'Other');
      if (category == null) return;
      var date = promptValue('Tanggal transaksi (YYYY-MM-DD):', dateInputValue(trx.date));
      if (date == null) return;

      await fetchJson('/api/admin/transactions/' + encodeURIComponent(trx.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          type: type || 'income',
          amount: amount,
          category: category || 'Other',
          date: date
        })
      });
    }

    function formatDate(value) {
      if (!value) return '-';
      var date = new Date(value);
      if (Number.isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function initials(value) {
      var parts = String(value || 'User').trim().split(/\\s+/).slice(0, 2);
      return parts.map(function(part) { return part.charAt(0).toUpperCase(); }).join('') || 'U';
    }

    function shortText(value, length) {
      var text = String(value || '-');
      return text.length > length ? text.slice(0, length) + '…' : text;
    }

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, function(char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[char];
      });
    }

    document.getElementById('searchInput').addEventListener('input', renderAll);
    document.getElementById('notificationButton').addEventListener('click', function(event) {
      event.stopPropagation();
      document.getElementById('notificationPanel').classList.toggle('show');
    });
    document.getElementById('notificationPanel').addEventListener('click', function(event) {
      event.stopPropagation();
      var removeButton = event.target.closest('[data-notification-remove]');
      if (removeButton) {
        dismissNotification(removeButton.getAttribute('data-notification-remove'));
      }
    });
    document.getElementById('clearNotificationsButton').addEventListener('click', function(event) {
      event.stopPropagation();
      clearVisibleNotifications();
    });
    document.addEventListener('click', function() {
      document.getElementById('notificationPanel').classList.remove('show');
    });
    document.querySelectorAll('.nav-item[data-nav]').forEach(function(nav) {
      nav.addEventListener('click', function() {
        var page = nav.getAttribute('data-nav');
        markPageViewed(page);
        updateNavCounts();
      });
    });
    document.getElementById('logoutButton').addEventListener('click', async function() {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    });

    document.getElementById('userCancelButton').addEventListener('click', function() {
      resetUserForm();
      showMessage('userMessage', 'Mode edit dibatalkan.', false);
    });

    document.getElementById('userForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      var id = form.get('id');
      var payload = {
        fullName: form.get('fullName'),
        email: form.get('email')
      };

      if (!id) {
        payload.password = form.get('password');
        if (!payload.password) {
          showMessage('userMessage', 'Password wajib diisi saat tambah user baru.', true);
          return;
        }
      }

      try {
        await fetchJson(id ? '/api/admin/users/' + encodeURIComponent(id) : '/api/admin/users', {
          method: id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        resetUserForm();
        showMessage('userMessage', id ? 'User berhasil diperbarui.' : 'User baru berhasil ditambahkan.', false);
        await loadAdmin();
      } catch (error) {
        showMessage('userMessage', error.message, true);
      }
    });

    document.getElementById('usersTable').addEventListener('click', async function(event) {
      var button = event.target.closest('[data-user-action]');
      if (!button) return;
      var id = button.getAttribute('data-id');
      var user = state.users.find(function(item) { return item.id === id; });
      if (!user) {
        showMessage('userMessage', 'User tidak ditemukan di data dashboard.', true);
        return;
      }

      if (button.getAttribute('data-user-action') === 'edit') {
        fillUserForm(user);
        document.getElementById('userForm').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (button.getAttribute('data-user-action') === 'password') {
        var newPassword = window.prompt('Masukkan password baru untuk ' + user.fullName + ' (minimal 6 karakter):');
        if (newPassword == null) return;
        if (newPassword.length < 6) {
          showMessage('userMessage', 'Password baru minimal 6 karakter.', true);
          return;
        }
        try {
          await fetchJson('/api/admin/users/' + encodeURIComponent(id) + '/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword })
          });
          showMessage('userMessage', 'Password user berhasil direset.', false);
        } catch (error) {
          showMessage('userMessage', error.message, true);
        }
        return;
      }

      if (button.getAttribute('data-user-action') === 'delete') {
        if (!window.confirm('Hapus user ' + user.fullName + '? Goals dan transaksi user juga akan ikut terhapus.')) return;
        try {
          await fetchJson('/api/admin/users/' + encodeURIComponent(id), { method: 'DELETE' });
          resetUserForm();
          showMessage('userMessage', 'User berhasil dihapus.', false);
          await loadAdmin();
        } catch (error) {
          showMessage('userMessage', error.message, true);
        }
      }
    });

    document.getElementById('goalsTable').addEventListener('click', async function(event) {
      var button = event.target.closest('[data-goal-action]');
      if (!button) return;
      var id = button.getAttribute('data-id');
      var goal = state.goals.find(function(item) { return item.id === id; });
      if (!goal) {
        showMessage('goalMessage', 'Goal tidak ditemukan di data dashboard.', true);
        return;
      }

      if (button.getAttribute('data-goal-action') === 'edit') {
        try {
          await editGoalInline(goal);
          showMessage('goalMessage', 'Goal berhasil diperbarui.', false);
          await loadAdmin();
        } catch (error) {
          showMessage('goalMessage', error.message, true);
        }
        return;
      }

      if (button.getAttribute('data-goal-action') === 'delete') {
        if (!window.confirm('Hapus goal "' + goal.title + '"? Transaksi terkait akan tetap ada tetapi goal-nya menjadi kosong.')) return;
        try {
          await fetchJson('/api/admin/goals/' + encodeURIComponent(id), { method: 'DELETE' });
          showMessage('goalMessage', 'Goal berhasil dihapus.', false);
          await loadAdmin();
        } catch (error) {
          showMessage('goalMessage', error.message, true);
        }
      }
    });

    document.getElementById('transactionsTable').addEventListener('click', async function(event) {
      var button = event.target.closest('[data-transaction-action]');
      if (!button) return;
      var id = button.getAttribute('data-id');
      var trx = state.transactions.find(function(item) { return item.id === id; });
      if (!trx) {
        showMessage('transactionMessage', 'Transaksi tidak ditemukan di data dashboard.', true);
        return;
      }

      if (button.getAttribute('data-transaction-action') === 'edit') {
        try {
          await editTransactionInline(trx);
          showMessage('transactionMessage', 'Transaksi berhasil diperbarui.', false);
          await loadAdmin();
        } catch (error) {
          showMessage('transactionMessage', error.message, true);
        }
        return;
      }

      if (button.getAttribute('data-transaction-action') === 'delete') {
        if (!window.confirm('Hapus transaksi "' + trx.title + '"?')) return;
        try {
          await fetchJson('/api/admin/transactions/' + encodeURIComponent(id), { method: 'DELETE' });
          showMessage('transactionMessage', 'Transaksi berhasil dihapus.', false);
          await loadAdmin();
        } catch (error) {
          showMessage('transactionMessage', error.message, true);
        }
      }
    });

    document.getElementById('reportFilterForm').addEventListener('input', renderAll);
    document.getElementById('reportResetButton').addEventListener('click', function() {
      document.getElementById('reportStartDate').value = '';
      document.getElementById('reportEndDate').value = '';
      renderAll();
    });

    document.getElementById('settingsForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      try {
        var data = await fetchJson('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: form.get('fullName'),
            email: form.get('email')
          })
        });
        state.admin = data.admin;
        renderSettings();
        showMessage('settingsMessage', 'Profil admin berhasil diperbarui.', false);
      } catch (error) {
        showMessage('settingsMessage', error.message, true);
      }
    });

    document.getElementById('passwordForm').addEventListener('submit', async function(event) {
      event.preventDefault();
      var form = new FormData(event.currentTarget);
      try {
        await fetchJson('/api/admin/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: form.get('currentPassword'),
            newPassword: form.get('newPassword')
          })
        });
        event.currentTarget.reset();
        showMessage('passwordMessage', 'Password admin berhasil diperbarui.', false);
      } catch (error) {
        showMessage('passwordMessage', error.message, true);
      }
    });

    loadAdmin();
  </script>
</body>
</html>`;
}

module.exports = { adminPage };
