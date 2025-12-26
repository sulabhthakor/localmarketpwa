LocalMarket PWA – Product Requirements Document
Project Overview: LocalMarket is a full-stack, multilingual Progressive Web App (PWA) marketplace built with Next.js, Tailwind CSS, and ShadCN UI components. It runs on web and mobile (installable to the homescreen)[1]. The app includes user-facing pages (home, product listings/details, cart, checkout, login/registration, order tracking) and dashboards for businesses and admins. Below is a comprehensive spec with prompts, API definitions, database schema, and instructions for AI code generation.
Frontend UI (PWA)
•	PWA Setup: Include a manifest.json (with app name, icons, start_url, theme color) and register a service worker for offline caching and installability[1]. For example, in Next.js root layout, add <link rel="manifest" href="/manifest.json" /> and register a PWA service worker component[1].
•	Responsive Design: Use Tailwind CSS with mobile-first breakpoints (e.g. sm, md, lg) to ensure layouts adapt from mobile to desktop[2]. For example, design components with default (mobile) styling, adding md:… or lg:… prefixes for larger screens.
•	Prompt: “Generate a React/Tailwind layout that is mobile-responsive. Use ShadCN UI components and Tailwind utility classes so that the layout is single-column on small screens and a grid or flex layout on medium/large screens.”
•	ShadCN/UI Library: Use the ShadCN component library for consistent UI elements. Install components via CLI (e.g. pnpm dlx shadcn@latest add button) and import them into pages. For example:

 	import { Button } from "@/components/ui/button";
export default function Home() {
  return <Button>Click me</Button>;
}
 	Cite: ShadCN/UI is designed for Next.js with Tailwind[3].
