# PLV-VRS Frontend (React + Vite)

Violation Reporting System for Pamantasan ng Lungsod ng Valenzuela. This is the **frontend only**.
All data is MOCK and lives in memory (it resets when you refresh). No backend or database is connected.

## Run on localhost

```bash
npm install
npm run dev
```

Open http://localhost:5173/

Requires Node 20.19+ or 22.12+.

## Portals

| Portal | URL |
|---|---|
| Student | /login |
| Staff (OSA / OPD) | /staff/login |
| Super Admin | /admin/login |
| Account verification | /verify |
| Help / Guidelines | /help |

## Demo accounts (mock only, password for all: demo1234)

| Role | Login |
|---|---|
| Student (verified) | 24-0001 |
| Student (not verified) | 24-0002 |
| OSA | osa.staff |
| OPD | opd.staff |
| Super Admin | super.admin |
| OSA (deactivated) | old.osa |

Sample tracking IDs: VRS-2026-00120 (Resolved), 00121 (Submitted), 00122 (Under Verification), 00123 (Under Review).

## Where things are

- `src/pages/student`, `src/pages/staff`, `src/pages/admin`: screens per portal
- `src/context`: mock data stores (replace with Laravel API calls later)
- `src/data/mockData.js`: demo data and placeholder offense catalog
- `src/services/api.js`: placeholder for the future API base URL
