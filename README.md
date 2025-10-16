# 💰 Advanced Expense Management System

A modern, full-stack expense tracking application built with Next.js 15, TypeScript, and MongoDB. Features advanced data visualization, real-time updates, and a responsive design.

![Expense Management Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## ✨ **Key Highlights**

- 🎯 **Advanced Table Management** - Pagination, search, filtering, and bulk operations
- 📊 **Interactive Charts** - Real-time data visualization with light/dark mode
- 🔐 **Secure Authentication** - Clerk integration with protected routes
- 📱 **Mobile Responsive** - Optimized for all screen sizes
- 🎨 **Modern UI/UX** - Shadcn/UI components with toast notifications
- ⚡ **Real-time Updates** - Instant data refresh and state management
- 🏗️ **Clean Architecture** - Organized folder structure and TypeScript throughout

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Clerk account for authentication

### Installation

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd project-1
npm install
```

2. **Environment setup:**

```bash
cp .env.example .env.local
```

3. **Configure environment variables:**

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
```

4. **Start development server:**

```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** to see the application.

### First Time Setup

1. Register a new account or login
2. Navigate to the dashboard
3. Start adding your expenses
4. Explore the analytics and filtering features

## Local Development

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Clerk account for authentication
- Cloudinary account for image uploads

## 🚀 **Current Progress - Advanced Expense Management System**

### ✅ **Core Features Completed**

**🏠 Landing & Authentication**

- Modern landing page with hero section and features showcase
- Complete authentication system using Clerk
- Protected dashboard routes with automatic redirects
- User registration and login pages

**💰 Advanced Expense Management**

- Full CRUD operations (Create, Read, Update, Delete)
- Advanced expense table with pagination, search, and filtering
- Custom category support with default categories
- Bulk operations (select multiple expenses for deletion)
- Real-time data refresh and state management

**📊 Data Visualization & Analytics**

- Interactive charts with light/dark mode support
- Expense statistics cards with trend indicators
- Category breakdown pie charts
- Recent activity feed with time-based display
- Advanced reporting with multiple time periods

**🎨 UI/UX Excellence**

- Fully responsive design for all screen sizes
- Toast notifications for all user actions (Sonner)
- Confirmation dialogs for destructive operations
- Loading states and error handling throughout
- Theme-aware components (light/dark mode)

**🏗️ Technical Architecture**

- Organized folder structure (expenses/, layout/, shared/)
- TypeScript throughout with proper type safety
- Next.js 15 compatibility with async params
- MongoDB integration with Mongoose ODM
- RESTful API design with advanced filtering

### 📱 **User Interface Components**

**Dashboard Layout**

- Collapsible sidebar navigation
- Mobile-responsive header with user menu
- Tabbed interface for different views
- Clean card-based design system

**Expense Management**

- Feature-rich data table with sorting and selection
- Advanced filtering (period, category, date range, search)
- Add/Edit expense modals with form validation
- Custom category creation with emoji icons
- Bulk selection and operations

**Data Visualization**

- 7-day expense trend charts
- Category distribution pie charts
- Monthly/yearly reporting charts
- Statistics cards with percentage changes
- Recent activity timeline

### 🔧 **API Endpoints**

**Expense Operations**

- `POST /api/expenses` - Create new expense
- `GET /api/expenses` - List expenses with advanced filtering
- `PUT /api/expenses/[id]` - Update specific expense
- `DELETE /api/expenses/[id]` - Delete specific expense
- `DELETE /api/expenses/bulk` - Bulk delete operations

**Analytics & Reporting**

- `GET /api/expenses/stats` - Expense statistics and trends
- `GET /api/expenses/categories` - Category breakdown data
- `GET /api/expenses/categories/list` - Available categories
- `GET /api/expenses/report` - Advanced reporting data

### 🎯 **Key Features**

**Advanced Table Features**

- ✅ Pagination with customizable page sizes
- ✅ Real-time search across descriptions and categories
- ✅ Multi-column sorting capabilities
- ✅ Bulk selection with checkbox controls
- ✅ Row-level actions (Edit/Delete)
- ✅ Responsive design for mobile devices

**Smart Filtering System**

- ✅ Quick period filters (Today, Week, Month, All Time)
- ✅ Category-based filtering with dynamic options
- ✅ Custom date range selection
- ✅ Combined search and filter capabilities
- ✅ Filter state persistence

**User Experience**

- ✅ Toast notifications for all operations
- ✅ Confirmation dialogs for destructive actions
- ✅ Loading states during API operations
- ✅ Error handling with user-friendly messages
- ✅ Real-time data updates

**Mobile Optimization**

- ✅ Responsive navigation with collapsible sidebar
- ✅ Touch-friendly interface elements
- ✅ Optimized table layout for small screens
- ✅ Mobile-first design approach

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

### 🛠️ **Development Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Database
npm run seed         # Seed database with initial data
```

### 📁 **Project Structure**

```
src/
├── app/
│   ├── (dashboard)/dashboard/
│   │   ├── expenses/page.tsx     # Advanced expense management
│   │   └── page.tsx              # Dashboard overview
│   ├── (user)/                   # Public pages
│   └── api/expenses/             # RESTful API endpoints
├── components/
│   ├── dashboard/
│   │   ├── expenses/             # Expense-related components
│   │   ├── layout/               # Navigation and layout
│   │   └── shared/               # Reusable components
│   ├── ui/                       # Shadcn/UI primitives
│   └── users/                    # User-facing components
└── models/
    └── Expense.ts                # Database schema
```

### 🎨 **Technology Stack**

**Frontend**

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn/UI component library
- React Hook Form + Zod validation
- Recharts for data visualization
- Sonner for toast notifications

**Backend**

- Next.js API Routes
- MongoDB with Mongoose ODM
- Clerk for authentication
- RESTful API design

**Development Tools**

- ESLint + Prettier for code quality
- TypeScript strict mode
- Git for version control
- Turbopack for fast builds

## 🚀 **Deployment & Production**

### Vercel Deployment

This project is optimized for Vercel deployment with:

- Automatic preview deployments for pull requests
- Environment variable management
- Edge runtime optimization
- Static generation for public pages

### Production Checklist

- ✅ TypeScript compilation without errors
- ✅ ESLint validation passed
- ✅ Responsive design tested
- ✅ API endpoints functional
- ✅ Database integration working
- ✅ Authentication flow complete

## 🔮 **Upcoming Features**

### Phase 2 - Budget Management

- Budget creation and tracking
- Budget vs actual spending comparison
- Budget alerts and notifications
- Category-wise budget allocation

### Phase 3 - Advanced Analytics

- Spending pattern analysis
- Predictive insights
- Export functionality (PDF, CSV)
- Advanced reporting dashboard

### Phase 4 - Collaboration

- Shared expense tracking
- Team budget management
- Approval workflows
- Multi-user permissions

## 📚 **Resources & Documentation**

### Framework Documentation

- [Next.js Documentation](https://nextjs.org/docs) - App Router and API routes
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type safety best practices
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

### Component Libraries

- [Shadcn/UI](https://ui.shadcn.com/) - Re-usable component library
- [Recharts](https://recharts.org/) - Data visualization components
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

### Backend Services

- [Clerk Authentication](https://clerk.com/docs) - User management and auth
- [MongoDB Atlas](https://docs.atlas.mongodb.com/) - Cloud database
- [Mongoose ODM](https://mongoosejs.com/docs/) - MongoDB object modeling

## 🤝 **Contributing**

This project follows modern development practices:

- TypeScript for type safety
- ESLint + Prettier for code quality
- Conventional commits for clear history
- Component-based architecture
- Responsive design principles

## 📄 **License**

This project is built for educational and portfolio purposes.
