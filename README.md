# YelpCamp

YelpCamp is a MERN campground review application. Users can register, log in, browse campgrounds, view Mapbox locations, upload campground images through Cloudinary, and leave reviews.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Bootstrap, Mapbox GL JS
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: Passport, passport-local-mongoose, express-session
- Uploads: Multer, Cloudinary
- Security: Helmet, express-mongo-sanitize, Joi validation

## Project Structure

```text
yelpCamp/
  backend/      Express API, MongoDB models, auth, uploads, Mapbox token endpoint
  frontend/     React/Vite client
  README.md     Project setup and usage guide
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string, local or Atlas
- Cloudinary account
- Mapbox access token

## Environment Variables

Create `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
DB_URL=mongodb://localhost:27017/yelpdb
SECRET=your_session_secret
MAPBOX_TOKEN=your_mapbox_access_token
```

Optional frontend override:

Create `frontend/.env.local` only if your backend is not running on `http://localhost:3000`.

```env
VITE_API_URL=http://localhost:3000
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd backend
npm start
```

The backend runs on `http://localhost:3000`.

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Useful Scripts

Backend:

```bash
npm start
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Key Routes

Frontend:

- `/` - home page
- `/campgrounds` - campground index with cluster map
- `/campgrounds/:id` - campground details with location map and reviews
- `/login` - login
- `/register` - register

Backend:

- `GET /currentUser`
- `POST /register`
- `POST /login`
- `GET /logout`
- `GET /mapbox-token`
- `GET /campGround`
- `GET /campGround/:id`
- `POST /campGround`
- `PUT /campGround/:id`
- `DELETE /campGround/:id`
- `POST /campGround/:id/reviews`
- `DELETE /campGround/:id/reviews/:reviewId`

## Notes

- The frontend uses cookies for session auth, so the backend CORS configuration allows credentials from `http://localhost:5173`.
- Mapbox is loaded in the frontend, but the token is served from the backend through `/mapbox-token`.
- Image uploads require valid Cloudinary credentials.
- Keep `.env`, `node_modules`, and build outputs out of git.
