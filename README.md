# Node.js E-commerce Project

## Description

This project is a Node.js application designed to manage products and categories while ensuring robust security and user management. Key features include:

- **Product & Category Management:**
  - Full CRUD (Create, Read, Update, Delete) operations for products and categories.
  - Authorization checks to ensure only product creators or admins can update/delete products.

- **User Authentication & Authorization:**
  - JWT-based authentication with tokens sent via cookies, ensuring secure login and session management.
  - Password reset functionality allowing users to request a token via email, valid for 10 minutes.
  - Users can update their password while logged in, with automatic token refresh to maintain their session.
  - Role-based access control, restricting certain actions (like deleting a product) to admins or the original product creator.
  - Protected routes ensure only authenticated users can access certain parts of the application.
  - Restricted routes further limit access based on roles, allowing only admins or authorized users to perform specific actions.

- **User Management:**
  - Users can update their personal information but cannot change their role from a normal user to an admin.
  - Account deactivation functionality, allowing users to deactivate their accounts.

- **Security Measures:**
  - `xss-clean` to sanitize user input and prevent cross-site scripting (XSS) attacks.
  - `helmet` for setting secure HTTP headers.
  - `hpp` to protect against HTTP parameter pollution.
  - `rate-limit` to limit the number of requests from a single IP address, mitigating brute-force attacks.

- **Middleware & Error Handling:**
  - Middleware to protect routes, restrict access, and validate tokens.
  - Error handling for JWT issues, such as expired or invalid tokens.
  - Additional middleware to enhance security, such as rate limiting and HTTP header protection.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

    Open Visual Studio Code (VSCode) and use the integrated terminal to clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies:**

    Make sure you have Node.js and npm installed. Then, install the necessary packages:

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root of the project. You can use the provided `.env.example` file as a reference for the required variables. Here’s how to set up the environment variables:

    - **MongoDB:** Install MongoDB locally or use a cloud service like MongoDB Atlas. Replace `DATABASE_URL` with your MongoDB connection string.

    - **JWT Secret:** Set a secret key for signing JSON Web Tokens (JWT). Replace `JWT_SECRET` with your preferred secret key.

    - **Email Service (Nodemailer):** Configure your email service. You can use services like Gmail, SendGrid, or any SMTP server. Provide the email service details in `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, and `EMAIL_PASSWORD`.

    Example `.env` file:

    ```plaintext
    PORT=4000
    DATABASE_URL=mongodb://localhost:27017/your-database-name
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRES_IN=1h
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USERNAME=your-email@example.com
    EMAIL_PASSWORD=your-email-password
    ```

4. **Run the application:**

    - **For development:**

        Start the development server:

        ```bash
        npm start
        ```

    - **For production:**

        Start the application in production mode:

        ```bash
        npm run start:prod
        ```

5. **Access the application:**

    The application will be running at `http://localhost:4000`.

## Additional Setup

- **MongoDB:**

    If you don't have MongoDB installed, you can follow the [official installation guide](https://docs.mongodb.com/manual/installation/) or use a cloud-based solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    Make sure your connection string in `.env` matches your MongoDB instance.

- **Email Service (Nodemailer):**

    Nodemailer is used for sending emails. Configure your email service by providing the appropriate SMTP details in the `.env` file.
    You can use free services like Gmail (note that Gmail may require special settings or app passwords) or a transactional email service like SendGrid.
