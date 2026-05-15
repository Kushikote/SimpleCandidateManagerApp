# Candidate Management Application

A simple, beginner-friendly full-stack application for managing candidates built with Express + TypeScript (backend) and React + TypeScript (frontend).

## Project Overview

This is a take-home assignment demonstrating a junior full-stack developer's ability to build a clean, functional application with proper validation, error handling, and user feedback.

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React with TypeScript
- **Data Storage**: In-memory array
- **Styling**: CSS

## Features

- ✅ View all candidates in a responsive card layout
- ✅ Create new candidates with form validation
- ✅ Error handling and user feedback
- ✅ Loading states for better UX
- ✅ Type-safe TypeScript implementation
- ✅ Clean, readable code structure

## Project Structure

```
fsd-assignment/
├── backend/                        # TypeScript backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts
│       └── types.ts
├── frontend/                       # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CandidateList.tsx   # Displays all candidates
│   │   │   ├── CandidateList.css
│   │   │   ├── CreateCandidate.tsx # Form to create candidate
│   │   │   └── CreateCandidate.css
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── App.tsx                 # Main app logic
│   │   ├── App.css
│   │   └── index.tsx
│   ├── package.json
│   └── public/
├── .gitignore
├── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend in development mode:
```bash
npm run dev
```

The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

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
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### GET /candidates
Returns a list of all candidates.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "John Doe",
    "phone": "123-456-7890",
    "skills": ["JavaScript", "React"],
    "experience_years": 5,
    "status": "active"
  }
]
```

### POST /candidates
Creates a new candidate.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "123-456-7890",
  "skills": ["JavaScript", "React"],
  "experience_years": 5,
  "status": "active"
}
```

**Response:** Returns the created candidate object with auto-generated `id`.

### GET /candidates/{candidate_id}
Retrieves a specific candidate by ID.

**Response:** Returns the candidate object or 404 error.

## Candidate Fields

- `id`: Unique identifier (auto-generated UUID string)
- `name`: Candidate's full name (required, 1-100 characters)
- `phone`: Contact phone number (required, exactly 10 digits)
- `skills`: Array of skills (required, at least 1 skill)
- `experience_years`: Years of experience (required, 0 or more)
- `status`: Status ("active" or "inactive")

## Frontend Features

### CandidateList Screen
- Displays all candidates as cards
- Shows candidate information in an organized layout
- Empty state message when no candidates exist
- Loading indicator while fetching data
- Button to create a new candidate

### CreateCandidate Screen
- Form with validation for all fields
- Phone number field accepts exactly 10 digits
- Skills input allows adding one skill at a time with "Add Skill" button
- Skills display as removable tags
- Press Enter to quickly add a skill
- Error messages displayed inline
- Loading state on submit button
- Clear errors when user starts typing
- Back button to return to candidate list
- Auto-refresh of candidate list after successful creation

## Validation

### Frontend Validation
- Name: Required, cannot be empty
- Phone: Required, must contain exactly 10 digits
- Skills: Add one skill at a time, at least one skill required, no duplicates
- Experience Years: Required, must be a whole number 0 or greater
- Status: Required dropdown selection

### Backend Validation
- Name: 1-100 characters, whitespace trimmed
- Phone: Normalized to digits only, must be exactly 10 digits
- Skills: Array with at least 1 item, trimmed and duplicate-free
- Experience Years: Non-negative integer
- Status: Must be "active" or "inactive"

## Error Handling

- Network errors are caught and displayed to users
- Validation errors show field-specific messages
- Global error messages appear at the top of the list screen
- Errors can be dismissed by the user
- Console logs for debugging

## Running the Application

With both backend and frontend running:

1. Open `http://localhost:3000` in your browser
2. The app will fetch the candidate list on load
3. Click "Add New Candidate" to create a new candidate
4. Fill in the form and submit
5. Return to list to see the new candidate

## Notes

- Data is stored in memory, so it will be lost when the server restarts
- No authentication or database is used
- CORS is enabled to allow frontend-backend communication
- The frontend communicates with the backend at `http://127.0.0.1:8000`

## Development Notes

- The backend automatically validates input using Zod
- The frontend prevents submission of invalid data
- Both validation layers work together for robust error handling
- The app gracefully handles network failures

## Decisions

- Used **Express + TypeScript** for the backend to keep the API lightweight and to leverage Zod validation.
- Used **React + TypeScript** for the frontend to ensure type safety and clean component structure.
- Stored data in memory with a plain JavaScript array, since a database was intentionally not required.
- Kept the UI simple so the focus stays on correct behavior, validation, and clarity.
- Normalized phone input to digits only and validated it consistently on both frontend and backend.

## AI Usage

- I used **GitHub Copilot** / AI assistance in VS Code to review the project and suggest improvements.
- The AI helped identify validation gaps, improve error handling, and ensure the README explained the app clearly.
- I reviewed and accepted the AI suggestions, and I verified the final code builds successfully.
