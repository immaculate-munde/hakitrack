# HakiTrack

USSD case and bail status tracker for Kenya. Families dial in to check court dates, bail amounts, and holding locations. Court clerks update records through a web dashboard.

## Stack

- **Frontend / API:** Next.js 16, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Public channel:** Africa's Talking USSD
- **Notifications:** Africa's Talking SMS

## Features

- **USSD main menu:** case status, know your rights, legal aid directory
- **Swahili-first** with English via `*9` at any step
- USSD case lookup by case number (`*384*XYZ#`)
- SMS reminder opt-in from USSD (day before hearing)
- SMS fallback for legal aid directory (other counties)
- PIN-protected clerk dashboard
- Dark + light mode UI
- Mock CTS database for hackathon demos

## Project structure

```text
hakitrack/
├── frontend/                 # Next.js app
│   └── scripts/seed-cases.ts  # Demo data seeder
└── .env.example
```

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order via the SQL editor:
   - `supabase/migrations/001_cases_schema.sql`
   - `supabase/migrations/002_legal_aid_schema.sql`
3. Copy project URL and keys

### 2. Environment

```bash
cp .env.example frontend/.env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLERK_PIN` (default demo: `1234`)
- `AUTH_SECRET` (any random 32+ char string)
- `CRON_SECRET`
- `AT_API_KEY`, `AT_USERNAME`, `AT_SENDER_ID` (optional for local SMS/USSD testing)

### 3. Install and run

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Seed demo data

```bash
cd frontend
npm run seed
npm run seed:legal-aid
```

Verify legal aid helpline numbers against each organization's official site before production.

## USSD menu (v2)

```
Karibu HakiTrack
1. Angalia kesi (Case status)
2. Haki zako (Know your rights)
3. Msaada wa kisheria (Find legal aid)
0. Toka (Exit)
(Kiingereza: *9)
```

- **Branch 1:** existing case lookup + SMS subscribe
- **Branch 2:** static constitutional rights (Article 49)
- **Branch 3:** county → case type → providers (SMS fallback for "Other")

### USSD test examples

```bash
# Main menu
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"1","serviceCode":"*384*1#","phoneNumber":"+254711111111","text":""}'

# Case lookup (branch 1)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"1","serviceCode":"*384*1#","phoneNumber":"+254711111111","text":"1*CR2026089"}'

# Rights menu (branch 2)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"1","serviceCode":"*384*1#","phoneNumber":"+254711111111","text":"2*1"}'

# Legal aid — Nairobi + family (branch 3)
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"1","serviceCode":"*384*1#","phoneNumber":"+254711111111","text":"3*1*1"}'
```

## Africa's Talking

1. Create a sandbox account at [africastalking.com](https://africastalking.com)
2. **USSD:** create a service code and set callback URL to `https://<your-domain>/api/ussd`
3. **SMS:** register sender ID `HAKITRACK`
4. Test locally with ngrok or deploy to Vercel first

### USSD test (JSON)

```bash
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","serviceCode":"*384*1#","phoneNumber":"+254711111111","text":""}'
```

### SMS reminders (manual cron)

```bash
curl -X POST http://localhost:3000/api/cron/reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Demo script

1. Dial USSD and query `CR2026089`
2. Log in to `/admin/login` with clerk PIN
3. Open `CR-2026-089` and change status to **Bail Set**
4. Re-dial USSD — status updates instantly
5. Opt in to SMS reminders from USSD (`1`)
6. Trigger `/api/cron/reminders` to send day-before SMS
7. Demo branch 2 (rights) and branch 3 (legal aid)

## Pitch statistic

Before presenting, verify and cite one current Kenya-specific statistic on pretrial detention or bail access gaps (e.g. from NCAJ or Judiciary reports). Do not use uncited figures in the pitch.

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/ussd` | Africa's Talking USSD callback |
| `GET/POST /api/cases` | List / create cases (clerk auth) |
| `GET/PATCH/DELETE /api/cases/[id]` | Case CRUD |
| `POST /api/auth/login` | Clerk PIN login |
| `POST /api/cron/reminders` | Send hearing reminders |

## Future production path

- Official Judiciary CTS API via MOU
- Cause list scraper as interim data source
- Clerk dashboard remains the bridge until API access is granted

## License

MIT
