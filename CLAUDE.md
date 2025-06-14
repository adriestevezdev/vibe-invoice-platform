# CLAUDE.md - Vibe Invoice Platform

Utiliza context7 en cada prompt para comprobar la documentacion oficial para implementar lo que tengas que hacer de forma correcta.

## Project Overview

**Vibe Invoice Platform** is a professional invoice management system built as a full-stack web application. The project is designed as an MVP (Minimum Viable Product) to provide comprehensive invoicing capabilities for businesses.

### Project Purpose
- Create professional invoices with customizable branding
- Manage clients and products/services 
- Track invoice status (draft, sent, paid)
- Generate PDF invoices
- Dashboard for invoice analytics and management

### Current Status
- **Frontend**: Next.js 15.3.3 application with React 19, TypeScript, and Tailwind CSS
- **Backend**: Planned FastAPI backend (currently empty directory)
- **Database**: PostgreSQL planned via docker-compose.yml (not yet implemented)
- **Authentication**: Clerk OAuth integration planned (detailed guide exists)

## Architecture & Tech Stack

### Frontend (`/frontend/`)
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **Authentication**: Clerk (implementation guide available)

### Backend (`/backend/`)
- **Framework**: FastAPI (planned)
- **Database**: PostgreSQL with SQLAlchemy
- **Features**: REST APIs for clients, products, invoices, PDF generation

### Key Features Implemented
1. **Invoice Creator UI** (`/frontend/src/app/invoice-creator/page.tsx`)
   - Multi-functional invoice creation interface
   - Live preview sidebar
   - Client management integration
   - Item/service management with tax calculations
   - Multiple currency support
   - Discount and payment terms handling

## File Structure

```
/home/adria/vibe-invoice-platform/
├── frontend/                          # Next.js frontend application  
│   ├── src/app/
│   │   ├── invoice-creator/           # Invoice creation page
│   │   │   └── page.tsx              # Main invoice creator component
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── public/                       # Static assets
│   ├── package.json                  # Dependencies & scripts
│   ├── next.config.ts                # Next.js configuration
│   ├── tsconfig.json                 # TypeScript config
│   └── postcss.config.mjs            # PostCSS config
├── backend/                          # Empty - FastAPI planned
├── claude_config/                    # Claude-specific documentation
│   ├── specs/
│   │   ├── dashboard-ui.md           # Dashboard component specs
│   │   └── invoice-creation-ui.md    # Invoice creator specs
│   └── src_arquitectosIA/
│       └── invoice_creator_4.html    # HTML prototype reference
├── arquitectura.md                   # Project architecture overview
├── CLERK_IMPLEMENTATION_GUIDE.md     # Authentication setup guide
└── CLAUDE.md                         # This file
```

## Development Commands

### Docker Development (Recommended)
```bash
docker compose up            # Start all services
docker compose up -d         # Start in background
docker compose down          # Stop all services
docker compose logs -f       # View logs
docker compose --profile admin up  # Include Adminer

# Individual service commands
docker compose up frontend   # Start only frontend
docker compose up postgres   # Start only database
```

### Frontend Development (Local)
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production  
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Configuration
```bash
cp .env.example .env  # Copy environment template
# Edit .env with your specific values
```

### Key Dependencies
- **React 19.0.0** - UI library
- **Next.js 15.3.3** - React framework
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling framework
- **ESLint** - Code linting

## Current Implementation Details

### Invoice Creator Component
**Location**: `/frontend/src/app/invoice-creator/page.tsx`

**Key Features**:
- **Multi-mode Interface**: Express, Template, Recurring, Project billing modes
- **Client Management**: Dropdown selection with predefined clients, quick add functionality
- **Dynamic Item Management**: Add/remove invoice items with real-time calculations
- **Tax Handling**: Configurable tax rates per item (0%, 10%, 20% VAT)
- **Live Preview**: Real-time invoice preview with professional formatting
- **Calculation Engine**: Automatic subtotal, tax, discount, and total calculations
- **Currency Support**: Multiple currencies (USD, EUR, GBP, CAD)
- **Action Buttons**: Generate PDF, send invoice, save template, schedule delivery

**Technical Implementation**:
- React functional component with hooks (useState, useEffect)
- TypeScript interfaces for type safety
- Responsive design with Tailwind CSS
- Financial Institution theme with professional styling

### Theme Implementation
The invoice creator uses a "Financial Institution" theme featuring:
- Bank-grade security messaging
- Professional blue color palette
- Trust-building UI elements
- Clean, corporate design language
- Secure processing animations

## Authentication Setup (Planned)

Detailed implementation guide available in `CLERK_IMPLEMENTATION_GUIDE.md`:
- Next.js 15 App Router integration
- Protected routes setup
- Middleware configuration
- User management components
- API route protection

## Development Roadmap

### Immediate Next Steps
1. **Backend Development**
   - Set up FastAPI backend structure
   - Create database models (Client, Product, Invoice, LineItem)
   - Implement REST API endpoints
   - Set up PostgreSQL with docker-compose

2. **Authentication Integration**
   - Follow Clerk implementation guide
   - Set up protected routes
   - Add user management

3. **Dashboard Implementation**
   - Create dashboard UI following `/claude_config/specs/dashboard-ui.md`
   - Invoice listing and management
   - Analytics and reporting

### Longer Term Features
- PDF generation functionality
- Email sending capabilities
- Recurring invoice automation
- Advanced reporting and analytics
- Mobile responsive improvements

## Important Notes for Claude Instances

### Working with the Invoice Creator
- The main invoice creator component is fully functional for UI interactions
- Calculations are implemented client-side with real-time updates
- Backend integration points are prepared but not yet connected
- Preview functionality demonstrates professional invoice formatting

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint configuration in place
- Tailwind CSS for consistent styling
- Component-based architecture
- Responsive design principles

### Testing Approach
- Manual testing through development server
- Component functionality verified through UI interactions
- Calculation accuracy validated with test data

### Performance Considerations
- Next.js App Router for optimal loading
- Client-side state management with React hooks
- Efficient re-rendering with proper dependency arrays
- Tailwind CSS for optimized styling bundle

## Getting Started for New Development

1. **Environment Setup with Docker**
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Start all services (frontend, backend, database)
   docker compose up
   
   # Or run in background
   docker compose up -d
   
   # View logs
   docker compose logs -f
   
   # Stop services
   docker compose down
   ```

2. **Alternative: Frontend Only (Local Development)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Administration (Optional)**
   ```bash
   # Start services including Adminer
   docker compose --profile admin up
   
   # Access Adminer at http://localhost:8080
   # Server: postgres, Username: vibe_user, Password: vibe_password, Database: vibe_invoice_db
   ```

5. **Review Documentation**
   - Study `arquitectura.md` for project goals
   - Review spec files in `claude_config/specs/` for detailed requirements
   - Check HTML prototype in `claude_config/src_arquitectosIA/` for reference

6. **Development Focus Areas**
   - Backend API development (highest priority)
   - Database schema implementation
   - Authentication integration
   - Dashboard UI development

## Business Logic

### Invoice Workflow
1. **Creation**: Client selection → Item entry → Tax/discount configuration
2. **Preview**: Real-time preview with professional formatting
3. **Generation**: PDF creation and delivery (planned)
4. **Management**: Status tracking and client communication (planned)

### Data Models (Planned)
- **Client**: Company info, payment terms, contact details
- **Product/Service**: Description, rates, tax categories
- **Invoice**: Header info, line items, totals, status
- **LineItem**: Product reference, quantity, rates, taxes

This codebase represents a solid foundation for a professional invoice management system with room for significant backend development and feature expansion.