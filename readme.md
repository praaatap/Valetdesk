# ValetDesk Mobile App Assignment

A full-stack mobile application for managing parking tickets/valet services. Built with **React Native (Expo)** and **Flask**.

## Features

- **List items**: View all active parking tickets.
- **View Details**: See full details of a specific ticket (Vehicle No, Slot, Owner).
- **Create Item**: Add a new parking ticket via a form.
- **REST API**: Backend endpoints to manage data.

## Tech Stack

- **Mobile**: React Native (Expo), React Navigation, Axios
- **Backend**: Flask (Python), In-memory storage

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.x
- Expo Go app on your phone (or Android Emulator)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```
The server will start at `http://0.0.0.0:5000`.

### 2. Mobile App Setup

```bash
cd mobile
npm install
npx expo start
```
- Press `a` to open in Android Emulator.
- OR scan the QR code with Expo Go on your phone.

> **Note**: If running on a physical device, ensure your phone and computer are on the same Wi-Fi. Update `API_URL` in `mobile/screens/HomeScreen.js`, `DetailScreen.js`, and `CreateItemScreen.js` to your computer's local IP address (e.g., `http://192.168.1.5:5000/items`).
> currently it is set to `http://10.0.2.2:5000/items` which works for Android Emulator.

## API Endpoints

| Method | Endpoint | Description |
|os |os |os |
| GET | `/items` | List all tickets |
| GET | `/items/<id>` | Get ticket details |
| POST | `/items` | Create a new ticket |

## Assumptions & Decisions

- **In-memory Storage**: Data is resets when the backend restarts (as per requirements).
- **Navigation**: Used Native Stack Navigator for standard platform feel.
- **Styling**: Custom clean styling without heavy libraries for lightweight performance.
- **Validation**: Basic requirement checks on the form.

## Future Improvements

- Add a persistent database (SQLite/PostgreSQL).
- Implement authentication (Login/Signup).
- Add Redux/Zustand for global state management.
- Add unit tests for API and Components.
