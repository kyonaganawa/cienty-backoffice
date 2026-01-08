# Covalenty Server Repository Overview

## API Architecture

The API uses **two routing systems**:

### 1. tRPC (Type-Safe RPC) - `/server-stack/src/api/trpc/router/`
- **Endpoint prefix**: `/trpc`
- **Framework**: tRPC v11.6.0 with Zod validation
- **Routers**: auth, user, cart, client, product, distributor, seller, collection, etc.
- **Type-safe** end-to-end with TypeScript

### 2. REST Controllers - `/server-stack/src/api/controller/`
- **Endpoint prefix**: `/app`
- **Framework**: `routing-controllers` with TypeScript decorators (`@JsonController`, `@Post`, etc.)
- **Controllers**: auth, cart, client, distributor, product, seller, advertisement, etc.

### Layer Architecture
```
Controllers/tRPC → Use Cases (business logic) → DataSources (repositories) → Prisma ORM → MySQL/MongoDB
```

**Tech Stack**: Koa (web server), TypeDI (dependency injection), Prisma (ORM), MySQL 8.0 + MongoDB

---

## Database Schema Changes (New Tables)

### Using Prisma Migrations

**1. Edit the schema**
```bash
# Edit server-stack/src/prisma/schema.prisma
# Add your new model:
model MyNewTable {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
}
```

**2. Create migration**
```bash
cd server-stack
npm run prisma:migrate "add_my_new_table"
```

This generates a new migration file in `/server-stack/src/prisma/migrations/` with SQL DDL.

**3. Apply to databases**
```bash
# For local test database (port 3307)
npm run prisma:test-deploy

# For dev database (after pushing migration file to repo)
npm run prisma:push

# For production
npm run prisma:deploy
```

**4. Regenerate Prisma Client**
```bash
npm run postinstall  # Generates TypeScript types
```

**Migration Files Location**: `/server-stack/src/prisma/migrations/` (261 existing migrations)

---

## Running Locally

### Quick Setup (Automated)

```bash
# 1. Copy environment file
cp .test.env .env

# 2. Run setup script (installs everything)
node setup.js

# 3. Start dev server
cd server-stack && npm run dev
```

The `setup.js` script handles:
- Node.js 20.19.0 installation (via nvm)
- Docker container startup (MySQL, MongoDB)
- Dependencies installation
- Prisma client generation
- Database migrations

### Manual Setup

```bash
# 1. Start databases
cd server-stack
docker-compose up -d                                    # Linux/Windows
# OR for Apple Silicon:
docker-compose -f docker-compose.macos.yml up -d        # macOS M1/M2

# 2. Install dependencies
cd server-stack && npm install

# 3. Apply migrations
npm run prisma:test-deploy      # Deploy to local test DB
npm run postinstall             # Generate Prisma client

# 4. Start server
npm run dev                     # Runs on port 3001
```

---

## Database Configuration

### Local Development (Docker)

**MySQL Test Database**:
```env
DATABASE_URL="mysql://root:password@localhost:3307/covalenty_test"
```

**MongoDB**:
```env
MONGO_URL="mongodb://localhost:27017/covalenty_test?directConnection=true"
```

**Docker Services** (from `docker-compose.yml`):
- MySQL Test: `localhost:3307` (for development)
- MySQL Prod: `localhost:3306` (if needed)
- MongoDB: `localhost:27017`

### Connecting to Dev/Prod Databases

**1. Get credentials from Zoho Vault** (referenced in documentation)

**2. Update `.env` file**:
```bash
# For dev database
DATABASE_URL="mysql://user:pass@dev-host:3306/covalenty_dev"

# For prod database (use carefully!)
DATABASE_URL="mysql://user:pass@prod-host:3306/covalenty_prod"
```

**3. Run migrations**:
```bash
# Dev
npm run prisma:push

# Prod (review SQL first!)
npm run prisma:deploy
```

---

## Useful Commands

```bash
# Development
npm run dev                     # Start with hot reload (port 3001)
npm run build                   # Compile TypeScript
npm run test                    # Run tests with coverage

# Prisma/Database
npm run prisma:migrate "name"   # Create new migration
npm run prisma:test-deploy      # Apply to test DB (local)
npm run prisma:push             # Push schema to dev DB
npm run prisma:deploy           # Deploy to production
npm run prisma:fix              # Resolve migration conflicts

# Code Quality
npm run lint                    # Check code style
npm run lint:fix                # Auto-fix issues
```

---

## Key Files

- **API Entry**: `server-stack/src/server.ts`, `server-stack/src/app.ts`
- **Database Schema**: `server-stack/src/prisma/schema.prisma`
- **Migrations**: `server-stack/src/prisma/migrations/`
- **tRPC Routers**: `server-stack/src/api/trpc/router/`
- **REST Controllers**: `server-stack/src/api/controller/`
- **Use Cases**: `server-stack/src/domain/`
- **DataSources**: `server-stack/src/data/datasource/`
- **Environment**: `.test.env` (local), `.env.*` (dev/staging/prod)

---

## Repository Structure

```
/server-stack/
├── src/
│   ├── api/
│   │   ├── controller/          # REST controllers (31 files)
│   │   ├── trpc/               # tRPC routers & setup
│   │   │   ├── router/         # Sub-routers (auth, cart, client, etc.)
│   │   │   └── middleware/
│   │   └── middleware/
│   ├── domain/                 # Business logic (38 domain modules)
│   ├── data/
│   │   ├── datasource/         # Repositories (58 datasources)
│   │   ├── mapper/             # Model mappers
│   │   └── model/              # Data models
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # 261 migration files
│   ├── workers/                # Background jobs
│   ├── utils/                  # Utilities (config, helpers)
│   └── exceptions/             # Custom exceptions
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml
├── docker-compose.macos.yml    # Apple Silicon optimized
├── tsconfig.json               # TypeScript config with path aliases
└── package.json                # Dependencies and scripts

/core/                          # Shared utilities & types
/sync-stack/                    # Synchronization engine
/order-stack/                   # Order processing
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 20.19.0 |
| **Web Framework** | Koa | 3.0.3 |
| **API Layer** | tRPC | 11.6.0 |
| **Routing** | routing-controllers | 0.11.3 |
| **ORM** | Prisma | 6.17.0 |
| **Primary DB** | MySQL | 8.0 |
| **NoSQL DB** | MongoDB | 6.20.0 |
| **DI Container** | TypeDI | 0.10.0 |
| **Validation** | Zod, class-validator | 3.24.2, 0.14.2 |
| **Language** | TypeScript | 5.9.2 |
| **Testing** | Mocha, Chai, Sinon | 10.8.2, 4.3.10, 18.0.0 |
| **IaC** | AWS CDK | 2.219.0 |
| **Authentication** | JWT | jsonwebtoken 9.0.2 |

---

## Notes

- The repository has **261 existing migrations**, so the schema management process is well-established
- Always review generated SQL before deploying to production
- Three interconnected stacks: Server Stack (primary API), Order Stack (order processing), Sync Stack (data synchronization)
- Uses both AWS Lambda and Google Cloud Platform for various services
