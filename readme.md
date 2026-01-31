# ValetDesk Mobile App Assignment

A full-stack mobile application for managing parking tickets/valet services. Built with **React Native (Expo)** and **Flask**.

## Features

- **Professional UI**: "Task Management" style interface with Analytics Dashboard.
- **Task Management**: Create, Edit, Delete, and Mark as Completed.
- **Search & Filter**: Real-time filtering by Title/Vehicle.
- **Due Dates**: Track deadlines with visual indicators.
- **Persistence**: SQLite backend ensures data safety.

## Tech Stack

- **Mobile**: React Native (Expo), TypeScript, React Navigation
- **Backend**: Flask (Python), SQLite
- **Architecture**: REST API, MVC pattern

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.x
- Expo Go app

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Activate venv:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*Note: `valetdesk.db` is automatically created.*

### 2. Mobile App Setup

```bash
cd mobile
npm install
npx expo start
```
- Press `a` to open in Android Emulator.

## API Endpoints

| Method | Endpoint | Description |
|os |os |os |
| GET | `/items` | List all tasks |
| POST | `/items` | Create task (supports `due_date`) |
| PATCH | `/items/<id>` | Update status |
| DELETE | `/items/<id>` | Delete task |

## Project Structure
- `backend/app.py`: Main Flask application
- `mobile/screens/`: Screen components (Home, Detail, Create)
- `mobile/components/`: Reusable UI (AnalyticsCard)
- `mobile/constants/`: Theme and Colors
