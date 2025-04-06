# SmartCart Streamlit Frontend

This is the Streamlit frontend for the SmartCart application. It provides a user-friendly interface for interacting with the SmartCart backend.

## Features

- User authentication (login/register)
- Chat interface with AI assistant
- Product recommendations
- Shopping cart management
- Checkout functionality

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with your configuration:
```
API_URL=http://localhost:8000
```

## Running the Application

1. Make sure your backend server is running
2. Start the Streamlit application:
```bash
streamlit run app.py
```

The application will be available at http://localhost:8501 