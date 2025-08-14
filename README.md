# Hello CRM

A comprehensive Customer Relationship Management (CRM) system built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## 🚀 Features

- **People Management**: Full CRUD operations with custom fields
- **Organization Management**: Company and organization tracking
- **Pipeline Management**: Kanban board with drag-and-drop
- **Task Management**: Task tracking with filtering and status management
- **Relationship Tracking**: Connect people with different relationship types
- **Custom Fields**: Dynamic custom fields for people and organizations
- **Data Import/Export**: CSV and JSON import/export with field mapping
- **Reports**: Dynamic reporting with pipeline analytics
- **Settings**: Comprehensive system configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (local) / PostgreSQL (production)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with drag-and-drop support
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ (managed via Volta)
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd hello-crm

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database URL

# Set up database
npx prisma generate
npx prisma db push

# Seed the database
npm run seed

# Start development server
npm run dev
```

## ☁️ Cloud Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Set up Database**
   - In Vercel dashboard, go to "Storage"
   - Create a new Postgres database
   - Copy the connection string
   - Add `DATABASE_URL` to environment variables

4. **Deploy Database Schema**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Option 2: Railway

1. **Deploy to Railway**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-deploy

2. **Set up Database**
   - Add PostgreSQL service
   - Copy connection string to environment variables

## 🔧 Environment Variables

Create a `.env` file with:

```env
# Database (SQLite for local, PostgreSQL for production)
DATABASE_URL="file:./dev.db"  # Local
# DATABASE_URL="postgresql://..."  # Production

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"  # Local
# NEXTAUTH_URL="https://your-domain.vercel.app"  # Production
```

## 📊 Database Schema

The CRM includes these main entities:
- **People**: Contact information with custom fields
- **Organizations**: Companies and organizations
- **Pipelines**: Sales/marketing pipelines with stages
- **Tasks**: Task management with due dates
- **Relationships**: Connections between people
- **Custom Fields**: Dynamic field system

## 🎯 Key Features

### Custom Fields System
- Create custom field sections
- Add various field types (text, email, phone, date, select, etc.)
- Organize fields into sections
- Full CRUD operations

### Data Management
- **Export**: CSV/JSON with custom field support
- **Import**: Smart field mapping with duplicate detection
- **Backup**: Database backup and restore capabilities

### Pipeline Management
- Kanban board interface
- Drag-and-drop functionality
- Stage management
- Item tracking with history

### Reporting
- Dynamic pipeline reports
- Time-in-stage analytics
- Velocity tracking
- Custom report generation

## 🚀 Getting Started

1. **Access the Application**
   - Local: `http://localhost:3000`
   - Production: Your deployed URL

2. **Initial Setup**
   - Go to Settings → People Custom Fields
   - Create custom field sections
   - Add custom fields as needed

3. **Import Data**
   - Go to Settings → Data Management
   - Use the import feature to bring in existing data

4. **Create Pipelines**
   - Go to Pipelines
   - Create your first pipeline with stages

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, TypeScript, and Prisma**
