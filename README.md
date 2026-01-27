# Kalindhi - Kerala Tourism Booking Platform

Kalindhi is a comprehensive full-stack web application designed for browsing and booking curated tour packages in Kerala. From the serene backwaters of Alleppey to the misty hills of Munnar, Kalindhi provides a seamless experience for travelers to plan their perfect getaway.

## 🚀 Key Features

- **Package Discovery**: Browse a variety of tour packages categorized by duration, price, and highlights.
- **User Authentication**: Secure Login and Signup functionality using JWT.
- **Booking Management**: Easy-to-use booking interface for selecting travel dates, number of people, and preferred transport.
- **Smooth Navigation**: User-friendly single-page application (SPA) with smooth scrolling to key sections like Packages and Contact.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, ensuring a great experience on both mobile and desktop.

## 🛠️ Tech Stack

### Frontend
- **React.js**: A library for building interactive user interfaces.
- **Vite**: A fast build tool for modern web development.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Router**: For handling client-side routing.

### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building RESTful APIs.
- **MySQL**: Relational database for storing user data, packages, and bookings.
- **JWT (JSON Web Tokens)**: Used for secure user authentication.
- **Bcrypt.js**: For hashing and securing user passwords.

## 📂 Project Structure

- `src/`: Contains the frontend React application.
  - `components/`: Reusable UI components (Navbar, Hero, Footer, etc.).
  - `pages/`: Individual pages for Login, Signup, and Booking.
  - `data/`: Local data constants, such as package details.
- `server/`: Contains the Node.js/Express backend.
  - `src/routes/`: API routes for authentication and booking logic.
  - `schema.sql`: Database schema and initial seed data.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server

### Database Setup
1. Create a MySQL database named `kalindhi`.
2. Run the SQL script found in `server/schema.sql` to set up the tables and seed data.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd KalindhiProject
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file and set your DB credentials
   npm run dev
   ```

---
Built with ❤️ for a better Kerala travel experience.
