# SmartCart - AI-Powered Personalized E-Commerce

SmartCart is a multi-agent system that delivers hyper-personalized product recommendations using advanced AI and machine learning techniques. The system consists of three intelligent agents working together to understand customer behavior, analyze products, and provide tailored recommendations.

## Features

- 🤖 Multi-agent architecture (Customer, Product, and Recommendation Agents)
- 🧠 Gemini AI-powered persona generation and product profiling
- 🎯 Hyper-personalized product recommendations
- 📊 Explainable AI for transparent recommendations
- 😊 Mood-based dynamic suggestions
- 📖 AI-generated product storytelling
- 🔄 Continuous learning from customer feedback

## System Architecture

The system is built using:
- FastAPI for the backend
- Google's Gemini API for AI capabilities
- SQLite for data persistence
- Modern RESTful API design

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SmartCart.git
cd SmartCart
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
- Copy `.env.example` to `.env`
- Add your Gemini API key to the `.env` file

5. Run the application:
```bash
uvicorn src.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

- `POST /api/v1/customer/persona` - Generate customer persona
- `POST /api/v1/product/profile` - Generate product profile
- `POST /api/v1/recommendations` - Get personalized recommendations
- `POST /api/v1/recommendations/explain` - Get recommendation explanation
- `POST /api/v1/recommendations/mood` - Get mood-based recommendations
- `POST /api/v1/product/story` - Generate product story
- `POST /api/v1/recommendations/feedback` - Update recommendation based on feedback

## Data Structure

### Customer Data
- CustomerID
- Name
- Age
- Gender
- Location
- BrowsingHistory
- PurchaseHistory
- PreferredCategories

### Product Data
- ProductID
- ProductName
- Category
- Price
- Rating
- Description
- Features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API
- FastAPI
- SQLAlchemy
- All contributors and supporters 