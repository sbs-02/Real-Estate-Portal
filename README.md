# Real Estate Buyer Portal

A premium, modern real estate portal built with Typescript + React with Vite for frontend, Node.js + Express.js for backend, MongoDB for database.

## How to Run the App

### Prerequisites

- Node.js (v18+)
  Check if installed:
  - node --version
  - npm --version
- MongoDB (Atlas)
  Check if installed:
  - mongosh --version

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `backend` directory (refer to `.env` for required keys):
   ```env
   PORT = 8080
   MONGO_URI = your_mongodb_uri
   JWT_ACCESS_SECRET = your_access_secret
   JWT_REFRESH_SECRET = your_refresh_secret
   CORS_ORIGIN = http://localhost:5173
   ```
4. Seed Properties (Optional):
   ```bash
   npm run seed:properties
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## Example Flows

### 1. User Onboarding (Sign Up → Login)

- **Sign Up**: Navigate to `/register`, enter your details. The app uses a luxury-themed split screen for authentication.
- **Login**: Enter your credentials at `/login`. Upon success, you'll be redirected to the Dashboard.

### 2. Property Discovery

- **Search**: Use the top search bar on the Dashboard to find properties by title, city, or description.
- **Advanced Filtering**: Click the Filter icon to open the panel:
  - **City**: Filter properties by specific locations.
  - **Price Range**: Set minimum and maximum price constraints.
  - **Property Type**: Choose between Apartments, Houses, Villas, etc.

### 3. Favourites Management

- **Add to Favourites**: On any property card, click the heart icon. The heart will fill to indicate it's saved.
- **View Favourites**: Navigate to the "Favourites" page via the Navbar to see all your saved properties.
- **Remove**: Clicking the heart icon again on the Favourites page or Dashboard will remove the property from your collection.

---

## API Documentation

The project includes an interactive API documentation system powered by **Swagger (OpenAPI 3.0)**.

### Accessing the Docs

- **Production Environment:** Visit the live deployed docs at [https://real-estate-portal-backend.vercel.app/api](https://real-estate-portal-backend.vercel.app/api).

### Key Endpoints Overview

- **Auth**: `/api/auth` (Register, Login, Logout, Refresh Token)
- **Properties**: `/api/properties` (Browse Listings, Get Details)
- **Favourites**: `/api/favourites` (Save and Manage properties)

> [!NOTE]
> All protected routes utilize **HTTP-only Cookies** for secure authentication. To test these in the Swagger UI, simply use the **Login** endpoint first to establish a session; your browser will automatically handle the session for subsequent requests.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 3, Zustand (Global Authentication State Management), TypeScript, ESModules.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Zod (Validation), TypeScript, ESModules.
- **Auth**: JWT (Access & Refresh tokens) with HTTP-only cookies.
