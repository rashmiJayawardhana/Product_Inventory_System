# Product Inventory System

## Overview

The Product Inventory System is a full-stack web application built using React JS, Tailwind CSS, Python (Django), and MongoDB. This project enables users to efficiently manage product inventory. 

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
- **SweetAlert2 for Alerts:** Used for displaying confirmation and notification alerts.
- **React Icons for UI Enhancements:** Icons are implemented using React Icons for a better user interface.

## Screenshots

### Item List Page
![Screenshot (27)](https://github.com/user-attachments/assets/ef2760b4-4153-4e3e-853f-cfd36bf15c09)

### Add Item Page
![Screenshot (28)](https://github.com/user-attachments/assets/a336dcd0-e7ad-4d4a-8563-9bb2c86035f5)

## Tech Stack

- **Frontend:** React JS, Tailwind CSS, Vite
- **Backend:** Python, Django, Django REST Framework
- **Database:** MongoDB

## Project Structure

```
PRODUCT_INVENTORY_SYSTEM/
│── .venv/                     # Virtual environment for backend dependencies
│── item_service/               # Backend folder (Django API)
│   │── api/                    # Contains API-related modules
│   │── item_service/           # Main Django service configuration
│   │── manage.py               # Django project management script
│
│── item_web/                   # Frontend folder (React + Vite)
│   │── node_modules/           # Dependencies for frontend
│   │── public/                 # Static assets like images and icons
│   │── src/                    # Source code for React components
│   │── .gitignore              # Files to be ignored in Git
│   │── eslint.config.js        # ESLint configuration for code linting
│   │── index.html              # Main HTML file for React
│   │── package-lock.json       # Dependency lock file
│   │── package.json            # Project dependencies and scripts
│   │── README.md               # Frontend-specific documentation
│   │── vite.config.js          # Vite configuration file
│
│── README.md                   # Project-wide documentation
```

### Libraries & Tools Used

The project utilizes the following libraries:

- **[SweetAlert2](https://sweetalert2.github.io/):**  
  Used for displaying alert messages, confirmations, and success notifications.

- **[React Icons](https://react-icons.github.io/react-icons/):**  
  Used for adding scalable vector icons to the UI.
  
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

## Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1. **Fork the repository**
2. **Create a new branch:**  
   ```sh
   git checkout -b feature-name
   ```
3. **Make your changes and commit:**  
   ```sh
   git commit -m "Added new feature"
   ```
4. **Push to your branch:**  
   ```sh
   git push origin feature-name
   ```
5. **Open a Pull Request**

---

⭐ **Star this repository** if you found this project useful!  
📢 **Have suggestions?** Feel free to create an issue! 🚀