•	Prompt: “Use ShadCN components (e.g. Button, Card, DataTable) in all pages. For instance, generate a ShadCN <Button> in the home page header.”
Frontend UI: Home Page
•	Content: Hero/banner, search bar, featured categories or promotions, language selector, and navigation links. Use ShadCN Hero, Carousel or custom components for visual highlights.
•	Layout: Responsive layout with a top navbar (logo, nav links, language dropdown) and footer. Hero image at top, followed by product categories or featured items in cards.
•	Prompt: “Generate a Next.js page (/pages/index.tsx) for the Home screen. Include a Tailwind-styled navbar (logo, multi-language dropdown, links), a hero section with a call-to-action, and a responsive grid of product categories using ShadCN Card components.”
Frontend UI: Product Listing Page
•	Route: /products or /categories/[categoryId].
•	Features: Display a filterable grid or list of product cards. Include category filters, search input, and pagination/infinite-scroll. Each product card shows image, name, price, and a “View Details” link. Use ShadCN DataTable or grid of Card.
•	Prompt: “Generate a Next.js page for product listing at /pages/products/index.tsx. Use Tailwind and ShadCN to show a list of products (image, title, price) fetched from the products API. Include a sidebar or top bar with category filters and a search box.”
Frontend UI: Product Detail Page
•	Route: /products/[id] (dynamic route).
•	Content: Large product images (use a ShadCN Carousel for multiple images), title, description, price, quantity selector, and “Add to Cart” button. Display business (seller) info and category.
•	Prompt: “Generate a Next.js page for product details at /pages/products/[id].tsx. It should fetch a single product by ID, display images carousel, name, price, description, and an ‘Add to Cart’ button. Use Tailwind and ShadCN components (e.g., Image, Button).”
Frontend UI: Cart Page
•	Route: /cart.
•	Content: List of cart items with product thumbnail, name, price, quantity controls, and subtotal. Show total amount. Include “Remove” buttons and “Proceed to Checkout” button.
•	Prompt: “Generate a Next.js page for /pages/cart.tsx. It should display the user’s shopping cart: use ShadCN tables or list items for each cart entry, with quantity adjustment controls. Show order total and a Checkout button.”
Frontend UI: Checkout Page
•	Route: /checkout.
•	Features: Collect shipping address and payment method. Display order summary. Support Razorpay (for INR) and Stripe (for other currencies) payment buttons. After payment, redirect to order confirmation.
•	Prompt: “Generate a Next.js page for /pages/checkout.tsx. Include a form to enter shipping details and choose payment method. Integrate Razorpay and Stripe checkout: e.g., add a Razorpay Checkout button script and a Stripe CheckoutSession. Use ShadCN form and input components.”
Frontend UI: User Login/Registration
•	Routes: /login, /register (and possibly /business/register).
•	Features: Forms for email/password login and registration. On registration, allow choosing user or business account. After business sign-up, redirect to payment page for registration fee. On login, authenticate and set HttpOnly JWT cookie.
•	Prompt: “Generate Next.js pages for /pages/login.tsx and /pages/register.tsx. Each form should POST to auth APIs. Use ShadCN Input and Button. After successful login or registration, redirect appropriately (e.g. business users to dashboard).”
Frontend UI: Business Dashboard
•	Route: /business/dashboard.
•	Content: Protected page (accessible only to authenticated business users). Show business analytics (e.g., sales charts, recent orders) using ShadCN Chart components, and a table of the business’s products and orders. Include buttons to add/edit products.
•	Prompt: “Generate a Next.js dashboard page for business users at /pages/business/dashboard.tsx. It should query business data (e.g. orders, sales) and display charts and data tables. Use ShadCN Sidebar, Chart, and DataTable components, styled with Tailwind. Ensure this page checks the user role and fetches data via business APIs.”
Frontend UI: Order Tracking Page
•	Route: /orders or /orders/[orderId].
•	Features: Allow buyers to track their orders in real-time. Display current status (e.g. “Pending”, “Dispatched”, “Delivered”) with a progress bar or timeline component. Use WebSockets (Socket.IO) on the client to listen for delivery updates from the server.
•	Prompt: “Generate a Next.js page for /pages/orders/[id].tsx. It should connect to the backend via WebSocket and display real-time status updates for the order. Use a ShadCN Progress or Timeline component to show status. Update the UI whenever a new delivery status event arrives.”
Frontend UI: Admin Panel Screens
•	Route: under /admin, e.g. /admin/dashboard, /admin/users, etc.
•	Features: Protected admin-only pages. Provide a sidebar navigation (using ShadCN Sidebar) with links to manage Users, Businesses, Orders, Payments, Subscriptions, and Translations. Each management page should show a table (ShadCN DataTable or Table component) listing relevant records with action buttons (suspend user, suspend business, refund order, etc.). For translations, show languages and keys/values editable inline.
•	Prompt: “Generate Next.js admin pages under /pages/admin/.... For example, /pages/admin/users.tsx should fetch and display all users in a table with buttons to suspend or delete. Use ShadCN UI components and Tailwind for layout. Ensure these pages check admin role and use admin APIs.”
Backend API (Next.js or Express)
Architecture: Define all routes as Next.js API routes (Pages or App Router) or as Express endpoints (describe both). Use JWT for auth (set in HttpOnly cookies) and middleware for role protection[4][5].
•	Authentication:
•	POST /api/auth/register – Create user or business account. Hash passwords with bcrypt. For business registration, include subscription selection (and charge registration fee).
•	POST /api/auth/login – Verify credentials, return JWT (set as secure HttpOnly cookie, with SameSite=Strict)[4].
•	POST /api/auth/logout – Clear authentication cookie.
•	GET /api/auth/me – Return current user info from JWT.
•	Role-Based Access: Implement middleware to parse JWT and enforce roles: admin routes only for role=admin, business routes only for role=business, buyer routes for role=buyer. Use role checks to protect endpoints[5].
•	Business Registration & Profile:
•	POST /api/business/register – (if separate) create a business record linked to the user, then redirect to payment for fees.
•	GET /api/businesses/:id – Get business details (admin or owner).
•	PUT /api/businesses/:id – Update business profile (owner only).
•	Product CRUD: (Protected to business owners)
•	GET /api/products – List products (optionally filter by business or category).
•	GET /api/products/:id – Get product details.
•	POST /api/products – Create new product (business only).
•	PUT /api/products/:id – Update product (owner only).
•	DELETE /api/products/:id – Delete product (owner only).
•	Category APIs: (Admin or system)
•	GET /api/categories – List categories.
•	POST /api/categories – Create category (admin).
•	PUT /api/categories/:id, DELETE /api/categories/:id.
•	Cart and Orders:
•	GET /api/cart – Get current user’s cart.
•	POST /api/cart – Add item to cart or update cart.
•	PUT /api/cart/:itemId – Update item quantity.
•	DELETE /api/cart/:itemId – Remove item.
•	POST /api/orders – Create an order from cart (charge payment). Store order with status "Pending".
•	GET /api/orders – Get orders for current user.
•	GET /api/orders/:id – Get order details (restrict to owner or admin).
•	PUT /api/orders/:id – Update order (e.g. status updates by business/driver).
•	Delivery Status (Realtime): Use Socket.IO or WebSocket for order updates. For example, when order status changes in the database or via API, emit an event to clients subscribed to that order ID.
•	Prompt: “Generate a Next.js API route or Node server that initializes a Socket.IO server for real-time order updates. When /api/orders/:id status is updated, emit a Socket.IO event orderStatusUpdated with the new status to the client room for that order.”
Cite: Use WebSockets for live updates (persistent connection to push changes)[6].
•	Payments (Razorpay and Stripe):
•	Razorpay (INR payments): Use Razorpay Node SDK.
o	POST /api/payments/razorpay/create-order – Create a Razorpay Order (pass amount, currency INR). Return order ID to client.
o	POST /api/payments/razorpay/verify – Verify payment signature on payment completion.
o	Webhooks: POST /api/webhooks/razorpay – Endpoint to receive and verify Razorpay webhooks (e.g. payment.captured, subscription events). Verify signature and update order/payment status. Note: Consult Razorpay docs for webhook events (e.g. subscription.charged, payment.captured)[7].
o	Prompt: “Generate a Next.js API route /api/payments/razorpay/create-order that uses the Razorpay SDK to create a payment order. Also generate a webhook handler /api/webhooks/razorpay that verifies Razorpay signatures and handles events like subscription.charge.completed.”
•	Stripe (International payments): Use Stripe SDK.
o	POST /api/payments/stripe/create-session – Create Stripe Checkout Session for one-time payment or subscription.
o	Webhooks: POST /api/webhooks/stripe – Handle Stripe events. For example, process checkout.session.completed for one-time payments and invoice.payment_succeeded for subscription payments[8]. Verify webhook signature using Stripe’s secret.
o	Prompt: “Generate a Next.js API route /api/webhooks/stripe that reads raw request body, verifies the Stripe signature (stripe.webhooks.constructEvent), and handles events like checkout.session.completed and invoice.payment_succeeded to update order/subscription status[8][9].”
•	Subscription Management:
•	For Razorpay, use their subscription APIs (create plan, subscribe customer) and handle via webhooks[7].
•	For Stripe, use Stripe Subscriptions. Provide an endpoint for business to subscribe to a plan. Use webhooks to track invoice.payment_succeeded or customer.subscription.deleted[8].
•	Admin Actions (Protected Routes):
•	PUT /api/admin/suspendUser – Suspend or reactivate a buyer.
•	PUT /api/admin/suspendBusiness – Suspend/reactivate a business account.
•	POST /api/admin/refundOrder – Refund an order (admin).
•	GET /api/admin/users – List all users.
•	GET /api/admin/businesses – List businesses.
•	GET /api/admin/orders, GET /api/admin/payments, GET /api/admin/subscriptions.
•	GET/PUT /api/admin/translations – Manage language keys and values.
Prompt: “Generate Next.js API routes under /api/admin/... to support admin functions. Include routes to suspend accounts, refund orders, and CRUD operations on languages/translations. Ensure each route checks req.cookies.jwt and user role (admin) before proceeding[5].”
Database Schema (SQL)
Design a normalized relational schema (e.g. for PostgreSQL) as follows[10][11]:
-- Users (buyers) table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('buyer','business_owner')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table (separate admin accounts)
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  owner_id INT NOT NULL REFERENCES users(id),  -- business owner (user)
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  subscription_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (for product categories)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_category_id INT REFERENCES categories(id), -- allow subcategories
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  business_id INT NOT NULL REFERENCES businesses(id),
  category_id INT REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts table (one cart per user)
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Cart items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES carts(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),    -- buyer
  business_id INT NOT NULL REFERENCES businesses(id),
  status VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items (each item in an order)[11]
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL  -- price at time of order
);

