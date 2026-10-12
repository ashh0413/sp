# SplitSpot - Group Expense Sharing Application

## Overview

SplitSpot is a modern expense sharing application that helps groups track and settle shared expenses. Users can create groups, add expenses, track balances, and simplify debt settlements.

## Tech Stack

- **Framework**: Next.js 16.3.8 with App Router
- **UI**: React 19.2.8, TailwindCSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta)
- **Password Hashing**: bcryptjs

## Features

### Authentication
- [x] User registration with email/password
- [x] User login with credentials
- [x] Session management via NextAuth
- [x] Protected routes

### Groups
- [x] Create expense groups
- [x] View all user's groups
- [x] Join groups via invite code
- [x] Generate unique invite codes
- [x] Set group budget (optional)

### Expenses
- [x] Add expenses with description and amount
- [x] Categorize expenses
- [x] Equal split among group members
- [x] Custom split amounts
- [x] View expense history

### Balances & Settlements
- [x] Calculate net balances per user
- [x] Debt simplification algorithm
- [x] Suggested settlement amounts
- [x] Mark settlements as paid/confirmed
- [x] UPI ID support for payments

## Database Schema

### Models

```prisma
User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String
  phone         String?       @unique
  passwordHash  String
  upiId         String?
  avatarUrl     String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  memberships   GroupMember[]
  expenses      Expense[]
}

Group {
  id          String        @id @default(cuid())
  name        String
  description String?
  budget      Decimal?
  currency    String        @default("INR")
  inviteCode  String        @unique
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  members     GroupMember[]
  expenses    Expense[]
  settlements Settlement[]
}

GroupMember {
  id        String   @id @default(cuid())
  userId    String
  groupId   String
  role      String   @default("member")
  joinedAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  group     Group    @relation(fields: [groupId], references: [id])
  @@unique([userId, groupId])
}

Expense {
  id          String      @id @default(cuid())
  description String
  amount      Decimal
  category    String?
  splitType   String      @default("equal")
  groupId     String
  paidById    String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  group       Group       @relation(fields: [groupId], references: [id])
  paidBy      User        @relation(fields: [paidById], references: [id])
  splits      ExpenseSplit[]
}

ExpenseSplit {
  id         String   @id @default(cuid())
  expenseId  String
  userId     String
  amount     Decimal
  expense    Expense  @relation(fields: [expenseId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
}

Settlement {
  id          String    @id @default(cuid())
  groupId     String
  fromUserId  String
  toUserId    String
  amount      Decimal
  status      String    @default("pending")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  group       Group     @relation(fields: [groupId], references: [id])
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers (login/logout/session)

### Groups
- `GET /api/groups` - List user's groups
- `POST /api/groups` - Create new group
- `POST /api/groups/join` - Join group via invite code

### Expenses
- `GET /api/groups/[id]/expenses` - List group expenses
- `POST /api/groups/[id]/expenses` - Add expense to group

### Balances
- `GET /api/groups/[id]/balances` - Get balances and settlements

### Settlements
- `GET /api/settlements` - List pending settlements
- `POST /api/settlements` - Create settlement request
- `PATCH /api/settlements` - Update settlement status

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/login` | Login page |
| `/auth/register` | Registration page |
| `/app/dashboard` | Main dashboard |
| `/app/groups` | Groups list |
| `/app/groups/[id]` | Group detail |
| `/app/groups/[id]/balances` | Balances & settlements |
| `/app/profile` | User profile |
| `/join/[code]` | Join group via invite link |
| `/join/invite` | Invite code entry page |

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/splitspot"
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Getting Started

1. Clone repository
2. Copy `.env.example` to `.env` and configure
3. Run `npm install`
4. Run `npx prisma db push` to create database
5. Run `npm run dev` to start development server

## TODO

- [ ] Email verification
- [ ] Password reset
- [ ] Push notifications
- [ ] Expense notifications
- [ ] Export expenses to CSV
- [ ] Group analytics
- [ ] Mobile responsive improvements
- [ ] Dark mode support
