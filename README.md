# IMPACT-BRIDGE

<div align="center">

![Impact Bridge Banner](https://img.shields.io/badge/IMPACT--BRIDGE-Grassroots%20NGO%20Platform-1B4332?style=for-the-badge&logo=heart&logoColor=FFD166)

**A Centralized NGO Management, Grassroots Operations & GIS Impact Tracking Platform**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7.18-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Mapping-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Design System](https://img.shields.io/badge/UI_Style-Neo--Brutalist-FFE135?style=flat-square&logoColor=black)](#-design-aesthetic)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Explore Features](#-key-features) • [Quickstart](#-quick-start) • [Architecture](#-project-architecture) • [API Docs](#-api-endpoints) • [Design System](#-design-aesthetic)

</div>

---

## 📌 Executive Overview

**Impact Bridge** is a full-stack, enterprise-ready web platform engineered specifically for non-governmental organizations (NGOs), non-profits, and public charitable trusts. It bridges the operational gap between grassroots on-ground action, donor engagement, and operational transparency.

Built using an unapologetically bold **Neo-Brutalist design language** paired with high-performance modern web technologies (React 19, Vite, Express 5, and Leaflet GIS), Impact Bridge empowers social initiatives to transparently showcase verified projects, streamline volunteer onboarding, accept statutory 80G tax-exempt donations, and manage field operations through an integrated administrative suite.

---

## 🌟 Key Features

### 🌐 1. Public Experience Portal
- **Interactive Homepage:**
  - Live impact metric counters (Beneficiaries supported, Volunteers mobilized, Funds raised, Active initiatives).
  - High-energy neo-brutalist ticker / marquee broadcasting real-time campaign updates.
  - Featured programs showcase with progress indicators and instant pledge triggers.
- **Programs & Causes Directory (`/programs`):**
  - **Dynamic Category Selector Dropdown:** Custom neo-brutalist popover with domain tags and live initiative counts.
  - **Multi-Status Workflow Tabs:** Instant filtering across *All Programs*, *Ongoing*, *Upcoming*, and *Completed*.
  - **Dual Layout Modes:** Smooth toggle between high-density *Grid View* and detailed *List View*.
  - **Full-Text Live Search:** Real-time query matching across initiative titles, descriptions, and regional tags.
- **Program Details (`/programs/:id`):**
  - High-resolution visual gallery, problem statements, and key milestones.
  - Real-time funding progress bars (`₹ Raised` vs `₹ Target Goal`).
  - Beneficiary count, volunteer capacity indicators, and immediate action buttons.
- **Interactive GIS Impact Map (`/impact-map`):**
  - Full-screen GIS interface powered by Leaflet & OpenStreetMap.
  - Custom branded marker pins for relief centers, clinics, schools, and ration depots.
  - Proximity locator: calculates nearest initiatives to user's coordinates with directions via Google Maps.
  - Domain filtering (Healthcare, Education, Nutrition, Disaster Relief, Livelihoods).
- **Online Donations & Pledges (`/donation`):**
  - Quick-select amounts (₹500, ₹1,000, ₹2,500, ₹5,000, ₹10,000) or custom pledge entry.
  - **Section 80G Tax Exemption:** Automatic PAN collection for IT Department Form 10BD/10BE filing.
  - Payment simulation across UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking.
  - Confetti celebration feedback on successful transaction via Canvas Confetti.
- **Volunteer Enrolment Portal (`/volunteer`):**
  - Filterable directory of open field roles and remote skill-based opportunities.
  - Streamlined volunteer application form with skills matrix and location matching.
- **Changemakers & Leaders (`/about`, `/about/changemakers/:slug`):**
  - Dedicated leadership showcase and dedicated changemaker profile panels.
  - Biographical trajectories, active projects led, and community testimonials.
- **Beneficiary Assistance Portal (`/beneficiary`):**
  - Transparent interface for beneficiaries to verify aid status, locate aid camps, and apply for resource allocation.
- **Monthly Impact Dispatch Newsletter:**
  - Embedded in footer across all public views.
  - RFC 5322 email validation, automated duplicate detection, and instant client feedback state.
- **Statutory Legal & Compliance Center:**
  - **Privacy Policy (`/privacy`):** Compliance under the Digital Personal Data Protection (DPDP) Act 2023, Section 80G donor PAN filing guidelines, zero card-retention policies, and Grievance Officer contacts.
  - **Terms of Service (`/terms`):** Charitable trust bylaws, volunteer safeguarding policies (POCSO Act, non-discrimination), non-refundable voluntary donation rules, and legal jurisdiction.

---

### 🛡️ 2. Administrative & Operations Hub (`/admin/*`)
- **Executive Dashboard:**
  - Real-time KPI summary widgets for total donations, verified beneficiaries, and active field units.
  - Interactive SVG analytics charts: Donut breakdown by domain, Bar charts for monthly funding, and Line charts for donor growth.
- **Campaign & Program Management (`/admin/programs`):**
  - Create, edit, publish, or archive initiatives.
  - Set target budgets, allocate resources, and update completion statuses.
- **Donation & Financial Ledger (`/admin/donations`):**
  - Searchable transaction history, donor details, payment modes, and 80G receipt dispatch status.
- **Volunteer Operations Directory (`/admin/volunteers`):**
  - Active roster with contact information, assigned programs, hours logged, and verification states.
- **Beneficiary Welfare Registry (`/admin/beneficiaries`):**
  - Beneficiary intake profiles, regional distribution, aid received, and follow-up tracking.
- **GIS Operations Map (`/admin/impact-map`):**
  - Add, adjust, or deactivate field coordinates, relief centers, and supply nodes.
- **Inbound Communication Inbox (`/admin/messages`):**
  - Review and triage inquiries submitted via the public contact portal.
- **System & NGO Settings (`/admin/settings`):**
  - Manage NGO organizational metadata, branding details, registration numbers (80G/12A/CSR), and localized currency symbols.

---

## 💻 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | [React 19](https://react.dev/) | Modern reactive component architecture |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundles |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side nested layouts and protected route guards |
| **GIS & Mapping** | [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) | Interactive spatial maps and custom map markers |
| **Styling & Theme** | Custom Neo-Brutalist CSS | High-contrast borders, hard drop shadows, and responsive tokens |
| **Iconography** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **Visual Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | High-performance canvas celebratory confetti animations |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (ES Modules) | Lightweight asynchronous JavaScript runtime |
| **REST API Server** | [Express 5](https://expressjs.com/) | API routes for newsletters, subscriptions, and administrative operations |
| **Auth & Security** | `bcryptjs`, `jsonwebtoken`, `google-auth-library` | Secure password hashing, token validation, and OAuth support |
| **Code Quality** | [oxlint](https://oxc.rs/) | High-speed Rust-based JavaScript / React linter |

---

## 🎨 Design Aesthetic: Neo-Brutalism

Impact Bridge embraces **Neo-Brutalism** to evoke transparency, honesty, and immediate civic urgency:
- **Bold 2px–3px Borders (`#000000`):** Sharp delineation across all cards, modals, buttons, and badges.
- **Hard Offset Drop Shadows:** Iconic `4px 4px 0px #000000` and `6px 6px 0px #000000` shadows with 0px blur radius.
- **Curated High-Contrast Palette:**
  - Forest Green (`#1B4332`) — Symbolizing sustainability, grassroots growth, and integrity.
  - Golden Amber (`#FFD166`) — Evoking action, community optimism, and urgency.
  - Off-White Canvas (`#F7F9F8` & `#FFFFFF`) — Ensuring optimal readability and content legibility.
  - Coral Red (`#E63946`) — Highlights urgent appeals and live alerts.
- **Tactile Interactions:** Buttons and interactive cards physically "press" into their shadow on active clicks (`transform: translate(2px, 2px)`).

---

## 📂 Project Architecture

```plaintext
IMPACT-BRIDGE/
├── backend/
│   ├── controllers/
│   │   └── newsletterController.js     # Subscription handler & validation
│   ├── data/
│   │   ├── about.json                  # Dynamic NGO organizational metadata
│   │   ├── subscribers.json            # Newsletter subscriber records
│   │   └── users.json                  # Administrative credentials
│   ├── models/
│   │   └── newsletterModel.js          # File-based persistence layer
│   ├── routes/
│   │   └── newsletterRoutes.js         # /api/newsletter route registry
│   └── server.js                       # Express application bootstrap (Port 5000)
├── src/
│   ├── assets/                         # Static graphics and icons
│   ├── components/
│   │   ├── auth/                       # Protected route wrappers
│   │   ├── charts/                     # Bar, Line, and Donut SVG visualizers
│   │   ├── common/                     # Card, Button, Badge, Tabs, Input, Modal
│   │   ├── layout/                     # Public and Admin Navbar, Footers, Sidebar
│   │   └── map/                        # Leaflet GIS maps, popups, and marker pins
│   ├── context/
│   │   ├── AppContext.jsx              # Global state (Programs, Donors, Beneficiaries)
│   │   └── AuthContext.jsx             # User sessions, roles, and authentication
│   ├── data/                           # Mock datasets and GIS coordinates
│   ├── layouts/
│   │   ├── AdminLayout.jsx             # Sidebar + Header container for admin portal
│   │   └── PublicLayout.jsx            # Public Navbar + Main + Footer container
│   ├── pages/
│   │   ├── admin/                      # Operations suite (Dashboard, Volunteers, etc.)
│   │   ├── public/                     # Public views & fallbacks
│   │   ├── About.jsx                   # Mission, values, and changemaker directory
│   │   ├── BeneficiaryPortal.jsx       # Citizen aid verification
│   │   ├── ChangemakerProfile.jsx      # Individual changemaker deep-dive
│   │   ├── Contact.jsx                 # Public inquiries & office locations
│   │   ├── Donation.jsx                # Multi-tier donation checkout
│   │   ├── Home.jsx                    # Landing page & impact counters
│   │   ├── ImpactMap.jsx               # Interactive Leaflet GIS portal
│   │   ├── PrivacyPolicy.jsx           # DPDP Act 2023 & Section 80G terms
│   │   ├── ProgramDetails.jsx          # Individual program dashboard
│   │   ├── Programs.jsx                # Filterable program directory
│   │   ├── TermsOfService.jsx          # Public charitable trust legal terms
│   │   └── Volunteer.jsx               # Volunteer recruitment & role finder
│   ├── utils/                          # Currency, date, and string formatting
│   ├── App.jsx                         # Application router & route mappings
│   ├── index.css                       # Global Neo-Brutalist CSS design system
│   └── main.jsx                        # React root entry point
├── package.json                        # Project dependencies and run scripts
├── vite.config.js                      # Vite bundler configuration
└── README.md                           # Master platform documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher installed on your machine
- **Package Manager**: `npm` (bundled with Node) or `yarn` / `pnpm`

### 2. Clone the Repository
```bash
git clone https://github.com/YAth-f4/IMPACT-BRIDGE.git
cd IMPACT-BRIDGE
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
To run both the frontend interface and backend API concurrently:

**Terminal 1: Start Backend Server (Express)**
```bash
npm run server
# Server initializes on http://localhost:5000
```

**Terminal 2: Start Frontend Development Server (Vite)**
```bash
npm run dev
# App available on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Boots the Vite development server with instantaneous HMR |
| `npm run server` | `node backend/server.js` | Launches the Express backend REST API on port 5000 |
| `npm run build` | `vite build` | Compiles optimized production bundle into `dist/` |
| `npm run preview` | `vite preview` | Locally serves and tests the production build |
| `npm run lint` | `oxlint` | Executes high-speed linter checks across all source code |

---

## 📡 API Endpoints

The Express server exposes lightweight REST endpoints:

### Newsletter Subscriptions
- **`POST /api/newsletter/subscribe`**
  - Request Body:
    ```json
    {
      "email": "supporter@example.org"
    }
    ```
  - Responses:
    - `201 Created`: New email stored in `backend/data/subscribers.json`.
    - `200 OK`: Duplicate email acknowledged gracefully without duplication.
    - `400 Bad Request`: Empty or invalid RFC 5322 email string.

### Health Check
- **`GET /api/health`**
  - Returns `{ "status": "ok", "timestamp": "..." }`

---

## ⚖️ Legal, Governance & Compliance

Impact Bridge incorporates statutory legal frameworks tailored for Indian and international non-profits:
- **DPDP Act, 2023 & IT Act, 2000 Compliance:** Strict user data privacy, voluntary consent protocols, and designated Grievance Redressal Officer disclosures.
- **Section 80G Tax Exemption Reporting:** Donor PAN numbers collected under strict audit procedures solely for annual Form 10BD/10BE filing with the Income Tax Department.
- **Zero Card Retention:** All payment integrations adhere strictly to PCI-DSS standards; zero financial credentials or CVV numbers are persisted locally.
- **Safeguarding Standards:** Formal Volunteer Code of Conduct enforcing child protection under the POCSO Act and zero tolerance for harassment.

---

## 🤝 Contributing

Contributions make the open-source social impact community thriving and impactful. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewInitiative`)
3. Commit your Changes (`git commit -m 'feat: Add NewInitiative module'`)
4. Push to the Branch (`git push origin feature/NewInitiative`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for grassroots changemakers and community builders worldwide.</sub>
</div>