-- Payments table (tracks payment per order)[11]
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(50) NOT NULL,           -- 'razorpay' or 'stripe'
  provider_id VARCHAR(100),              -- payment gateway reference ID
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table (for business plans)
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  business_id INT NOT NULL REFERENCES businesses(id),
  plan VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE
);

-- Delivery updates (status history for orders)
CREATE TABLE delivery_updates (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  status VARCHAR(50) NOT NULL,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  location VARCHAR(255)
);

-- Languages table (supported locales)
CREATE TABLE languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,  -- e.g. 'en', 'fr'
  name VARCHAR(100) NOT NULL
);

-- Translations table (key-value pairs per language)
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  language_id INT NOT NULL REFERENCES languages(id),
  value TEXT NOT NULL
);
Notes: This schema ensures normalized design and data integrity (e.g. FK constraints)[10]. For example, order_items links each product with its order, and payments links to orders[11].
Admin Panel (UI & API)
•	Admin Dashboard UI: A Next.js admin dashboard page showing high-level stats (total users, businesses, orders). Provide navigation to management pages.
Prompt: “Generate /pages/admin/dashboard.tsx with summary cards (ShadCN Card) for totals and a sidebar menu. Restrict access to admin role.”
•	Manage Users: Page listing all users (/pages/admin/users.tsx) with actions to suspend/reactivate.
Prompt: “Generate /pages/admin/users.tsx that calls /api/admin/users, displays a table of users, and includes a ‘Suspend’ button for each row.”
•	Manage Businesses: Similar UI listing businesses (/pages/admin/businesses.tsx).
•	Manage Orders/Payments/Subscriptions: Pages /pages/admin/orders.tsx, /payments.tsx, /subscriptions.tsx showing corresponding tables with relevant fields (order ID, user, status, amount, date). Include action buttons (e.g., “Refund” in orders).
•	Manage Translations:
•	UI: /pages/admin/translations.tsx – allow adding/editing languages and translation keys. Include form to add a language, and table to edit translation values.
Prompt: “Generate /pages/admin/translations.tsx to manage languages and translations. Display current translation keys/values in a table with inline edit, and a form to add new languages/keys.”
•	API: Provide endpoints under /api/admin/translations to fetch/update translations and /api/admin/languages for languages.
•	Admin Routes (Backend): As listed above (suspend users/businesses, refund order). All admin routes should check the JWT cookie for an admin role. For example, /api/admin/suspendUser should verify the requester is an admin before updating the users table.
Payments and Webhooks
•	Razorpay Integration:
•	Use Razorpay Node SDK to create payment orders and subscriptions. Store API keys in environment variables.
•	Handle one-time payments (e.g. registration fee) by creating a Razorpay order and returning razorpay_order_id to client. After payment, verify via signature on backend.
•	Subscriptions: When a business subscribes, create a Razorpay subscription. Listen to webhooks like subscription.charged to update our subscriptions table.
•	Prompt: “Generate an Express/Next.js route /api/payments/razorpay/subscribe that creates a Razorpay subscription for a business, and a webhook handler /api/webhooks/razorpay that verifies payload and updates subscription status.”
•	Stripe Integration:
•	Use Stripe SDK for one-time and recurring payments. Create Checkout Sessions for purchases/subscriptions.
•	Webhooks: Implement /api/webhooks/stripe as shown in examples[8]. Verify the Stripe signature and handle events: checkout.session.completed (finalize order) and invoice.payment_succeeded (subscription paid)[8].
•	Prompt: “Generate API routes for Stripe: /api/payments/stripe/create-session to start a checkout, and /api/webhooks/stripe to process events. Use stripe.webhooks.constructEvent to verify the signature[8].”
Webhooks are essential for payment flows – set them up as protected endpoints (disable body parsing) and configure signing secrets[9].
Multilingual Support
•	i18n Config: Use Next.js built-in internationalized routing[12] by setting i18n.locales = ['en','fr',...] in next.config.js. Alternatively, use next-i18next for convenience.
•	Translation Storage: Store all text keys and translations in the languages and translations tables. On page load, the frontend fetches translation strings for the user’s locale (e.g. via /api/translations?lang=en). Use the i18next-http-backend plugin or similar to load these strings[13].
•	Usage: Wrap UI text with t('key') calls (React-i18next). Load locale from URL or user preference. Provide a language switcher that sets a cookie or updates Next.js locale.
•	Prompt: “Generate a language-switch component that lists available languages (from /api/languages) and reloads the page in the selected language. Configure i18next to fetch translations from /api/translations?lang={{lng}} using i18next-http-backend[13].”
Example:

