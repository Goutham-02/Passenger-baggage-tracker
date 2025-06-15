# Passenger Baggage Tracker

A full-stack web application for tracking airline passengers' baggage in real-time. Built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## Features

- **Passenger Registration & Login:** Secure authentication for admins and passengers.
- **Baggage Registration:** Register new baggage and associate it with a passenger and flight.
- **Baggage Tracking:** Search and track baggage by tag number, view detailed timeline/status and current location.
- **Admin Features:** Manage flights, passengers, and baggage status.
- **REST API:** Backend exposes endpoints for user management, baggage handling, and flight data.

---

## Technologies Used

- **Frontend:** React, Vite, Material-UI
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT-based, with access and refresh tokens
- **Other:** ESLint, dotenv, cookie-based auth

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Goutham-02/Passenger-baggage-tracker.git
cd Passenger-baggage-tracker
```

#### 2. Setup Backend

```bash
cd Backend
cp .env.example .env         # Create your own .env file
npm install
npm run dev                  # or: node src/index.js
```
- Update `.env` with your MongoDB URI and JWT secrets.

#### 3. Setup Frontend

```bash
cd ../Frontend
npm install
npm run dev
```
- The frontend runs by default at [http://localhost:5173](http://localhost:5173)

### API Endpoints

- `POST /api/v1/users/register` — Register user
- `POST /api/v1/users/login` — Login user
- `POST /api/v1/users/baggage` — Register baggage
- `GET /api/v1/users/baggage/:passengerId` — List all baggage for passenger
- `POST /api/v1/users/baggage/search` — Search baggage by tag number

(See `Backend/src/controllers/user.controller.js` for more)

---

## Usage

- Passengers and admins can log in to track or manage baggage.
- Enter baggage tag number to track status, location, and timeline.

---

## Folder Structure

```
Passenger-baggage-tracker/
  ├── Backend/
  │   ├── src/
  │   └── ... 
  └── Frontend/
      ├── src/
      └── ...
```

---

## Contribution

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) © Goutham-02

---

## Author

- [Goutham-02](https://github.com/Goutham-02)
