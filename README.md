# Food Points Tracker Backend

This is the backend for a campus food points tracking app. It allows students to track their food point spending, manage blocked days, and calculate daily allowances to help budget their food plan for the semester.

## Features
- User management (create user, get user info)
- Log foodpoint transactions (spending)
- Manage blocked days (days not on campus)
- Calculate daily allowance and remaining balance
- SQLite database for storage
- RESTful API

## Tech Stack
- Node.js
- Express
- SQLite

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node index.js
   ```
   The server will run on port 8080 by default.

## API Documentation

### Users

#### Create a User
- **POST** `/users`
- **Body:**
  ```json
  {
    "name": "Alice",
    "food_plan_points": 4000,
    "semester_start": "2024-08-01",
    "semester_end": "2024-12-15"
  }
  ```
- **Response:**
  ```json
  { "message": "User created", "id": 1 }
  ```

#### Get User Info
- **GET** `/users/:id`
- **Response:**
  ```json
  {
    "id": 1,
    "name": "Alice",
    "food_plan_points": 4000,
    "semester_start": "2024-08-01",
    "semester_end": "2024-12-15"
  }
  ```

---

### Foodpoints (Transactions)

#### Log a Foodpoint Transaction
- **POST** `/foodpoints`
- **Body:**
  ```json
  {
    "user_id": 1,
    "amount": 15.46,
    "timestamp": "2024-08-01T13:45:00Z"
  }
  ```
- **Response:**
  ```json
  { "message": "Foodpoint transaction added", "id": 1 }
  ```

#### Get All Transactions for a User
- **GET** `/foodpoints/:user_id`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "amount": 15.46,
      "timestamp": "2024-08-01T13:45:00Z"
    },
    ...
  ]
  ```

---

### Blocked Days

#### Add a Blocked Day
- **POST** `/blocked-days`
- **Body:**
  ```json
  {
    "user_id": 1,
    "date": "2024-09-10"
  }
  ```
- **Response:**
  ```json
  { "message": "Blocked day added", "id": 1 }
  ```

#### Remove a Blocked Day
- **DELETE** `/blocked-days/:id`
- **Response:**
  ```json
  { "message": "Blocked day removed" }
  ```

#### Get All Blocked Days for a User
- **GET** `/blocked-days/:user_id`
- **Response:**
  ```json
  [
    { "id": 1, "user_id": 1, "date": "2024-09-10" },
    ...
  ]
  ```

---

### Summary

#### Get User Summary
- **GET** `/summary/:user_id`
- **Response:**
  ```json
  {
    "remainingPoints": 3984.54,
    "usableDays": 120,
    "dailyAllowance": 33.20,
    "spentToday": 15.46,
    "remainingToday": 17.74,
    "semesterEnd": "2024-12-15",
    "blockedDays": ["2024-09-10"]
  }
  ```

---

## Notes
- All dates should be in `YYYY-MM-DD` or ISO format.
- All endpoints expect and return JSON.
- Make sure to use the correct `user_id` for each request.

## License
MIT 