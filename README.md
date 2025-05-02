YelpCamp 🏕️
============

YelpCamp is a web application built with Node.js, Express, and MongoDB that allows users to browse, create, and manage campgrounds. It includes features such as user authentication, campground creation, image uploading via Cloudinary, and data sanitization for enhanced security. 🌐

Features ✨
----------

*   **User Authentication 🔐:** Users can register, log in, and log out using Passport.js with local authentication.
*   **Campground Management 🏞️:** Users can create, view, and delete campgrounds. Each campground has an image, description, and location.
*   **Image Uploads 🖼️:** Campground images are stored on Cloudinary for fast and secure access.
*   **Data Sanitization 🛡️:** Input is sanitized using express-mongo-sanitize and sanitize-html to prevent injection attacks.
*   **Responsive Design 📱:** The app is built with Bootstrap, ensuring a clean and responsive layout for various devices.

Technologies Used ⚙️
--------------------

*   **Node.js 🌱** - JavaScript runtime for building server-side applications.
*   **Express.js ⚡** - Web framework for building the backend server.
*   **MongoDB 🗄️** - NoSQL database for storing user and campground data.
*   **Passport.js 🛂** - Authentication middleware for handling user login and registration.
*   **Cloudinary ☁️** - Image upload and management service.
*   **EJS 🖥️** - Templating engine to render HTML views.
*   **Bootstrap 🖋️** - CSS framework for responsive design.
*   **Helmet.js 🛡️** - Security middleware to set HTTP headers for improved security.
*   **Mongoose 🐾** - MongoDB object modeling tool for handling data operations.

Installation 🔧
---------------

1.  Clone the repository:
    
        git clone https://github.com/fatima-Sami55/YelpCamp.git
    
2.  Install dependencies:
    
        cd YelpCamp && npm install
    
3.  Set up your environment variables by creating a `.env` file and adding the following:
    
        
        CLOUDINARY_CLOUD_NAME=your-cloud-name
        CLOUDINARY_API_KEY=your-api-key
        CLOUDINARY_API_SECRET=your-api-secret
        MONGO_URI=your-mongo-db-uri
        SECRET=your-session-secret
                        
    
4.  Start the app:
    
        npm start
    
5.  Visit the app at [http://localhost:3000](http://localhost:3000).

Usage 📝
--------

*   **Home Page 🏡:** Displays a list of campgrounds with their images and brief descriptions.
*   **Create Campground 🖋️:** Users can create a new campground with a name, description, and image upload.
*   **View Campground 🔍:** Each campground can be clicked to view detailed information, including the full description and image.

Contributing 🤝
---------------

To contribute to the project:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-name`).
3.  Make your changes and commit (`git commit -am 'Add new feature'`).
4.  Push to the branch (`git push origin feature-name`).
5.  Open a pull request.
