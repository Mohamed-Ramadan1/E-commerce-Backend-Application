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

# Usage

This section provides information on how to use the E-commerce Backend Application.

## Prerequisites

- Node.js (v20 or higher)
- npm (Node Package Manager)
- MongoDB connection

## Running the Application

### Development Mode

To run the application in development mode, use the following command:

```bash
npm run dev
```

### Production Mode

To run the application in production mode, follow these steps:

1. Build the project:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

Make sure all environment variables in the `.env` file are properly set before running the application in either mode.

## API Documentation

The API documentation is available as a Postman collection. Follow these steps to access and use it:

1. Locate the file `E-Commerce App.postman_collection.json` in the main directory of the project.

2. Import this file into Postman:

   - Open Postman
   - Click on "Import" in the top left corner
   - Drag and drop the JSON file or browse to select it
   - Click "Import" to confirm

3. Once imported, you will have your own version of the API documentation within Postman.

4. You can now explore all available endpoints, their purposes, required parameters, and example requests/responses.

## Interacting with the API

With the Postman collection, you can:

- View all available endpoints
- Send requests to test the API
- See example responses
- Understand the structure of request payloads

Remember to set up any required authentication (such as JWT tokens) as specified in the Postman collection.

For any specific usage instructions or examples of key features, please refer to the documentation provided in the Postman collection.

# Features

Our E-commerce Backend Application offers a robust set of features designed to support a comprehensive online marketplace:

1. **Authentication and Authorization**: Secure JWT-based authentication system with cookie management.

2. **Product Management**:

   - Users can browse and purchase products
   - Admins and shop owners can add, delete, and manage products

3. **Shopping Cart**: Personalized cart system storing user, product, and transaction details.

4. **Shop Management**:

   - Users can create and manage their own shops
   - Shop owners can manage inventory, settings, and profiles

5. **Support Ticket System**:

   - Users can create and track support tickets
   - Dedicated system for shop owners to manage customer issues

6. **Order Management**:

   - Users can create and cancel orders
   - Admins can oversee and manage all orders
   - Shop owners can manage orders related to their products

7. **Review System**: Allows users to review products they've purchased.

8. **Wishlist**: Advanced wishlist functionality for users.

9. **Return and Refund Policy**: Comprehensive system for handling returns and refunds.

10. **Real-time Notification System**: Keeps users updated on various activities and transactions.

11. **Email Communication**: Robust email system for important updates and notifications.

12. **One-way Messaging**: Allows admins to send messages to users via email.

13. **Discount Code System**:

    - Shop owners and admins can create discount codes
    - Users can apply these codes during purchases

14. **Prime Membership**:

    - Offers benefits like free shipping and increased loyalty points
    - Loyalty points can be exchanged for discounts

15. **Reporting System**:

    - Users can report problematic shops
    - Shop owners can request shop deletion

16. **Sub-order System**: Ensures privacy in multi-vendor orders.

17. **Dual Analytics System**:
    - Real-time Analytics: Provides up-to-the-minute insights on various metrics.
    - Monthly Reports: Automatically generated and sent to website admins and shop owners, offering in-depth analysis of performance and trends.

Note: The application includes a powerful email notification system. For visual examples of these notifications, please refer to the `docs/images/` directory in the repository.

## Technologies Used

MultiVend is built using a modern tech stack, leveraging powerful tools and libraries to create a robust e-commerce platform. Here's an overview of the key technologies used:

### Core Technologies

- **Node.js**: The runtime environment for executing JavaScript on the server.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer productivity.
- **MongoDB**: A NoSQL database used with Mongoose as the ODM (Object Document Mapper).

### Authentication and Security

- **bcryptjs**: Library for hashing passwords.
- **jsonwebtoken**: Implementation of JSON Web Tokens for secure authentication.
- **helmet**: Helps secure Express apps by setting various HTTP headers.
- **express-rate-limit**: Basic rate-limiting middleware for Express.
- **express-mongo-sanitize**: Middleware to sanitize user-supplied data to prevent MongoDB Operator Injection.

### File Handling and Image Processing

- **multer**: Middleware for handling multipart/form-data, primarily used for file uploads.
- **cloudinary**: Cloud service for image and video management.

### Payment Processing

- **stripe**: Official Stripe API library for Node.js.

### Email and Notifications

- **nodemailer**: Module for sending emails.
- **socket.io**: Real-time bidirectional event-based communication.

### Task Scheduling and Queue Management

- **node-cron**: Task scheduler in pure JavaScript for Node.js.
- **bull**: Premium Queue package for handling distributed jobs and messages in Node.js.

### API Documentation

- **swagger-jsdoc** and **swagger-ui-express**: Tools for generating and serving Swagger API documentation.

### Development and Build Tools

- **webpack**: Module bundler for JavaScript applications.
- **ts-node-dev**: TypeScript execution and development tool with restart capability.
- **jest**: JavaScript testing framework (listed in scripts, assuming it's used for testing).

### Other Utilities

- **dotenv**: Loads environment variables from a .env file.
- **cors**: Package for providing a Connect/Express middleware that can be used to enable CORS.
- **morgan**: HTTP request logger middleware for Node.js.
- **validator**: Library of string validators and sanitizers.

This tech stack ensures a scalable, secure, and feature-rich backend for the MultiVend e-commerce platform, providing a solid foundation for building complex marketplace functionalities.

## Author Information

### Mohamed Ramadan

- **GitHub**: [Mohamed-Ramadan1](https://github.com/Mohamed-Ramadan1)
- **Email**: mohamedramadanb@gmail.com
- **LinkedIn**: [Mohamed Ramadan](https://www.linkedin.com/in/mohamed-ramadan-758555236/)

I'm a dedicated backend software engineer with a passion for creating high-quality software solutions.

My goal is to contribute to the tech community by developing innovative solutions that address real-world challenges . I'm always eager to learn new

technologies and methodologies to enhance my skills and deliver better software.

Feel free to reach out to me for any questions, suggestions, or potential collaborations regarding this project or other backend development topics!
