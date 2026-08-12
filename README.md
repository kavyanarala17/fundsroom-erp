# FundsRoom ERP

A full-stack Enterprise Resource Planning (ERP) system developed as a case study for FundsRoom.

The application provides a centralized platform to manage customers, products, inventory, delivery challans, payments, and business analytics through a dashboard.

---

## 🚀 Features

### 🔐 Authentication
- Admin login
- JWT-based authentication
- Protected application routes
- Login error handling
- Secure token storage using browser local storage

### 👥 Customer Management
- Add customers
- View customer details
- Edit customer information
- Search customers
- Clear search
- Activate / deactivate customers
- Store business and contact information
- Customer summary with business-related records

### 📦 Product Management
- Add products
- Product SKU management
- Product categories
- Unit price management
- Stock quantity tracking
- Minimum stock alert configuration
- Warehouse information

### 📊 Inventory Management
- Current stock monitoring
- Low-stock product alerts
- Minimum stock threshold
- Warehouse information
- Automatic stock updates when challans are confirmed
- Inventory dashboard statistics

### 🧾 Challan Management
- Create delivery challans
- Select customers
- Add products and quantities
- Draft challans
- Confirm challans
- Cancel challans
- View challan details
- Automatic stock validation
- Prevent adding quantities greater than available stock
- Automatic inventory deduction after confirmation

### 💳 Payment Management
- Record customer payments
- Payments allowed only for confirmed challans
- Payment methods such as Cash and UPI
- Payment status tracking
- Payment history
- Automatic dashboard payment totals

### 📈 Dashboard
The dashboard provides an overview of:

- Total Customers
- Total Products
- Total Challans
- Total Payments
- Total Revenue
- Low-stock product count
- Quick actions
- Inventory alerts

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- REST APIs
- MySQL
- mysql2
- bcrypt

### Development Tools
- Git
- GitHub
- VS Code
- MySQL Workbench
- Postman

---

## 🏗️ Project Architecture

```text
fundsroom-erp/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.ts
│
└── package.json

Application Flow
User
  │
  ▼
Login
  │
  ▼
JWT Authentication
  │
  ▼
Dashboard
  │
  ├── Customers
  │
  ├── Products
  │
  ├── Inventory
  │
  ├── Challans
  │      │
  │      ├── Create Draft
  │      ├── Add Products
  │      ├── Validate Stock
  │      ├── Confirm
  │      └── Update Inventory
  │
  └── Payments
         │
         └── Record Payment
🧠 Business Logic
Stock Validation

Before adding a product to a challan, the system checks the available stock.

For example:

Available Stock = 5
Requested Quantity = 6

Result:
Insufficient stock

The system prevents the transaction instead of allowing negative inventory.

Challan Confirmation

When a challan is confirmed:

Challan
   ↓
Validate Items
   ↓
Check Stock
   ↓
Confirm Challan
   ↓
Deduct Inventory
Payment Validation

Payments can only be recorded for confirmed challans.

Draft Challan
     ↓
Cannot Record Payment

Confirmed Challan
     ↓
Payment Allowed
🔌 REST API Structure

The backend follows a REST API architecture.

Main API modules include:

/auth
/customers
/products
/inventory
/challans
/payments
/dashboard
/stock

Example API operations:

POST   /auth/login

GET    /customers
POST   /customers
PUT    /customers/:id

GET    /products
POST   /products

GET    /inventory

GET    /challans
POST   /challans
POST   /challans/:id/items
POST   /challans/:id/confirm
POST   /challans/:id/cancel

GET    /payments
POST   /payments

GET    /dashboard
🗄️ Database

The application uses MySQL as the relational database.

The system manages data related to:

Users
Customers
Products
Warehouses
Stock
Challans
Challan Items
Payments

The backend separates database operations through repository and service layers.

⚙️ Installation
1. Clone the repository
git clone https://github.com/kavyanarala17/fundsroom-erp.git
cd fundsroom-erp
2. Install Backend Dependencies
cd backend
npm install
3. Configure Backend Environment Variables

Create:

backend/.env

Example:

PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fundsroom_erp

JWT_SECRET=your_jwt_secret

Do not commit the actual .env file to GitHub.

4. Start Backend

From the backend directory:

npm run dev

The backend runs on:

http://localhost:5000
5. Install Frontend Dependencies

Open another terminal:

cd frontend
npm install
6. Start Frontend
npm run dev

The frontend will be available at the Vite development URL, typically:

http://localhost:5173
🔑 Authentication

The login page sends credentials to:

POST /auth/login

After successful authentication, the backend returns a JWT token.

The frontend stores the authenticated session information and uses the token for protected API requests.

🛡️ Security

The project includes:

JWT authentication
Password hashing
Protected routes
Role-based middleware
Request validation
Environment variables for sensitive configuration
.gitignore protection for .env files

Sensitive credentials are intentionally excluded from the repository.

🧪 Testing

The application was tested through the complete business workflow.

Customer Testing
Create customer
Search customer
Edit customer
Change customer status
View customer information
Product Testing
Add products
Verify SKU
Verify stock
Verify minimum alert quantity
Challan Testing
Create challan
Add products
Test insufficient stock
Confirm challan
Cancel challan
Verify inventory changes
Payment Testing
Record payment for confirmed challan
Verify payment history
Verify payment totals
Verify dashboard totals
Dashboard Testing

Verified that dashboard values update based on the underlying business transactions.

📊 Example Business Scenario
Customer
   ↓
Create Challan
   ↓
Add Product
   ↓
Check Available Stock
   ↓
Confirm Challan
   ↓
Inventory Reduced
   ↓
Record Payment
   ↓
Dashboard Updated

This ensures that customer transactions, inventory, challans, payments, and dashboard analytics remain connected.

📌 Current Status

The FundsRoom ERP case study implementation is complete.

Implemented modules:

✅ Authentication
✅ Dashboard
✅ Customer Management
✅ Product Management
✅ Inventory Management
✅ Challan Management
✅ Payment Management
✅ Stock Validation
✅ JWT Authentication
✅ REST APIs
✅ MySQL Database Integration
✅ Input Validation
✅ Error Handling
✅ GitHub Repository
👩‍💻 Author

Kavya Narala

Information Science and Engineering

GitHub:
https://github.com/kavyanarala17

📄 Case Study

This project was developed as part of the FundsRoom Full Stack Developer case study.

The implementation focuses on:

Clean architecture
REST API design
Database-driven business logic
Authentication
Inventory consistency
Transaction workflows
Frontend-backend integration
Practical ERP functionality

### Where to put it

At the **root** of your project:

```text
fundsroom-erp/
│
├── README.md        ← PUT IT HERE
├── backend/
├── frontend/
└── package.json

Then run:

git add README.md
git commit -m "Add project documentation"
git push
