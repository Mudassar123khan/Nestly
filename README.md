# Nestly

[![Node.js](https://img.shields.io/badge/Node.js-22.16.0-green?logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express.js-5.1.0-black?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17.0-green?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/EJS-3.1.10-yellow?logo=ejs&logoColor=white)](https://ejs.co/)
[![Passport.js](https://img.shields.io/badge/Passport.js-Authentication-blue)](https://www.passportjs.org/)

**Nestly** is a hotel booking and property rental platform that allows users to **book hotels**, **list their real estate**, and **manage bookings online**.  
It offers a smooth user experience with secure authentication, responsive UI, and dynamic CRUD operations — following the **MVC architecture** for maintainability and scalability.

---

## 🏗️ Tech Stack
- **Backend:** Node.js, Express.js, EJS, Mongoose  
- **Database:** MongoDB  
- **Templating Engine:** EJS + EJS-Mate  
- **Authentication:** Passport.js, Passport-Local, Express-Session  
- **File Uploads:** Multer, Cloudinary, Multer-Storage-Cloudinary  
- **Validation:** Joi  
- **Styling:** Tailwind CSS (mobile-first responsive design)  
- **Architecture:** MVC pattern  

---

## ✨ Features

### 👤 User Management
- User **signup, login, and authentication** using Passport.js.  
- Secure **session handling** and password encryption.  
- Flash messages for better user feedback (success/error).  

### 🏠 Property & Hotel Management
- Users can **list hotels or rental properties** with images and details.  
- Dynamic **CRUD operations** (Create, Read, Update, Delete) for listings.  
- Image uploads handled securely with **Cloudinary**.  

### 🧳 Booking System
- Users can **book listings** directly from the platform.  
- Bookings are linked to authenticated user accounts.  
- Users can **leave reviews** and ratings for properties.  

### ⚙️ Additional Highlights
- RESTful API design for scalability.  
- Applied **MVC architecture** for modular and clean code organization.  
- Input validation with Joi and secure data handling.  
- **Mobile-first**, responsive design using Tailwind CSS.  

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Mudassar123khan/Nestly
cd Nestly
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
#### Create a .env file in the root directory and add the following:
```bash
MONGO_URI=<your_mongodb_connection_string>
SESSION_SECRET=<your_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

### 4. Start the Server
```bash
node app.js
```
#### The app will run by default on:
```bash
http://localhost:3000
```

### 5. Future Enhancements
   1. Online payment integration for bookings (e.g., Razorpay/Stripe).
     
   2. Advanced search and filtering by location, price, and amenities.
   
   3. Wishlist and favorites feature for users.
   
   4. Admin dashboard for monitoring listings and user activity.


### 6. License
This project is licensed under the ISC License.

### 7. Author
Mohd Mudassir Khan
Hotel & Property Booking Platform Developer
📧 12mudassarkhan@gamil.com

### Deploy link:
```sh
https://imperial-hotels.onrender.com
```

## ⭐ If you like this project, consider giving it a star on GitHub!
