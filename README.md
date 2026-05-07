# Re-Mmogo — Motshelo Management System

A full-stack web application for managing Motshelo (community savings) groups in Botswana. Built as part of the INFS 202 Group Project at BIUST.

---

## Project Description

Re-Mmogo allows savings groups to digitally manage their operations including member enrollment, monthly contributions, loan disbursements, signatory approvals, and year-end financial reports.

### Key Features
- Register and manage a motshelo group
- Enroll members and assign signatories
- Record and track monthly contributions (P1,000/member)
- Request and manage loans with 20% monthly interest
- Two-signatory approval system for loans and payments
- Year-end reports showing payouts, interest, and loan summaries

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Routing | React Router v6 |
| State Management | React Context API |
| Styling | Custom CSS (Flexbox/Grid), CSS Variables |
| HTTP Client | Fetch API |
| Icons/Fonts | Google Fonts (DM Sans, DM Mono) |

---

## Project Structure

```
re-mmogo/
├── public/
├── src/
│   ├── api/               # API call functions (fetch wrappers)
│   ├── assets/            # Images and static assets
│   ├── components/
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   └── Topbar.jsx     # Top navigation bar
│   ├── context/
│   │   └── AppContext.jsx # Global state (user, group, auth)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Group.jsx
│   │   ├── Members.jsx
│   │   ├── Contributions.jsx
│   │   ├── Loans.jsx
│   │   ├── Approvals.jsx
│   │   └── Reports.jsx
│   ├── App.jsx            # Routes and layout
│   ├── App.css            # Global styles and design tokens
│   └── main.jsx           # Entry point
├── .env                   # Environment variables (not committed)
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/magudufrancisco-cmd/re-mmogo.git
cd re-mmogo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the backend API |

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register-group` | Register Group | Public |
| `/` | Dashboard | Protected |
| `/group` | Group Settings | Protected |
| `/members` | Members | Protected |
| `/contributions` | Contributions | Protected |
| `/loans` | Loans | Protected |
| `/approvals` | Approvals | Protected (Signatories) |
| `/reports` | Year-End Reports | Protected |

---

## Business Rules Implemented

- Only members can borrow from the motshelo
- Loans charged at 20% on balance per month
- Each member must raise P5,000 interest by year end
- Each member contributes P1,000 per month
- Exactly 2 signatories per group
- Loans require approval from both signatories before disbursement
- Loan payments require signatory approval before reflecting on balance
- Proof of payment can be attached to contributions and loan payments

---

## Live URL

https://elegant-fairy-52764a.netlify.app

---

## Frontend Repository

https://github.com/magudufrancisco-cmd/re-mmogo 

---

## Team

| Name | Role |
|------|------|
| Francisco | Project Lead / Frontend |
| Phenyo | Frontend Developer |
| Fransciso | Frontend Developer |
| Bobo| Database / Backend |
| Letso | Database / Backend |
| Khanyisile | Figma |

**Lecturer:** Dr. Hlomani
**Module:** INFS 202 — Full Stack Web Development
**Institution:** Botswana International University of Science and Technology (BIUST)

---

## Academic Integrity

All external libraries used are cited. This project was developed as a group assignment for INFS 202 at BIUST.