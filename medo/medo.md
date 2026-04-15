# Medo


## Smithory --> https://www.appsmith.com/template/inventory-management-dashboard
Please design and develop a comprehensive multi-warehouse inventory management application named "Smithory". The core objective is to allow businesses to efficiently track products, manage suppliers, and oversee stock across multiple locations.  Follow these detailed specifications for the build:  **1. Core Application Identity & Framework** * **Application Name:** "Smithory". This title must be left-aligned and consistently displayed at the top of every page. 
* **Technology Stack:** Utilize a single database backend with multiple frontend views/panels. 
* **Accessibility & Responsiveness:** All views must be fully responsive and adhere to accessibility best practices (WCAG guidelines).  
**2. Visual & User Interface Design** * **Color Palette:** Primary color scheme based on Light Blue. Design must be adaptable for a Light Theme and a Dark Theme. 
* **Typography:** Primary font families: Inter, Helvetica, or Century Schoolbook. The application must include a user-controlled font size selector with three presets: Small, Medium, and Large. * **Layout & Navigation:** * Implement a persistent collapsible "hamburger" menu on the left-hand side of the screen for primary navigation between views. * The main content area will change dynamically based on the selected view from the menu.  
**3. User Authentication System** * A dedicated login screen with fields for Username and Password. * Functionality for new users to Sign Up for an account. * Secure session management post-login.  
**4. Core Functional Views & Modules** Design the following key views, accessible via the main navigation menu. Each view should have a clean, data-focused interface suitable for business operations.  
* **Dashboard View:** * Provide an overview of key inventory metrics (e.g., total stock value, low-stock alerts, recent activities) aggregated across all warehouses. 
* **Products Management View:** * Create, read, update, and delete (CRUD) product records. * For each product, track: SKU, Name, Description, Category, Cost Price, Selling Price. * Set and visualize a **Reorder Point** per product. The system should highlight products where current stock is at or below this point. 
* **Multi-Warehouse Inventory View:** * Display a master list of all warehouses/locations. * For each warehouse, show detailed stock levels for all products housed there. * Visual indicators for stock status: "In Stock", "Low Stock" (at/below reorder point), "Out of Stock". * **Suppliers Management View:** * CRUD operations for supplier information (Company Name, Contact, Address, Terms). * Link suppliers to the specific products they supply. 
* **Purchase Orders (PO) Management View:** * Generate new Purchase Orders, ideally with semi-automated creation triggered by low-stock alerts. * Each PO should be associated with a specific supplier and list products, quantities, and expected costs. * Track PO status: Draft, Sent, Partially Received, Completed. 
* **Stock Receiving View:** * Record the receipt of goods against an open Purchase Order. * Update the inventory count for the specified product in the designated warehouse upon confirmation of receipt. 
* **Stock Transfer View:** * Initiate and track the movement of stock quantities of a specific product from one warehouse to another. * Record transfer date, quantities, source warehouse, and destination warehouse.  
**5. Deliverables** Please provide a complete development plan including: * A proposed database schema (list of core tables and their relationships). * Wireframes or mockups for the key views (Dashboard, Products, Inventory, Purchase Orders), illustrating the layout with the left-aligned title, hamburger menu, and responsive design. * A detailed technical specification outlining the frontend components, backend API endpoints for each module, and state management approach for themes/font size.

## Write up
## Inspiration
I had a friend who wanted to get experiment with starting a retail clothing business.  He was not ready for how it would work yet but wanted to simulate some of the operational challenges before getting into it.  This is why I built Smithory. 
## What it does
Smithory is an easy to use Inventory Management app that enables businesses to efficiently track products, manage suppliers, and oversee stock across multiple locations
## How we built it
I leveraged the power of Medo in building the application.  I first wrote down the features I wanted in the application in detail in a requirements document.  This included key features, font design, color scheme, light and dark mode and accessibility.  I then used the medo prompt optimization feature which helped to refine my requirements. I then  I then refined some of the UI elements based on what was created using the edit function.  I was very impressed with the ability to get majority of the features correct when listed in the requirements.md file.  It made building a breeze.

## Challenges we ran into
- There were no major challenges.  I had a clear idea of what I wanted to build and used medo to refine my prompt which made the work very easy.

## What's next for Smithory
Looking forward to seeing how it is embraced in the community.  In terms of features to add
- ability to use multi-currency
- multi-lingual support
- reverse logistics capabilibites
- ability to connect with warehouse systems

@Medo_CodeFree built Smithory (https://app-ayle1es4eadd.appmedo.com) an inventory app that allows businesses to efficiently track products, manage suppliers, and oversee stock across multiple locations #BuiltWithMeDo

# Unbiased
App to help with tackling cognitive biases

Resources
--> https://thedecisionlab.com/biases
--> https://play.google.com/store/apps/details?id=cognitivebiases.thinking.psychology
--> https://play.google.com/store/apps/details?id=hr.anix.unbiased


# GeoMaster