// i18n setup (e.g. next-i18next.config.js)
module.exports = {
  i18n: { locales: ['en','fr','es'], defaultLocale: 'en' },
  react: { useSuspense: false }
};
// Load translations from our API or database via i18next backend...
Supporting internationalization ensures wider reach[14][12].
Security
•	Authentication: Use bcrypt to hash passwords before saving. After login, issue a short-lived JWT and store it in an HttpOnly, Secure cookie (with SameSite=Strict)[4]. This prevents token theft via XSS[4].
•	Authorization: Implement role-based access control (RBAC) for admin, business, and buyer roles. E.g., only admin can access /api/admin/*. Only the owner can modify their business/products. Use middleware to enforce these roles[5].
•	CSRF Protection: For state-changing routes (POST/PUT/DELETE), use CSRF tokens or rely on SameSite cookies. Since JWT is in a cookie, ensure SameSite and consider double-submit tokens. All forms (even in Next.js) should include an anti-CSRF token. (Alternatively, for API routes with fetch, set credentials: 'include' and ensure CSRF token header validation.)
•	Input Validation: Validate and sanitize all inputs (e.g. using JOI or Yup) on the server. Use parameterized queries/ORM to prevent SQL injection. Enforce field lengths and formats. Reject unexpected data. This follows OWASP recommendations (e.g. bind inputs, use tokens)[4].
•	Secure Headers: Serve the app over HTTPS. Use HTTP headers like Content-Security-Policy, X-Frame-Options, and X-XSS-Protection (Helmet can help).
•	Role Security: Admin and business pages should check the user’s role in server-side rendering or API. For example, an admin page’s getServerSideProps should verify req.cookies.jwt and role==='admin', else redirect or 403.
Each section above corresponds to a part of the app. The prompts (“Generate …”) guide the AI in code generation. All API routes, pages, and SQL definitions are described so that an AI coder can produce the complete codebase. Each feature and security measure is referenced to best practices or documentation[1][4][5][10] to ensure robustness and clarity.
Sources: References to official docs and tutorials have been included to justify design choices (e.g., Next.js i18n support[12], secure cookie usage[4], PWA setup[1], ShadCN usage[3], real-time WebSockets[6], database normalization[10], and payment/webhook examples[7][8][9]). These ensure that the PRD follows current best practices.
________________________________________
[1]  Progressive Web App (PWA) Setup Guide for Next.js 15 — Complete Step-by-Step Walkthrough - DEV Community
https://dev.to/rakibcloud/progressive-web-app-pwa-setup-guide-for-nextjs-15-complete-step-by-step-walkthrough-2b85
[2] Responsive Design - Tailwind CSS
https://v2.tailwindcss.com/docs/responsive-design
[3] Next.js - shadcn/ui
https://ui.shadcn.com/docs/installation/next
[4] Seamless Authentication solution with cookies and JWT in Next.js and Express Backend. | by Mohdjamikhann | Medium
https://medium.com/@mohdjamikhann/seamless-authentication-solution-with-cookies-and-jwt-in-next-js-and-express-backend-f8c0bc9d079c
[5] [6] Real-Time Order Tracking System Architecture | by Rajesh Chaudhari | Medium
https://medium.com/@myjob.rajesh/real-time-order-tracking-system-architecture-70a98e660906
[7] How to Integrate RazorPay in Next.js 14/15 with Easy Steps. - DEV Community
https://dev.to/hanuchaudhary/how-to-integrate-razorpay-in-nextjs-1415-with-easy-steps-fl7
[8] [9] Stripe Checkout and Webhook in a Next.js 15 (2025) | by John Gragson | Medium
https://medium.com/@gragson.john/stripe-checkout-and-webhook-in-a-next-js-15-2025-925d7529855e
[10] Database Project: E-commerce Order Management System with SQL | by Karlos | Medium
https://medium.com/@karlos-b/database-project-e-commerce-order-management-system-with-sql-d986b044d92
[11] Ecommerce Database Design: ER Diagram for Online Shopping | Redgate
https://www.red-gate.com/blog/er-diagram-for-online-shop
[12] Guides: Internationalization | Next.js
https://nextjs.org/docs/pages/guides/internationalization
[13] Add or Load Translations | i18next documentation
https://www.i18next.com/how-to/add-or-load-translations
[14] Implementing Multilingual Support in Next.js with next-i18next - DEV Community
https://dev.to/itselftools/implementing-multilingual-support-in-nextjs-with-next-i18next-3chi
