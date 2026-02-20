# Coreapps ERP - Frontend Application

Enterprise Resource Planning (ERP) system frontend for PT. Alugra Digital Indonesia. This is a React + TypeScript + Vite application that provides the user interface for HR management, financial administration, and project tracking.

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI, shadcn/ui
- **Form Management:** React Hook Form + Zod validation
- **Routing:** React Router DOM v7
- **Charts:** Recharts
- **Authentication:** Better Auth integration

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running separately (see Backend Configuration below)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:6000/api

# Add other environment variables as needed
```

### 3. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Backend Configuration

This frontend application requires a separate backend API server. The backend repository is maintained separately and should implement the API contracts defined in `API_MAPPING_DOCUMENTATION.md`.

**Backend API Endpoints:**
- Employee management: `/api/employees`
- Purchase orders: `/api/purchase-orders`
- Invoices: `/api/invoices`
- Proposals: `/api/proposals`
- Quotations: `/api/quotations`
- BAST documents: `/api/bast`
- Clients: `/api/clients`

See `API_MAPPING_DOCUMENTATION.md` for complete API specifications.

## Project Structure

```
coreapps-app/
├── src/
│   ├── api/              # API client services
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utilities and helpers
│   ├── pages/           # Page components
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── dist/                # Production build output
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Documentation

- **API Contract:** See `API_MAPPING_DOCUMENTATION.md` for complete API specifications
- **Implementation Plan:** See `alugra_erp_implementation_plan.md` for system architecture and requirements

## Features

- **HR Module:** Employee management, document tracking, position management
- **Finance Module:** Invoicing, purchase orders, quotations, proposals
- **Project Management:** Project tracking, document linking, profit/loss analysis
- **Document Generation:** PDF generation for invoices, POs, proposals, BAST
- **Authentication:** Secure login with Better Auth

## Development Notes

- This is a **frontend-only** repository
- Backend API is maintained in a separate repository
- Ensure `VITE_API_BASE_URL` environment variable is properly configured
- API contracts must match the specifications in `API_MAPPING_DOCUMENTATION.md`

## License

Proprietary - PT. Alugra Digital Indonesia
