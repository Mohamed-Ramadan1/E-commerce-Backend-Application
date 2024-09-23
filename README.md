# MultiVend: Advanced Multi-Vendor E-Commerce Platform

MultiVend is a cutting-edge, feature-rich multi-vendor e-commerce platform that revolutionizes online trading by empowering both shoppers and entrepreneurs. Our platform creates a dynamic marketplace where users can not only shop but also establish and manage their own online stores with ease.

# Installation

Follow these steps to set up the E-commerce Backend Application:

1. Clone the project:

   ```
   git clone git@github.com:Mohamed-Ramadan1/E-commerce-Backend-Application.git
   ```

2. Navigate to the project directory:

   ```
   cd E-commerce-Backend-Application
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory with the following variables:

   ```
   NODE_ENV=
   PORT=
   DATABASE=
   EMAIL_PASSWORD=
   JWT_SECRET=
   JWT_EXPIRES_IN=90d
   JWT_LOGOUT_EXPIRES_IN=0
   JWT_COOKIE_EXPIRES_IN=90
   CLOUD_NAME=
   CLOUD_API_KEY=
   CLOUD_API_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_REDIRECT_URL=
   STRIPE_SECRET_KEY=
   STRIPE_SUCCESS_URL=
   STRIPE_CANCEL_URL=
   ```

   Note: Fill in the appropriate values for each variable. Ensure you provide a MongoDB connection string for the `DATABASE` variable (local or Atlas).

5. Start the development server:
   ```
   npm run dev
   ```

## Production Deployment

### Using Docker Compose

Ensure you have Docker and Docker Compose installed on your machine, then run:

```
docker-compose up
```

This will build the image and start the container. The project will then be up and running.

### Using Webpack

To build the project for production using Webpack, run:

```
npm run build
```

## Requirements

- Node.js version 20 or higher
- MongoDB (local or Atlas)

Please ensure all environment variables are properly set before running the application.
