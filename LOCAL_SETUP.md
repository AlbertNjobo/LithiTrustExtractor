# LithiTrust - Local Setup Guide

## Overview
This guide contains everything you need to run LithiTrust locally on your computer.

---

## 1. System Prerequisites

Before starting, ensure you have:

- **Node.js**: v20.16.11 or later
- **npm**: v10+ (comes with Node.js)
- **PostgreSQL**: v12 or later
- **Git**: For version control (optional)

### Installation
- **Node.js & npm**: Download from [nodejs.org](https://nodejs.org/)
- **PostgreSQL**: Download from [postgresql.org](https://www.postgresql.org/)
  - On macOS: `brew install postgresql` (with Homebrew)
  - On Windows: Use the installer
  - On Linux: `sudo apt-get install postgresql`

---

## 2. Environment Variables

Create a `.env` file in the project root directory with these variables:

### Database Configuration
```env
DATABASE_URL=postgresql://username:password@localhost:5432/lithitrust
PGHOST=localhost
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=lithitrust
```

### Authentication
```env
SESSION_SECRET=your-random-secret-key-here-min-32-chars
```

### AI Chatbot (Google Gemini)
```env
GOOGLE_AI_API_KEY=your-gemini-api-key-here
```

### WhatsApp Integration (Twilio)
```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### Optional
```env
OPENAI_API_KEY=your-openai-api-key-here
```

---

## 3. Getting API Keys & Credentials

### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste into `GOOGLE_AI_API_KEY` in `.env`

### Twilio Credentials
1. Sign up at [Twilio.com](https://www.twilio.com)
2. Create a WhatsApp Business Account (or use Sandbox for testing)
3. From Twilio Console, get:
   - Account SID
   - Auth Token
   - WhatsApp Phone Number
4. Add these to `.env`

### Session Secret
Generate a random string (32+ characters) for `SESSION_SECRET`:
```bash
# On macOS/Linux:
openssl rand -base64 32

# Or any random string will work
```

---

## 4. Project Structure

```
lithitrust/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/          # Page components (Register, Dashboard, etc.)
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utilities, hooks, query client
│   │   ├── App.tsx         # Main app router
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   └── src/styles/         # CSS and Tailwind
│
├── server/                  # Express Backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data access layer
│   ├── blockchain.ts       # Polygon blockchain integration
│   ├── chatbot.ts          # Gemini AI chatbot logic
│   ├── whatsapp.ts         # Twilio WhatsApp handler
│   ├── replitAuth.ts       # OpenID authentication
│   ├── app.ts              # Express app setup
│   ├── index-dev.ts        # Development server entry
│   └── index-prod.ts       # Production server entry
│
├── shared/                  # Shared Code
│   └── schema.ts           # Database schema + Zod validation
│
├── migrations/             # Database migrations (auto-generated)
│
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Frontend build config
├── drizzle.config.ts       # Database config
├── .env                    # Environment variables (create this)
└── .gitignore              # Git ignore rules
```

---

## 5. Installation Steps

### Step 1: Clone or Copy Project
```bash
# If using git
git clone <your-repo-url>
cd lithitrust

# Or manually copy the project folder
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# In PostgreSQL:
CREATE DATABASE lithitrust;
\q
```

Or if PostgreSQL is running locally:
```bash
createdb lithitrust
```

### Step 4: Initialize Database Schema
```bash
npm run db:push
```

This creates all tables from `shared/schema.ts`:
- Users
- Batches
- ESG Records
- ESG Documents
- Supply Chain Events

### Step 5: Create `.env` File
Create a file called `.env` in the project root with all variables from Section 2 above.

### Step 6: Start Development Server
```bash
npm run dev
```

The application will start on: **http://localhost:5000**

---

## 6. Available npm Commands

```bash
# Development (with hot reload)
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Run production build
npm start

# Push database schema changes
npm run db:push
```

---

## 7. Project Dependencies

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.6.3 - Type safety
- **Vite** 5.4.20 - Build tool
- **Tailwind CSS** 3.4.17 - Styling
- **Shadcn UI** - Component library
- **Wouter** 3.3.5 - Routing
- **React Query** 5.60.5 - Data fetching
- **React Hook Form** 7.55.0 - Form handling
- **Zod** 3.24.2 - Validation
- **react-qr-code** 2.0.18 - QR code generation
- **lucide-react** 0.453.0 - Icons

### Backend
- **Express** 4.21.2 - Server framework
- **Drizzle ORM** 0.39.1 - Database ORM
- **Drizzle Kit** 0.31.4 - Database migrations
- **PostgreSQL Driver** (@neondatabase/serverless)
- **Passport** 0.7.0 - Authentication
- **express-session** 1.18.1 - Sessions
- **openid-client** 6.8.1 - OpenID Connect

### AI & Blockchain
- **@google/generative-ai** 0.24.1 - Gemini API
- **ethers** 6.15.0 - Ethereum/Blockchain

### Build Tools
- **esbuild** 0.25.0 - JavaScript bundler
- **tsx** 4.20.5 - TypeScript execution

All dependencies are listed in `package.json`.

---

## 8. Database Schema

LithiTrust uses PostgreSQL with Drizzle ORM. Key tables:

### Users
- id, email, firstName, lastName, profileImageUrl, role, organization

### Batches
- id, batchNumber, mineName, mineLocation, minerName, weight, grade, lithiumContent
- currentStage (mining, processing, export, delivered)
- status (active, completed, disputed)
- blockchainHash, qrCode, createdBy

### ESG Records
- batchId, environmentalScore, socialScore, governanceScore
- childLabourCheck, communityAgreement
- waterUsage, carbonIntensity, safetyPractices, rehabilitationPlan

### ESG Documents
- batchId, documentType, fileName, filePath, fileSize, uploadedBy, verified, verifiedBy

### Supply Chain Events
- batchId, stage, stakeholder, location, timestamp, notes, verifiedBy

---

## 9. API Endpoints Summary

### Authentication
- `GET /api/auth/user` - Get current user (requires login)
- `GET /api/login` - Start OAuth login
- `GET /api/logout` - Logout
- `GET /api/callback` - OAuth callback

### Batches
- `GET /api/batches` - List all batches
- `GET /api/batches/:id` - Get batch details
- `POST /api/batches` - Create new batch
- `PATCH /api/batches/:id` - Update batch

### Supply Chain Events
- `GET /api/batches/:id/events` - Get batch history
- `POST /api/batches/:id/events` - Add event

### ESG
- `GET /api/batches/:id/esg` - Get ESG data
- `POST /api/batches/esg` - Create ESG record
- `PATCH /api/batches/:id/esg` - Update ESG data

### Documents
- `GET /api/batches/:id/documents` - Get batch documents
- `POST /api/batches/:id/documents` - Upload document
- `DELETE /api/documents/:id` - Delete document

### Pricing
- `GET /api/pricing/calculator?batchId={id}` - Calculate green premium

### Chatbot
- `POST /api/chat` - Web chatbot endpoint

### WhatsApp (Twilio)
- `POST /api/whatsapp/webhook` - Receive WhatsApp messages
- `GET /api/whatsapp/webhook` - Verify webhook

---

## 10. Troubleshooting

### Port 5000 Already in Use
```bash
# Kill the process using port 5000
# On macOS/Linux:
lsof -i :5000 | awk 'NR>1 {print $2}' | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# On macOS:
brew services list

# On Linux:
sudo service postgresql status

# On Windows:
services.msc (search for PostgreSQL)
```

### npm install fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database migrations fail
```bash
# Reset database (WARNING: deletes all data)
dropdb lithitrust
createdb lithitrust
npm run db:push
```

---

## 11. Development Workflow

### Hot Reload
When you save changes:
- Frontend files automatically reload in browser
- Backend requires restart (will happen automatically)
- No manual refresh needed

### TypeScript Checking
```bash
npm run check
```
Validates all TypeScript code before running.

### Database Changes
After modifying `shared/schema.ts`:
```bash
npm run db:push
```
This generates and applies migrations automatically.

---

## 12. Building for Production

### Create Production Build
```bash
npm run build
```

This:
- Builds frontend with Vite (minified, optimized)
- Bundles backend with esbuild
- Creates `dist/` directory

### Run Production Build
```bash
npm start
```

Application runs on port 5000 (same as development).

---

## 13. External Services Required

| Service | Purpose | Cost | Setup |
|---------|---------|------|-------|
| PostgreSQL | Database | Free (self-hosted) or paid (managed) | Install locally or use cloud provider |
| Google Gemini | AI Chatbot | Free tier available | Get API key from Google AI Studio |
| Twilio | WhatsApp Integration | Free trial, then ~$0.01-0.05/message | Sign up and get credentials |
| Polygon Mumbai | Blockchain | Free (testnet) | Use RPC endpoint in app |

---

## 14. Quick Start Checklist

- [ ] Install Node.js v20+ and PostgreSQL
- [ ] Clone/copy project
- [ ] Run `npm install`
- [ ] Create PostgreSQL database: `createdb lithitrust`
- [ ] Create `.env` file with credentials
- [ ] Run `npm run db:push`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5000
- [ ] Login and start exploring!

---

## 15. File Reference

### Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript settings
- `vite.config.ts` - Frontend build config
- `drizzle.config.ts` - Database config
- `tailwind.config.ts` - Tailwind CSS config
- `.env` - Environment variables (create this)

### Source Files
- `client/src/main.tsx` - Frontend entry point
- `server/app.ts` - Backend setup
- `server/routes.ts` - API routes
- `shared/schema.ts` - Database schema

---

## Next Steps

1. **Complete Setup**: Follow steps 1-6 above
2. **Explore the App**: Register a batch, view dashboard
3. **Test WhatsApp**: Configure Twilio webhook to test LithiBot
4. **Add Your Data**: Create test batches and explore features
5. **Deploy**: When ready, deploy to Replit or your own server

---

## Support

For issues:
1. Check troubleshooting section (Section 10)
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify `.env` file has all required variables
5. Ensure PostgreSQL is running and database exists

Good luck! 🚀
