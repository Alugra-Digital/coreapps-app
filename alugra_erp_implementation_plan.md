# ERP Implementation Plan - PT. Alugra Digital Indonesia

**Document Version:** 1.0  
**Created Date:** February 16, 2026  
**Project Type:** Custom ERP Development  
**Target Modules:** HR, Finance, Administration & Project Management

---

## Executive Summary

This implementation plan outlines the development roadmap for a comprehensive ERP system for PT. Alugra Digital Indonesia. The system will integrate HR management, financial administration, and project tracking capabilities to streamline business operations.

**Key Objectives:**
- Centralized employee data management
- Automated document generation (Proposal, Quotation, PO, Invoice, BAST)
- Financial tracking and tax calculation
- Project lifecycle management
- Seamless integration between modules

---

## 1. Project Scope & Modules

### 1.1 Core Modules

#### **Module A: Human Resources (HR)**
- Employee data management (CRUD operations)
- Personal information tracking
- Document management (KTP, KK, NPWP)
- Tax status configuration (TK/K variations)
- Bank account integration

#### **Module B: Finance & Accounting**
- Client/vendor management
- Document generation & management
- Payment tracking
- Tax calculations (PPN, PPh 23, PPh Pasal 4 Ayat 2)
- Banking integration

#### **Module C: Project Management**
- Project lifecycle tracking
- Document linking (Proposal → Invoice → BAST)
- Income & expense monitoring
- Profit/Loss analysis
- Document repository

#### **Module D: Administration**
- Proposal Penawaran generation
- Quotation creation
- Purchase Order (PO) management
- Invoice generation with tax calculations
- BAST (Berita Acara Serah Terima) creation

---

## 2. Database Schema Design

### 2.1 HR Module Tables

