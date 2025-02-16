# Product Inventory System

## Overview

The Product Inventory System is a full-stack web application built using React JS, Tailwind CSS, Python (Django), and MongoDB. This project enables users to efficiently manage product inventory, perform CRUD operations, and interact with a REST API seamlessly. Additionally, it includes a React Table with advanced features like searching, sorting, and pagination, ensuring an optimal user experience.

## Features

- **Full Stack Integration:** React JS frontend communicates with a Django backend using RESTful APIs.
- **CRUD Operations:** Users can Create, Read, Update, and Delete products in the inventory.
- **React Table Implementation:**
  - Searching
  - Sorting
  - Pagination
- **User-Friendly UI:** Tailwind CSS provides a modern and responsive design.
- **MongoDB Database:** NoSQL database for flexible and scalable data storage.
- **End-to-End Testing:** Ensures that all features work seamlessly from frontend to backend.

## Tech Stack

- **Frontend:** React JS, Tailwind CSS, Vite
- **Backend:** Python, Django, Django REST Framework
- **Database:** MongoDB

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (for React frontend)
- [Python 3](https://www.python.org/) (for Django backend)
- [MongoDB](https://www.mongodb.com/) (for database)

### Backend Setup

1. Clone the repository:
   ```sh
   git clone <repository_url>
   cd backend
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the Django server:
   ```sh
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```


