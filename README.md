# YelpCamp

YelpCamp is a MERN campground review application. Users can register, log in, browse campgrounds, view Mapbox locations, upload campground images through Cloudinary, and leave reviews.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Bootstrap, Mapbox GL JS
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: Passport local strategy for password checks, JWT bearer tokens for API auth
- Uploads: Multer, Cloudinary
- Security: Helmet, express-mongo-sanitize, Joi validation

## Project Structure

```text
yelpCamp/
  backend/      Express API, MongoDB models, JWT auth, uploads, Mapbox token endpoint
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
JWT_SECRET=your_jwt_secret
MAPBOX_TOKEN=your_mapbox_access_token
```

`SECRET` is also accepted as a fallback for JWT signing, but `JWT_SECRET` is recommended.

Optional frontend override:

Create `frontend/.env.local` for local overrides, or set the same variable in Vercel project settings.

```env
VITE_API_URL_LOCAL=http://localhost:3000
VITE_API_URL=https://yelpcamp-llkg.onrender.com
```

For local development, `VITE_API_URL_LOCAL` is used when present. If it is omitted, the frontend defaults to `http://localhost:3000`.
For production builds, the frontend defaults to `https://yelpcamp-llkg.onrender.com`.

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

## Deployment

Backend on Render:

- Set the root directory to `backend` if deploying from this monorepo.
- Build command: `npm install`
- Start command: `npm start`
- Required environment variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, `DB_URL`, `JWT_SECRET`, `MAPBOX_TOKEN`

Frontend on Vercel:

- Set the root directory to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://yelpcamp-llkg.onrender.com`
- `frontend/vercel.json` rewrites all routes to `index.html` so React Router routes work on refresh.

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
- `/campgrounds/new` - create campground
- `/campgrounds/:id/edit` - update campground
- `/login` - login
- `/register` - register

Backend:

- `GET /currentUser`
- `POST /register`
- `POST /login`
- `GET /mapbox-token`
- `GET /campGround`
- `GET /campGround/:id`
- `POST /campGround`
- `PUT /campGround/:id`
- `DELETE /campGround/:id`
- `POST /campGround/:id/reviews`
- `DELETE /campGround/:id/reviews/:reviewId`

Protected backend routes require:

```http
Authorization: Bearer <jwt-token>
```

## Notes

- Login and registration return a JWT. The frontend stores it in `localStorage` as `yelpCampToken` and Axios sends it on protected API requests.
- Logout is client-side token clearing.
- Mapbox is loaded in the frontend, but the token is served from the backend through `/mapbox-token`.
- Updating a campground location geocodes the new location and updates the saved map geometry.
- Image uploads require valid Cloudinary credentials.
- Keep `.env`, `node_modules`, and build outputs out of git.