#### **Table: employees**
```
Fields:
- employee_id (PK, Auto-increment)
- nik (Unique, VARCHAR(50)) - Nomor Induk Karyawan
- full_name (VARCHAR(255))
- position_id (FK → positions)
- tmk (DATE) - Tanggal Masuk Kerja
- ktp_number (VARCHAR(16))
- kk_number (VARCHAR(16))
- npwp (VARCHAR(20))
- phone_number (VARCHAR(20))
- email (VARCHAR(100))
- education (VARCHAR(100))
- tax_status (ENUM: TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, K/3)
- marital_status (ENUM: Kawin, Belum Kawin)
- number_of_children (INT)
- birth_place (VARCHAR(100))
- birth_date (DATE)
- gender (ENUM: L, P)
- ktp_address (TEXT)
- ktp_city (VARCHAR(100))
- ktp_province (VARCHAR(100))
- bank_account_number (VARCHAR(50))
- bank_name (VARCHAR(100), Default: 'Mandiri')
- jkn_kis_number (VARCHAR(20))
- jms_number (VARCHAR(20))
- exit_date (DATE, Nullable)
- status (ENUM: Active, Inactive)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: positions**
```
Fields:
- position_id (PK)
- position_name (VARCHAR(100))
- department (VARCHAR(100))
- level (INT)
```

**Position Master Data:**
- DIREKTUR
- Manajemen Operation
- Project Manager
- SA (System Analyst)
- Secretary Office
- HR GA
- Finance Accounting
- Technical Writer
- Tenaga Ahli
- EOS Oracle
- EOS Ticketing
- EOS Unsoed

---

### 2.2 Finance Module Tables

#### **Table: clients**
```
Fields:
- client_id (PK)
- client_name (VARCHAR(255))
- company_name (VARCHAR(255))
- address (TEXT)
- phone (VARCHAR(20))
- email (VARCHAR(100))
- npwp (VARCHAR(20))
- pic_name (VARCHAR(255))
- pic_position (VARCHAR(100))
- pic_contact (VARCHAR(50))
- status (ENUM: Active, Inactive)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: vendors**
```
Fields:
- vendor_id (PK)
- vendor_name (VARCHAR(255))
- company_name (VARCHAR(255))
- address (TEXT)
- phone (VARCHAR(20))
- email (VARCHAR(100))
- npwp (VARCHAR(20))
- pic_name (VARCHAR(255))
- pic_position (VARCHAR(100))
- pic_contact (VARCHAR(50))
- bank_name (VARCHAR(100))
- bank_account (VARCHAR(50))
- bank_branch (VARCHAR(100))
- status (ENUM: Active, Inactive)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: tax_types**
```
Fields:
- tax_type_id (PK)
- tax_name (VARCHAR(100))
- tax_rate (DECIMAL(5,2))
- tax_category (ENUM: PPN, PPh23, PPh4_2)
- description (TEXT)
```

**Tax Master Data:**
- PPN 11% (output tax for invoices to clients)
- PPh 23 (2%) - Inter-company cost deductions
- PPh 23 (2.5%) - Professional services/expert fees
- PPh Pasal 4 Ayat 2 - Construction without certification

---

### 2.3 Project Module Tables

#### **Table: projects**
```
Fields:
- project_id (PK)
- project_code (VARCHAR(50), Unique)
- project_name (VARCHAR(255))
- client_id (FK → clients)
- project_scope (TEXT)
- start_date (DATE)
- end_date (DATE)
- project_manager_id (FK → employees)
- status (ENUM: Planning, On Progress, Completed, Cancelled)
- total_income (DECIMAL(15,2))
- total_expense (DECIMAL(15,2))
- profit_loss (DECIMAL(15,2), Computed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: project_documents**
```
Fields:
- document_id (PK)
- project_id (FK → projects)
- document_type (ENUM: Proposal, Quotation, PO, Invoice, BAST, Contract, Report)
- file_path (VARCHAR(500))
- file_name (VARCHAR(255))
- uploaded_by (FK → employees)
- upload_date (TIMESTAMP)
```

---

### 2.4 Document Management Tables

#### **Table: proposals**
```
Fields:
- proposal_id (PK)
- proposal_number (VARCHAR(50), Unique)
- project_id (FK → projects, Nullable)
- client_id (FK → clients)
- proposal_month (VARCHAR(20))
- service_offered (VARCHAR(255))
- proposal_date (DATE)
- created_by (FK → employees)
- status (ENUM: Draft, Sent, Accepted, Rejected)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: proposal_items**
```
Fields:
- item_id (PK)
- proposal_id (FK → proposals)
- description (TEXT)
- quantity (INT)
- volume (VARCHAR(50))
- price (DECIMAL(15,2))
- subtotal (DECIMAL(15,2))
- item_order (INT)
```

#### **Table: proposal_terms**
```
Fields:
- term_id (PK)
- proposal_id (FK → proposals)
- scope_of_work (TEXT)
- terms_conditions (TEXT)
- notes (TEXT)
```

#### **Table: quotations**
```
Fields:
- quotation_id (PK)
- quotation_number (VARCHAR(50), Unique)
- quotation_date (DATE)
- valid_until (DATE)
- project_id (FK → projects, Nullable)
- client_id (FK → clients)
- service_offered (VARCHAR(255))
- quotation_month (VARCHAR(20))
- subtotal (DECIMAL(15,2))
- tax_amount (DECIMAL(15,2))
- tax_type_id (FK → tax_types)
- grand_total (DECIMAL(15,2))
- payment_terms (TEXT)
- validity_period (VARCHAR(100))
- terms_conditions (TEXT)
- created_by (FK → employees)
- status (ENUM: Draft, Sent, Accepted, Rejected, Expired)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: quotation_items**
```
Fields:
- item_id (PK)
- quotation_id (FK → quotations)
- description (TEXT)
- quantity (INT)
- unit (VARCHAR(20))
- unit_price (DECIMAL(15,2))
- subtotal (DECIMAL(15,2))
- item_order (INT)
```

#### **Table: purchase_orders**
```
Fields:
- po_id (PK)
- po_number (VARCHAR(50), Unique)
- po_date (DATE)
- vendor_id (FK → vendors)
- project_id (FK → projects, Nullable)
- doc_reference (VARCHAR(100))
- subtotal (DECIMAL(15,2))
- tax_amount (DECIMAL(15,2))
- tax_type_id (FK → tax_types)
- grand_total (DECIMAL(15,2))
- payment_terms (TEXT)
- notes (TEXT)
- approved_by (FK → employees)
- status (ENUM: Draft, Sent, Confirmed, Completed, Cancelled)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Table: po_items**
```
Fields:
- item_id (PK)
- po_id (FK → purchase_orders)
- description (TEXT)
- quantity (INT)
- unit (VARCHAR(20))
- unit_price (DECIMAL(15,2))
- subtotal (DECIMAL(15,2))
- item_order (INT)
```

#### **Table: invoices**
```
Fields:
- invoice_id (PK)
- invoice_number (VARCHAR(50), Unique)
- invoice_date (DATE)
- due_date (DATE)
- client_id (FK → clients)
- project_id (FK → projects, Nullable)
- po_reference (VARCHAR(100))
- faktur_pajak (VARCHAR(100))
- subtotal (DECIMAL(15,2))
- discount (DECIMAL(15,2), Default: 0)
- tax_type_id (FK → tax_types)
- tax_amount (DECIMAL(15,2))
- dpp_amount (DECIMAL(15,2)) - Dasar Pengenaan Pajak (11/12 * Harga)
- grand_total (DECIMAL(15,2))
- payment_bank (VARCHAR(100))
- payment_account_number (VARCHAR(50))
- payment_branch (VARCHAR(100))
- payment_account_name (VARCHAR(255))
- company_npwp (VARCHAR(20))
- notes (TEXT)
- terms_conditions (TEXT)
- approved_by (FK → employees)
- payment_status (ENUM: Unpaid, Partially Paid, Paid)
- status (ENUM: Draft, Issued, Sent, Paid, Cancelled)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**DPP Calculation Formula:** 
```
DPP = (11/12) × Harga
```

#### **Table: invoice_items**
```
Fields:
- item_id (PK)
- invoice_id (FK → invoices)
- description (TEXT)
- quantity (INT)
- unit (VARCHAR(20))
- unit_price (DECIMAL(15,2))
- subtotal (DECIMAL(15,2))
- item_order (INT)
```

#### **Table: invoice_payments**
```
Fields:
- payment_id (PK)
- invoice_id (FK → invoices)
- payment_date (DATE)
- payment_amount (DECIMAL(15,2))
- payment_method (VARCHAR(100))
- payment_reference (VARCHAR(100))
- notes (TEXT)
- recorded_by (FK → employees)
- created_at (TIMESTAMP)
```

#### **Table: bast_documents**
```
Fields:
- bast_id (PK)
- bast_number (VARCHAR(50), Unique)
- bast_date (DATE)
- bast_month (VARCHAR(20))
- service_delivered (VARCHAR(255))
- project_id (FK → projects, Nullable)
- po_number (VARCHAR(50))
- invoice_number (VARCHAR(50))
- provider_name (VARCHAR(255))
- provider_position (VARCHAR(100))
- provider_company (VARCHAR(255))
- provider_signature (VARCHAR(500)) - File path
- recipient_name (VARCHAR(255))
- recipient_position (VARCHAR(100))
- recipient_company (VARCHAR(255))
- recipient_signature (VARCHAR(500)) - File path
- status (ENUM: Draft, Signed, Completed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 2.5 Additional Supporting Tables

#### **Table: company_info**
```
Fields:
- company_id (PK)
- company_name (VARCHAR(255))
- logo_path (VARCHAR(500))
- address (TEXT)
- phone (VARCHAR(20))
- email (VARCHAR(100))
- website (VARCHAR(100))
- npwp (VARCHAR(20))
- bank_name (VARCHAR(100))
- bank_account (VARCHAR(50))
- bank_branch (VARCHAR(100))
- director_name (VARCHAR(255))
```

#### **Table: document_signatures**
```
Fields:
- signature_id (PK)
- employee_id (FK → employees)
- signature_image (VARCHAR(500)) - File path
- position (VARCHAR(100))
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### **Table: audit_logs**
```
Fields:
- log_id (PK)
- user_id (FK → employees)
- action (VARCHAR(100))
- table_name (VARCHAR(100))
- record_id (INT)
- old_values (JSON)
- new_values (JSON)
- ip_address (VARCHAR(50))
- timestamp (TIMESTAMP)
```

---

## 3. Technical Architecture

### 3.1 Technology Stack

#### **Backend**
- **Framework:** Laravel 10+ / Node.js (Express/NestJS) / Django
- **Database:** MySQL 8.0+ or PostgreSQL 14+
- **API:** RESTful API with JWT authentication
- **PDF Generation:** TCPDF / DomPDF / wkhtmltopdf
- **Document Storage:** Local filesystem or AWS S3

#### **Frontend**
- **Framework:** React 18+ with TypeScript or Vue.js 3+
- **UI Library:** Ant Design / Material-UI / Tailwind CSS
- **State Management:** Redux Toolkit / Zustand / Pinia
- **Form Handling:** React Hook Form / Formik
- **PDF Viewer:** React-PDF / PDF.js

#### **Infrastructure**
- **Server:** Ubuntu 22.04 LTS
- **Web Server:** Nginx
- **SSL:** Let's Encrypt
- **Backup:** Automated daily backups
- **Version Control:** Git (GitHub/GitLab)

### 3.2 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Web Browser │  │ Mobile App   │  │  API Client  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│              Application Layer (Backend)                │
│  ┌──────────────────────────────────────────────────┐   │
│  │           API Gateway / Load Balancer            │   │
│  └────────────────┬─────────────────────────────────┘   │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐   │
│  │         Authentication & Authorization           │   │
│  │              (JWT / OAuth 2.0)                   │   │
│  └────────────────┬─────────────────────────────────┘   │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐   │
│  │              Business Logic Layer                │   │
│  │  ┌──────┐  ┌──────┐  ┌─────────┐  ┌──────────┐  │   │
│  │  │  HR  │  │Finance│  │ Project │  │ Document │  │   │
│  │  │Module│  │Module │  │ Module  │  │  Module  │  │   │
│  │  └──────┘  └──────┘  └─────────┘  └──────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Data Layer                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Relational Database (MySQL/PostgreSQL)   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │        File Storage (Local/S3)                   │   │
│  │    (PDFs, Images, Signatures, Documents)         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Feature Requirements & Specifications

### 4.1 HR Module Features

#### **4.1.1 Employee Management**

**Create Employee (Tambah)**
- Form with all employee fields
- File upload for profile picture
- Validation for required fields
- Auto-generate NIK option
- Duplicate detection (KTP, Email)

**Edit Employee**
- Update all employee information
- Track changes with audit log
- Permission-based editing
- History of modifications

**Delete Employee**
- Soft delete (mark as inactive)
- Set exit date
- Archive employee records
- Maintain referential integrity

**View Employee**
- Detailed employee profile
- Document preview (KTP, NPWP, etc.)
- Employment history
- Associated projects

#### **4.1.2 Employee List & Search**
- Searchable data table
- Filters: Position, Status, Department
- Export to Excel/PDF
- Pagination
- Sortable columns

#### **4.1.3 Position Management**
- Predefined position list
- Hierarchical structure
- Department assignment
- Position-based permissions

---

### 4.2 Finance Module Features

#### **4.2.1 Proposal Penawaran Generation**

**Required Fields:**
- Company information (auto-populated)
- Client name
- Service/work offered
- Proposal month
- Proposal number (auto-generated format: PP/PRS/MMYY/NNNN)

**Proposal Items:**
- Description
- Quantity
- Volume
- Price
- Automatic subtotal calculation

**Terms & Conditions:**
- Scope of work (Lingkup Pekerjaan)
- Terms and conditions (Syarat dan Kondisi)
- Notes

**Document Approval:**
- Location and date
- Digital signature integration
- Signer name and position (Direktur)

**Features:**
- PDF generation with company branding
- Cover page template
- Auto-numbering system
- Version control
- Status tracking (Draft, Sent, Accepted, Rejected)

---

#### **4.2.2 Quotation Generation**

**Required Fields:**
- Quotation number (auto-generated)
- Quotation date
- Valid until date
- Client information (auto-populated from client database)
- Service offered
- Month of quotation

**Item Details:**
- Description
- Quantity
- Unit
- Unit price
- Subtotal (auto-calculated)
- Tax (PPN/PPh) selection and calculation
- Grand total

**Notes Section:**
- Payment terms (DP/Termin/Pelunasan)
- Validity period
- Terms & conditions

**Document Approval:**
- Signer name
- Position
- Digital signature

**Features:**
- PDF generation
- Tax calculation automation
- Multi-currency support
- Template customization
- Email integration

**Note:** Currently, Alugra primarily uses Proposal Penawaran. Quotation module should reference standard industry templates.

---

#### **4.2.3 Purchase Order (PO) Management**

**Company Information:**
- Letterhead
- Company logo
- Full address with phone

**Order Information:**
- PO date
- PO number (auto-generated format: PO/ALG/01/YYYY/NNNN)
- Document reference

**Vendor Information:**
- Vendor name
- Phone number
- PIC (Name, Position, Contact)

**Order Details:**
- Line item number
- Item description
- Quantity
- Unit
- Unit price
- Subtotal
- Tax calculation (automatic)
- Price after tax

**Payment Terms:**
- Payment procedure (Termin, DP, Full Payment)
- Other terms and conditions

**Document Approval:**
- Position
- Name
- Digital signature

**Features:**
- PDF generation
- Vendor database integration
- Multi-item support
- Tax automation
- PO tracking and status updates

---

#### **4.2.4 Invoice Generation**

**CRITICAL Requirements Based on Document Analysis:**

**Layout Requirements:**
- Two-section layout: Upper section (Invoice details) + Lower section (Payment info)
- Company logo on left side
- "INVOICE" title prominently displayed

**Upper Section Fields:**

**Company Information:**
- Letterhead with logo
- Full company address
- Phone number

**Invoice Information (Informasi Invoice):**
- Invoice name/title
- Invoice number (auto-generated: INV/PROSIA/JN/MM/YYYY)
- Invoice date
- Tax invoice number (Faktur Pajak)
- Due date (Jatuh Tempo)

**Billing Information (Informasi Tagihan):**
- Client company name
- Full address
- Phone number
- PIC (Name, Position, Contact)

**Item Details (Detail Pesanan):**
- Line number
- Item description (with sub-items/notes support)
- Quantity
- Unit
- Unit price
- Subtotal
- **DPP Calculation** (CRITICAL: Formula = 11/12 × Price)
- Tax calculation (automatic based on tax type)
- Grand total after tax
- Notes or terms and conditions inline

**Lower Section Fields:**

**Payment Information (Informasi Pembayaran):**
- Bank name
- Bank account number
- Bank branch
- Account holder name
- Company NPWP

**Document Approval (Pengesahan Dokumen):**
- Position (e.g., Direktur)
- Name
- Digital signature

**Notes/Terms:**
- Payment terms
- Other relevant notes

**IMPORTANT Changes Required:**
1. **Remove** paid/unpaid status display after invoice is issued
2. **Add** Payment Information section (currently missing)
3. **Add** Document Approval section (currently missing)
4. **Add** DPP calculation field (Formula: 11/12 × Harga)
5. **Update** layout to match reference template

**DPP Calculation Feature:**
```
Purpose: Facilitate tax invoice (faktur pajak) release
Formula: DPP = (11/12) × Total Price
Display: Show separately in invoice
```

**Features:**
- PDF generation with two-section layout
- Automatic DPP calculation
- Tax automation (PPN 11%)
- Payment tracking (separate from invoice display)
- Multi-termin support
- Overdue notifications
- Payment history tracking
- Email delivery
- Print-ready format

---

#### **4.2.5 BAST (Berita Acara Serah Terima)**

**Cover Page:**
- Service/work delivered
- Company name
- Month of BAST
- Company information

**Document Information:**
- BAST number (auto-generated)
- BAST date
- Related PO/Invoice number

**Provider Information (Pihak Penyerah):**
- Name
- Position
- Company
- Signature upload/digital signature

**Recipient Information (Pihak Penerima):**
- Name
- Position
- Company
- Signature upload/digital signature

**Features:**
- PDF generation
- Digital signature integration
- Link to related documents (PO, Invoice)
- Status tracking
- Archive management

---

#### **4.2.6 Tax Management (Perpajakan)**

**Tax Types Configuration:**

1. **PPN 11%**
   - Most common in invoices to clients
   - Auto-calculation on invoice total
   - DPP calculation support

2. **PPh 23 (2%)**
   - Inter-company cost deductions
   - Common in POs to clients
   - Withholding tax

3. **PPh 23 (2.5%)**
   - Professional services/expert fees
   - Common in POs to clients
   - Service tax deduction

4. **PPh Pasal 4 Ayat 2**
   - Construction without certification
   - Specific rate application

**Features:**
- Tax type master data
- Rate configuration
- Automatic tax calculation
- Tax reports generation
- Integration with invoices and POs

---

### 4.3 Project Management Features

#### **4.3.1 Project Creation & Management**

**Project Identity:**
- Auto-generated Project ID
- Project name
- Client selection (linked to client database)
- Project scope description
- Start and end dates
- Project manager assignment
- Status tracking

**Document Linkage:**
- Link proposal to project
- Link quotation to project
- Link PO to project
- Link invoices to project
- Link BAST to project
- View all related documents in one place

**Financial Tracking:**
- Income tracking (linked to invoices/payments)
- Expense tracking (internal costs, vendor payments, operational)
- Auto-calculated Profit/Loss (Income - Expense)
- Budget vs. actual comparison

**Project Documentation:**
- Upload contracts
- Upload photos
- Upload work files
- Upload additional reports
- Categorized file management

**Features:**
- Project dashboard
- Timeline visualization
- Status updates
- Progress reporting
- Team assignment
- Milestone tracking

---

### 4.4 Document Management Features

#### **4.4.1 Universal Document Features**

**Auto-numbering System:**
- Format configuration per document type
- Sequential numbering
- Year/month integration
- Custom prefixes

**Templates:**
- Customizable PDF templates
- Company branding
- Letterhead integration
- Signature placement

**Version Control:**
- Track document revisions
- Compare versions
- Restore previous versions

**Approval Workflow:**
- Multi-level approval
- Email notifications
- Status tracking
- Approval history

**Digital Signatures:**
- Upload signature images
- Position-based signatures
- Timestamp verification

**Document Linking:**
- Cross-reference related documents
- Automatic linking by project
- Trace document flow (Proposal → Quotation → PO → Invoice → BAST)

---

## 5. Implementation Roadmap

### Phase 1: Foundation & Core Setup (Weeks 1-4)

#### **Week 1-2: Project Setup & Database**
- [ ] Set up development environment
- [ ] Configure version control (Git)
- [ ] Install and configure backend framework
- [ ] Install and configure frontend framework
- [ ] Create database schema
- [ ] Set up development, staging, production environments
- [ ] Configure CI/CD pipeline

**Deliverables:**
- Development environment ready
- Database schema implemented
- Basic project structure

#### **Week 3-4: Authentication & User Management**
- [ ] Implement user authentication (login/logout)
- [ ] JWT token management
- [ ] Role-based access control (RBAC)
- [ ] User session management
- [ ] Password reset functionality
- [ ] Basic admin panel

**Deliverables:**
- Working authentication system
- User roles and permissions
- Admin dashboard skeleton

---

### Phase 2: HR Module Development (Weeks 5-8)

#### **Week 5-6: Employee Master Data**
- [ ] Create employee CRUD operations
- [ ] Implement employee list with search and filters
- [ ] File upload for employee documents
- [ ] Position management
- [ ] Employee profile view
- [ ] Data validation and error handling

**Deliverables:**
- Functional employee management system
- Employee database populated
- Position hierarchy

#### **Week 7-8: HR Features Enhancement**
- [ ] Employee status management (active/inactive)
- [ ] Tax status configuration
- [ ] Bank information management
- [ ] Export employee data (Excel/PDF)
- [ ] Employee reports
- [ ] Audit logs for HR data

**Deliverables:**
- Complete HR module
- Employee reports
- HR module testing complete

---

### Phase 3: Client/Vendor Management (Weeks 9-10)

#### **Week 9-10: Master Data Management**
- [ ] Client CRUD operations
- [ ] Vendor CRUD operations
- [ ] Client/vendor profile management
- [ ] Contact information tracking
- [ ] PIC management
- [ ] Client/vendor search and filters

**Deliverables:**
- Client management system
- Vendor management system
- Master data populated

---

### Phase 4: Document Generation - Part 1 (Weeks 11-14)

#### **Week 11-12: Proposal & Quotation**
- [ ] Proposal Penawaran form and generation
- [ ] Proposal PDF template design
- [ ] Proposal auto-numbering system
- [ ] Proposal items management
- [ ] Quotation form and generation
- [ ] Quotation PDF template design
- [ ] Tax calculation integration

**Deliverables:**
- Proposal generation system
- Quotation generation system
- PDF templates

#### **Week 13-14: Purchase Order**
- [ ] PO form and generation
- [ ] PO PDF template design
- [ ] Vendor selection and auto-population
- [ ] PO items management
- [ ] Tax calculation for POs
- [ ] PO approval workflow
- [ ] PO status tracking

**Deliverables:**
- Purchase Order system
- PO templates
- Vendor integration

---

### Phase 5: Document Generation - Part 2 (Weeks 15-18)

#### **Week 15-17: Invoice System**
- [ ] Invoice form with all required fields
- [ ] **DPP calculation implementation** (11/12 × Harga)
- [ ] Invoice PDF template (two-section layout)
- [ ] Tax calculation automation
- [ ] Payment information section
- [ ] Document approval section
- [ ] Multi-item invoice support
- [ ] Invoice numbering system

**CRITICAL Implementation:**
- Remove paid/unpaid status from issued invoices
- Add Payment Information section
- Add Document Approval section
- Implement DPP calculation field
- Update layout to match reference template

**Deliverables:**
- Complete invoice generation system
- DPP calculation feature
- Updated PDF template
- Payment information integration

#### **Week 18: BAST Generation**
- [ ] BAST form and generation
- [ ] BAST PDF template design
- [ ] Digital signature integration
- [ ] Link to PO and Invoice
- [ ] BAST approval workflow

**Deliverables:**
- BAST generation system
- Digital signature feature
- Document linking

---

### Phase 6: Project Management Module (Weeks 19-22)

#### **Week 19-20: Project Core**
- [ ] Project CRUD operations
- [ ] Project dashboard
- [ ] Timeline visualization
- [ ] Status tracking
- [ ] Team assignment
- [ ] Client linking

**Deliverables:**
- Project management system
- Project dashboard

#### **Week 21-22: Financial Tracking & Document Linking**
- [ ] Link documents to projects
- [ ] Income tracking
- [ ] Expense tracking
- [ ] Profit/Loss calculation
- [ ] Budget management
- [ ] Project reports
- [ ] Document repository

**Deliverables:**
- Complete project financial tracking
- Document-project integration
- Project reports

---

### Phase 7: Tax Management & Financial Reports (Weeks 23-24)

#### **Week 23-24: Tax & Reports**
- [ ] Tax type master data
- [ ] Tax rate configuration
- [ ] Tax reports (PPN, PPh)
- [ ] Financial summary reports
- [ ] Income vs. expense reports
- [ ] Tax calculation verification
- [ ] Export financial data

**Deliverables:**
- Tax management system
- Financial reports
- Tax compliance features

---

### Phase 8: Integration & Advanced Features (Weeks 25-27)

#### **Week 25: Document Workflow**
- [ ] Document approval workflow
- [ ] Email notifications
- [ ] Document status tracking
- [ ] Version control
- [ ] Document archiving
- [ ] Search across all documents

**Deliverables:**
- Complete document workflow
- Notification system

#### **Week 26: Payment Tracking**
- [ ] Payment recording system
- [ ] Payment history
- [ ] Payment reminders
- [ ] Outstanding invoice reports
- [ ] Payment terms management
- [ ] Aging analysis

**Deliverables:**
- Payment tracking system
- Payment reports

#### **Week 27: System Integration**
- [ ] Cross-module data validation
- [ ] Data consistency checks
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Security hardening

**Deliverables:**
- Fully integrated system
- Integration test results

---

### Phase 9: Testing & Quality Assurance (Weeks 28-30)

#### **Week 28-29: Comprehensive Testing**
- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing (UAT)
- [ ] Performance testing
- [ ] Security testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

**Deliverables:**
- Test reports
- Bug tracking and resolution
- Performance benchmarks

#### **Week 30: Bug Fixes & Refinement**
- [ ] Fix identified bugs
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Final UAT

**Deliverables:**
- Stable system ready for deployment
- Complete test documentation

---

### Phase 10: Deployment & Training (Weeks 31-32)

#### **Week 31: Deployment**
- [ ] Production server setup
- [ ] Database migration
- [ ] SSL certificate installation
- [ ] Backup configuration
- [ ] Monitoring setup
- [ ] Go-live preparation

**Deliverables:**
- Production system live
- Backup and recovery procedures

#### **Week 32: Training & Handover**
- [ ] User training sessions
- [ ] Admin training
- [ ] Documentation handover
- [ ] Support procedures
- [ ] System maintenance guide

**Deliverables:**
- Trained users
- Complete documentation
- Support plan

---

## 6. User Interface & User Experience

### 6.1 Design Principles

**Consistency:**
- Uniform color scheme aligned with company branding (Alugra colors)
- Consistent typography
- Standard button styles
- Predictable navigation

**Clarity:**
- Clear labels and instructions
- Intuitive form layouts
- Helpful error messages
- Contextual help

**Efficiency:**
- Minimal clicks to complete tasks
- Keyboard shortcuts
- Bulk actions
- Quick search functionality

**Responsiveness:**
- Mobile-friendly design
- Tablet optimization
- Fast loading times
- Progressive enhancement

### 6.2 Key UI Components

#### **Dashboard**
- Summary cards (Total Employees, Active Projects, Outstanding Invoices)
- Recent activities
- Quick actions
- Charts and graphs (Income trends, Project status)

#### **Navigation**
- Sidebar menu with modules:
  - Dashboard
  - HR Management
    - Employees
    - Positions
  - Finance
    - Clients
    - Vendors
    - Documents
      - Proposals
      - Quotations
      - Purchase Orders
      - Invoices
      - BAST
    - Payments
    - Tax Management
  - Projects
  - Reports
  - Settings

#### **Forms**
- Tabbed forms for complex data entry
- Auto-save functionality
- Validation with inline error messages
- Date pickers
- Dropdown selects with search
- File upload with preview

#### **Tables/Lists**
- Searchable data tables
- Column sorting
- Filters and advanced search
- Pagination
- Bulk actions
- Export options (Excel, PDF, CSV)

#### **PDF Preview**
- Inline preview before generation
- Download option
- Print option
- Email directly from system

---

## 7. Security & Compliance

### 7.1 Security Measures

**Authentication:**
- Strong password requirements
- Password encryption (bcrypt/Argon2)
- Session timeout
- Two-factor authentication (optional)

**Authorization:**
- Role-based access control (RBAC)
- Permission-based feature access
- Data-level permissions

**Data Protection:**
- HTTPS encryption
- Database encryption at rest
- Secure file storage
- Regular security audits

**Input Validation:**
- Server-side validation
- SQL injection prevention
- XSS protection
- CSRF tokens

**Audit & Logging:**
- User activity logs
- Document access logs
- Change tracking
- Failed login attempts

### 7.2 Backup & Recovery

**Automated Backups:**
- Daily database backups
- Weekly full system backups
- Offsite backup storage
- Backup verification

**Disaster Recovery:**
- Recovery procedures documented
- Regular recovery testing
- Data retention policy (7 years for financial documents)
- Business continuity plan

---

## 8. Testing Strategy

### 8.1 Testing Types

**Unit Testing:**
- Backend API endpoints
- Business logic functions
- Database queries
- Calculation functions (tax, DPP, profit/loss)

**Integration Testing:**
- Module interactions
- API integrations
- Database transactions
- Third-party services

**Functional Testing:**
- User workflows
- Form submissions
- Document generation
- Report generation

**Performance Testing:**
- Load testing (concurrent users)
- Stress testing
- Database query optimization
- Page load times

**Security Testing:**
- Penetration testing
- Vulnerability scanning
- Authentication testing
- Authorization testing

**User Acceptance Testing (UAT):**
- Real user scenarios
- Feedback collection
- Usability testing
- Business process validation

### 8.2 Test Cases

**Critical Test Scenarios:**

1. **Employee Management**
   - Create employee with all fields
   - Edit employee information
   - Delete/deactivate employee
   - Search and filter employees

2. **Document Generation**
   - Generate Proposal Penawaran with PDF
   - Generate Quotation with tax calculation
   - Generate PO with vendor info
   - Generate Invoice with DPP calculation
   - Generate BAST with signatures

3. **Tax Calculations**
   - PPN 11% calculation accuracy
   - PPh 23 (2%) calculation
   - PPh 23 (2.5%) calculation
   - DPP formula verification (11/12 × Harga)

4. **Project Management**
   - Create project and link documents
   - Track income and expenses
   - Calculate profit/loss
   - Generate project reports

5. **Payment Tracking**
   - Record payment against invoice
   - Update payment status
   - Generate payment reports
   - Overdue invoice notifications

---

## 9. Documentation Requirements

### 9.1 Technical Documentation

**System Architecture Document:**
- System overview
- Component diagrams
- Database schema
- API documentation
- Deployment architecture

**API Documentation:**
- Endpoint descriptions
- Request/response examples
- Authentication methods
- Error codes and messages

**Database Documentation:**
- ER diagrams
- Table descriptions
- Relationships
- Indexes and constraints
- Sample queries

**Code Documentation:**
- Inline code comments
- Function descriptions
- Module documentation
- Naming conventions

### 9.2 User Documentation

**User Manual:**
- Getting started guide
- Module-by-module instructions
- Screenshots and tutorials
- FAQs
- Troubleshooting

**Admin Guide:**
- System configuration
- User management
- Backup and restore
- Security settings
- Maintenance procedures

**Training Materials:**
- Video tutorials
- Quick reference guides
- Cheat sheets
- Sample workflows

---

## 10. Maintenance & Support Plan

### 10.1 Ongoing Maintenance

**Regular Updates:**
- Security patches
- Bug fixes
- Feature enhancements
- Performance optimization

**Database Maintenance:**
- Index optimization
- Query performance tuning
- Data archiving
- Storage management

**Monitoring:**
- System uptime monitoring
- Error logging and alerts
- Performance metrics
- User activity tracking

### 10.2 Support Structure

**Tiered Support:**
- **Level 1:** User support (password resets, general questions)
- **Level 2:** Technical support (bug reports, feature requests)
- **Level 3:** Development team (critical issues, system failures)

**Support Channels:**
- Email support
- Help desk ticketing system
- Phone support (business hours)
- Remote assistance

**SLA (Service Level Agreement):**
- Response time commitments
- Resolution time targets
- Uptime guarantees
- Support hours

---

## 11. Risk Management

### 11.1 Identified Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Scope creep | High | Medium | Strict change control process |
| Data migration issues | High | Medium | Thorough testing, backup procedures |
| User resistance | Medium | Medium | Training, change management |
| Performance issues | Medium | Low | Load testing, optimization |
| Security breach | Critical | Low | Security audits, encryption |
| Third-party dependencies | Medium | Medium | Vendor evaluation, alternatives |
| Budget overrun | Medium | Low | Regular budget reviews |
| Timeline delays | Medium | Medium | Agile methodology, buffer time |

### 11.2 Contingency Plans

**Data Loss:**
- Restore from automated backups
- Verify data integrity
- Communicate with users

**System Downtime:**
- Switch to backup server
- Notify users via email
- Provide status updates

**Critical Bug:**
- Hot-fix deployment
- Rollback to previous version
- Emergency support team

---

## 12. Success Metrics & KPIs

### 12.1 System Performance Metrics

- **Uptime:** 99.5% availability
- **Response Time:** < 2 seconds for page loads
- **Database Query Time:** < 500ms average
- **Document Generation Time:** < 5 seconds for PDFs

### 12.2 Business Metrics

- **User Adoption Rate:** > 90% of target users
- **Document Processing Time:** 50% reduction vs. manual process
- **Error Rate:** < 1% in financial calculations
- **User Satisfaction:** > 4.0/5.0 rating
- **Support Tickets:** < 5 per week after 3 months

### 12.3 Financial Metrics

- **ROI Timeline:** Payback within 18 months
- **Time Savings:** 20+ hours per week
- **Cost Reduction:** 30% reduction in administrative costs
- **Accuracy Improvement:** 95%+ accuracy in financial documents

---

## 13. Future Enhancements (Post-Launch)

### 13.1 Phase 11+ Features

**Mobile Application:**
- Native iOS and Android apps
- Mobile document approval
- Push notifications
- Offline capability

**Advanced Reporting:**
- Custom report builder
- Data visualization dashboard
- Predictive analytics
- Export to BI tools

**Integration Capabilities:**
- Accounting software integration (Accurate, Jurnal)
- Email marketing integration
- CRM integration
- Cloud storage integration (Google Drive, Dropbox)

**Workflow Automation:**
- Automated invoice reminders
- Project milestone notifications
- Approval routing automation
- Document expiration alerts

**AI/ML Features:**
- Document OCR for data extraction
- Predictive budgeting
- Anomaly detection in expenses
- Smart document classification

**E-Signature Integration:**
- DocuSign integration
- Adobe Sign integration
- Legal validity compliance

---

## 14. Budget Estimate

### 14.1 Development Costs

| Item | Description | Estimated Cost (IDR) |
|------|-------------|----------------------|
| **Backend Development** | 32 weeks × Developer rate | 80,000,000 - 120,000,000 |
| **Frontend Development** | 32 weeks × Developer rate | 80,000,000 - 120,000,000 |
| **UI/UX Design** | Design system, mockups, prototypes | 20,000,000 - 30,000,000 |
| **Database Design** | Schema, optimization, migration | 15,000,000 - 20,000,000 |
| **Testing & QA** | Manual and automated testing | 25,000,000 - 35,000,000 |
| **Project Management** | 32 weeks × PM rate | 30,000,000 - 45,000,000 |
| **DevOps & Infrastructure** | Server setup, CI/CD, monitoring | 15,000,000 - 20,000,000 |
| **Documentation** | Technical and user documentation | 10,000,000 - 15,000,000 |
| **Training** | User and admin training | 10,000,000 - 15,000,000 |
| **Contingency** | 15% buffer | 42,000,000 - 63,000,000 |
| **TOTAL** | | **327,000,000 - 483,000,000** |

### 14.2 Infrastructure Costs (Annual)

| Item | Description | Estimated Cost (IDR) |
|------|-------------|----------------------|
| **Server Hosting** | Cloud VPS or dedicated server | 12,000,000 - 24,000,000 |
| **Domain & SSL** | Domain registration, SSL certificate | 1,500,000 - 3,000,000 |
| **Backup Storage** | Offsite backup solution | 3,000,000 - 6,000,000 |
| **Monitoring Tools** | Uptime monitoring, error tracking | 2,000,000 - 4,000,000 |
| **Email Service** | Transactional email provider | 2,000,000 - 4,000,000 |
| **Support & Maintenance** | Ongoing support (20% of dev cost) | 65,000,000 - 96,000,000 |
| **TOTAL (Year 1)** | | **85,500,000 - 137,000,000** |

---

## 15. Stakeholders & Roles

### 15.1 Project Team

**Executive Sponsor:**
- Approve project scope and budget
- Provide strategic direction
- Remove organizational blockers

**Project Manager:**
- Overall project coordination
- Timeline and budget management
- Stakeholder communication
- Risk management

**Business Analyst:**
- Requirements gathering
- Process documentation
- User story creation
- UAT coordination

**Development Team:**
- Backend Developer (2)
- Frontend Developer (2)
- Database Administrator (1)
- DevOps Engineer (1)

**Design Team:**
- UI/UX Designer (1)
- Graphic Designer (1)

**Quality Assurance:**
- QA Tester (2)
- Security Auditor (1)

**End Users:**
- HR Team (2-3 users)
- Finance Team (2-3 users)
- Director/Management (1-2 users)
- Project Managers (2-3 users)

### 15.2 Communication Plan

**Weekly Status Meetings:**
- Project team sync
- Progress updates
- Blocker resolution

**Bi-weekly Stakeholder Updates:**
- Executive summary
- Milestone achievements
- Budget status

**Monthly Demos:**
- Feature demonstrations
- User feedback sessions
- UAT results review

---

## 16. Change Management

### 16.1 Change Control Process

**Change Request Submission:**
- Formal change request form
- Impact assessment required
- Stakeholder approval needed

**Change Evaluation:**
- Technical feasibility
- Cost and timeline impact
- Priority assessment

**Change Approval:**
- Executive sponsor approval for major changes
- Project manager approval for minor changes
- Documentation of all changes

**Change Implementation:**
- Update project plan
- Communicate to team
- Track and verify completion

### 16.2 User Adoption Strategy

**Communication:**
- Regular updates to users
- Benefits and features highlights
- Success stories sharing

**Training:**
- Role-based training sessions
- Hands-on workshops
- Video tutorials
- User manuals

**Support:**
- Dedicated support during transition
- Super user program
- Feedback mechanism
- Regular check-ins

**Incentives:**
- Early adopter recognition
- User feedback rewards
- Best practice sharing

---

## 17. Compliance & Legal Considerations

### 17.1 Data Privacy

**Personal Data Protection:**
- Compliance with Indonesian data protection regulations
- Employee consent for data collection
- Data retention policies
- Right to access and delete data

**Data Security:**
- Encryption of sensitive data
- Secure data transmission
- Access controls and logging
- Regular security audits

### 17.2 Financial Compliance

**Tax Regulations:**
- Accurate tax calculations per Indonesian tax law
- Proper documentation for audit trails
- Tax report generation
- Integration with e-Faktur system (future)

**Accounting Standards:**
- Proper financial record keeping
- Invoice numbering compliance
- Document retention (minimum 7 years)
- Audit trail maintenance

---

## 18. Deployment Strategy

### 18.1 Deployment Phases

**Phase 1: Development Environment**
- Local development setup
- Feature development and testing
- Code reviews

**Phase 2: Staging Environment**
- Pre-production testing
- UAT execution
- Performance testing
- Security testing

**Phase 3: Production Deployment**
- Gradual rollout
- Pilot user group (5-10 users)
- Monitor and fix issues
- Full deployment

### 18.2 Rollback Plan

**Automated Rollback:**
- Database backup before deployment
- Application state snapshot
- Quick rollback procedure
- Verification steps

**Manual Rollback:**
- Step-by-step rollback guide
- Data consistency checks
- User notification
- Incident report

---

## 19. Appendices

### Appendix A: Glossary

- **NIK:** Nomor Induk Karyawan (Employee ID Number)
- **TMK:** Tanggal Masuk Kerja (Work Start Date)
- **KTP:** Kartu Tanda Penduduk (ID Card)
- **KK:** Kartu Keluarga (Family Card)
- **NPWP:** Nomor Pokok Wajib Pajak (Tax ID Number)
- **JKN/KIS:** Jaminan Kesehatan Nasional / Kartu Indonesia Sehat (National Health Insurance)
- **JMS:** Jaminan Hari Tua (Old Age Insurance)
- **PPN:** Pajak Pertambahan Nilai (Value Added Tax) - 11%
- **PPh:** Pajak Penghasilan (Income Tax)
- **DPP:** Dasar Pengenaan Pajak (Tax Base)
- **BAST:** Berita Acara Serah Terima (Handover Certificate)
- **PO:** Purchase Order
- **PIC:** Person In Charge

### Appendix B: Document Numbering Formats

- **Proposal:** PP/PRS/MMYY/NNNN
- **Quotation:** QT/ALG/MMYY/NNNN (to be defined)
- **Purchase Order:** PO/ALG/MM/YYYY/NNNN
- **Invoice:** INV/PROSIA/JN/MM/YYYY or INV/NNNNNN
- **BAST:** BAST/ALG/MMYY/NNNN

### Appendix C: Tax Calculation Examples

**Example 1: Invoice with PPN 11%**
```
Subtotal: Rp 10,000,000
DPP = (11/12) × 10,000,000 = Rp 9,166,667
PPN 11% = Rp 1,100,000
Grand Total: Rp 11,100,000
```

**Example 2: PO with PPh 23 (2%)**
```
Subtotal: Rp 5,000,000
PPh 23 (2%): Rp 100,000
Total after withholding: Rp 4,900,000
```

### Appendix D: User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full system access, user management, all CRUD operations |
| **Director** | Approve documents, view all data, financial reports |
| **HR Manager** | Employee CRUD, view employee reports, export data |
| **Finance Manager** | All financial documents, tax management, payment tracking |
| **Project Manager** | Project CRUD, document linking, project reports |
| **Finance Staff** | Create/edit invoices, POs, view payments |
| **Viewer** | Read-only access to assigned modules |

---

## 20. Conclusion

This implementation plan provides a comprehensive roadmap for developing a custom ERP system tailored to PT. Alugra Digital Indonesia's specific business needs. The 32-week timeline covers all critical modules including HR, Finance, Administration, and Project Management.

**Key Success Factors:**
1. Strong executive sponsorship and user buy-in
2. Dedicated and skilled development team
3. Rigorous testing at every phase
4. Comprehensive user training and change management
5. Ongoing support and maintenance commitment

**Next Steps:**
1. Review and approve implementation plan
2. Secure budget and resources
3. Assemble project team
4. Kickoff meeting and project initiation
5. Begin Phase 1 development

**Contact Information:**
- Project Manager: [Name]
- Technical Lead: [Name]
- Business Analyst: [Name]

---

**Document Approval:**

| Name | Role | Signature | Date |
|------|------|-----------|------|
| Eko Budianto | Director | ___________ | ______ |
| [PM Name] | Project Manager | ___________ | ______ |
| [Tech Lead] | Technical Lead | ___________ | ______ |

---

*End of Implementation Plan*