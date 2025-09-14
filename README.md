This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Clerk account for authentication
- Cloudinary account for image uploads

### Step 1 Features Implemented

✅ **Landing Page (`/`)**
- Hero section with app title and CTA buttons
- Features showcase (Expense tracking, Dashboard)
- Pricing teaser (Free/Pro/Premium/Ultra)
- Contact footer

✅ **Authentication (Clerk)**
- `/login` and `/register` pages with Clerk UI
- Protected dashboard routes
- Automatic redirect to login for unauthenticated users

✅ **Expense Management**
- Mongoose Expense model with categories
- API routes: `POST /api/expenses`, `GET /api/expenses`
- Dashboard with monthly summary and 7-day chart
- Add expense modal with form validation
- Expenses table with recent transactions

✅ **UI Components**
- Responsive design with Shadcn/UI
- React Hook Form + Zod validation
- Recharts integration for expense visualization

### Setup

1. Install dependencies:

```bash
npm i
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your actual Clerk and MongoDB values:
   - Get Clerk keys from https://clerk.com/
   - Set up MongoDB connection string
   - Configure Cloudinary for image uploads

4. Seed the database:

```bash
npm run seed
```

5. Start development server:

```bash
npm run dev
```

6. Build for production:

```bash
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run seed` - Seed database with initial data
- `npm run type-check` - Run TypeScript type checking

## Vercel Preview Deployments

This project is configured for automatic preview deployments on Vercel:

1. **Automatic Previews**: Every pull request automatically gets a preview deployment
2. **Preview URLs**: Each preview gets a unique URL like `https://your-app-git-branch-name-username.vercel.app`
3. **Environment Variables**: Preview deployments use the same environment variables as production
4. **GitHub Integration**: Comments are automatically added to PRs with preview links

### Setting up Vercel Previews:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments for pull requests
4. Preview deployments will be created automatically for each PR

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
