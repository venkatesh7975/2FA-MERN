# MFA-MERN Application

This is a simple multi-factor authentication (MFA) application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The application includes user registration, login, OTP verification, and password reset functionality. Passwords are securely stored using bcrypt hashing.

## Features

1. **User Registration**: Allows new users to register with an email and password.
2. **User Login**: Allows existing users to log in with their email and password. An OTP is sent to the user's email for verification.
3. **OTP Verification**: Users must verify their login with an OTP sent to their email.
4. **Password Reset**: Users can request a password reset, and a reset link will be sent to their email. The link allows them to set a new password.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd mfa-mern
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```env
   EMAIL=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   RESET_TOKEN_SECRET=your-reset-token-secret
   ```

### Running the Application

1. Start the MongoDB server:

   ```bash
   mongod
   ```

2. Start the application:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:3001`.

## API Endpoints

### 1. Registration

**Endpoint**: `/auth/register`

**Method**: `POST`

**Description**: Registers a new user with an email and password.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response**:

- Success: `201 Created`
  ```json
  {
    "success": true,
    "message": "Registration successful"
  }
  ```
- Error: `400 Bad Request` if the email is already registered, `500 Internal Server Error` for other errors.

### 2. Login

**Endpoint**: `/auth/login`

**Method**: `POST`

**Description**: Logs in a user with an email and password. An OTP is sent to the user's email for verification.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response**:

- Success: `200 OK`
  ```json
  {
    "success": true
  }
  ```
- Error: `400 Bad Request` if the credentials are invalid, `500 Internal Server Error` for other errors.

### 3. OTP Verification

**Endpoint**: `/auth/verify-otp`

**Method**: `POST`

**Description**: Verifies the OTP sent to the user's email.

**Request Body**:

```json
{
  "otp": "123456"
}
```

**Response**:

- Success: `200 OK`
  ```json
  {
    "success": true
  }
  ```
- Error: `400 Bad Request` if the OTP is invalid, `500 Internal Server Error` for other errors.

### 4. Request Password Reset

**Endpoint**: `/auth/request-reset`

**Method**: `POST`

**Description**: Sends a password reset email to the user's email address.

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

- Success: `200 OK`
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```
- Error: `400 Bad Request` if the email is not found, `500 Internal Server Error` for other errors.

### 5. Reset Password

**Endpoint**: `/auth/reset-password`

**Method**: `POST`

**Description**: Resets the user's password using the token sent in the password reset email.

**Request Body**:

```json
{
  "token": "reset-token",
  "newPassword": "newuserpassword"
}
```

**Response**:

- Success: `200 OK`
  ```json
  {
    "success": true,
    "message": "Password successfully updated"
  }
  ```
- Error: `400 Bad Request` if the token is invalid, `500 Internal Server Error` for other errors.

## Security Considerations

- **Password Hashing**: Passwords are hashed using bcrypt before storing them in the database.
- **Environment Variables**: Sensitive information like email credentials and JWT secret are stored in environment variables.
- **JWT**: JSON Web Tokens are used for secure password reset links.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Nodemailer](https://nodemailer.com/about/)
- [Randomatic](https://www.npmjs.com/package/randomatic)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

This README provides a comprehensive guide to setting up and using the MFA-MERN application. If you encounter any issues or have any questions, feel free to open an issue on the repository.
