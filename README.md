# Patient Dashboard

This is a full-stack web application that displays a dashboard for patients and their upcoming appointments. The system ingests messy CSV data containing patient information and appointments, cleans and normalizes it, and stores it in a database for viewing.

## Tech Stack

  * **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Shadcn, Lucide Icons, Apollo
  * **Backend:** Python, FastAPI, Strawberry GraphQL, SQLAlchemy, SQLite

## Technical Decisions

  * **Data Modeling:** The flat CSV data is normalized into two tables: `patients` and `appointments`
      * Patients and Tables has a one to many relationship. They need to be joined in order to count the number of appointments.
      * An internal id is used as the primary key for a patient. This decouples the application's logic from external data sources as a precaution for messy CSV data and potential duplicate patient_ids.
      * Properties were extracted from the CSV file
  * **Data Validation:** At first, I was trying to use regex for data validation, but later decided to use libraries instead to more reliably validate the many different malformed phone numbers, emails, and dates.
      * **Phone Numbers:** The `phonenumbers` library is used to parse and validate phone numbers, storing them in standard E.164 format. For the sake of mock data, `is_possible_number` is used instead of `is_valid_number` because `is_valid_number` was too strict and only allowed real area codes and phone numbers.
      * **Emails:** The `email_validator` library is used for email validation.
      * **Dates:** The `python-dateutil` library parses multiple date format into a consistent `YYYY-MM-DD` format.

-----

## Getting Started

Follow these instructions to get the project running on your local machine.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Backend Setup:**

    ```bash
    # Navigate to the backend directory
    cd backend

    # Create and activate a virtual environment
    python -m venv venv
    source venv/bin/activate 

    # Install dependencies
    pip install -r requirements.txt

    # Run this script to create the database tables
    python create_db.py 

    # Run this script to ingest the csv
    python ingest_db.py 
    ```

3.  **Frontend Setup:**

    ```bash
    # Navigate to the frontend directory from the project root
    cd frontend

    # Install dependencies
    npm install
    ```

### Running the Application

You'll need two separate terminals to run both the frontend and backend servers.

  * **Terminal 1: Start the Backend**

    ```bash
    # Navigate to the backend directory
    cd backend

    # Activate the virtual environment
    source backend/venv/bin/activate

    # Run the server from the root directory as a module
    uvicorn backend.main:app --reload
    ```

    The backend API will be running at `http://localhost:8000`.

  * **Terminal 2: Start the Frontend**

    ```bash
    # Navigate to the frontend directory
    cd frontend

    # Run the development server
    npm run dev
    ```

    The frontend application will be running at `http://localhost:3000`.
