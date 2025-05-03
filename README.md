# Cupid - Dating App API

Cupid is a simple dating app backend built with Node.js, Express, and MongoDB. This API allows users to sign up, sign in, find potential matches based on interests and hobbies, send love requests, chat with matched users, and more.

---

## 🚀 Feature Requirements

- User authentication (Sign up & Sign in)
- Users can specify their **gender** and **interestedIn** field, amongst many other necessary fields
- Fetch users based on the `interestedIn` field
- Fetch users based on hobbies
- View a user's profile details
- Delete a user profile
- Report a profile
- Send a love request to another user
- Gift users on their birthday or special occasions
- Chat feature for matched users

---

## 📦 Installation

1. **Fork the repository** (Click the "Fork" button at the top-right of this repo on GitHub).

2. **Clone your forked repository**:
```sh
git clone https://github.com/your-username/cupid.git
cd cupid
```

Install dependencies:
```sh
npm install
```

Set up environment variables in a `.env` file:
```sh
PORT=8000
DB_ADMIN=your_db_admin
DB_PASSWORD=your_db_password
```

Run the server:
```sh
npm start
```

## 📌 API Endpoints

### User Routes

METHOD | ENDPOINT | DESCRIPTION
-------|----------|--------------
POST | /api/v1/love-island/sign-up |	Create a new user
POST |	/api/v1/love-island/sign-in |	User authentication (To be implemented)
GET |	/api/v1/love-island/users |	Get all users (Filtering based on interests/hobbies will be added)
GET |	/api/v1/love-island/user/:id |	Get a single user's details
DELETE |	/api/v1/love-island/user/:id |	Delete a user profile
POST |	/api/v1/love-island/user/:id/report |	Report a user profile
POST |	/api/v1/love-island/user/:id/love-request |	Send a love request
POST |	/api/v1/love-island/user/:id/gift |	Gift a user on their birthday

## 🤝 License

This project is licensed under the MIT License.