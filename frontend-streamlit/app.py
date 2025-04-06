import streamlit as st
import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv
import pandas as pd
import plotly.express as px

# Load environment variables
load_dotenv()

# API Configuration
API_URL = os.getenv('API_URL', 'http://localhost:8000')

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'cart' not in st.session_state:
    st.session_state.cart = []
if 'user' not in st.session_state:
    st.session_state.user = None
if 'mood' not in st.session_state:
    st.session_state.mood = "neutral"
if 'persona' not in st.session_state:
    st.session_state.persona = {
        "budget_conscious": 0.5,
        "quality_seeker": 0.5,
        "trend_follower": 0.5,
        "practical_shopper": 0.5
    }

def get_emoji(mood):
    emojis = {
        "happy": "😊",
        "neutral": "😐",
        "sad": "😔",
        "excited": "🤩",
        "frustrated": "😤"
    }
    return emojis.get(mood, "😐")

def update_persona(feedback):
    # Simulate persona evolution based on user feedback
    for trait, value in feedback.items():
        st.session_state.persona[trait] = min(1.0, max(0.0, st.session_state.persona[trait] + value))

def persona_panel():
    st.title("Your Shopping Persona")
    
    # Display persona traits as a radar chart
    df = pd.DataFrame({
        'Trait': list(st.session_state.persona.keys()),
        'Value': list(st.session_state.persona.values())
    })
    
    fig = px.line_polar(df, r='Value', theta='Trait', line_close=True)
    st.plotly_chart(fig)
    
    # Mood selector
    st.subheader("Current Mood")
    mood = st.select_slider(
        "How are you feeling today?",
        options=["sad", "neutral", "happy", "excited", "frustrated"],
        value=st.session_state.mood,
        format_func=lambda x: f"{get_emoji(x)} {x.capitalize()}"
    )
    st.session_state.mood = mood

def login():
    st.title("Login")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    
    if st.button("Login"):
        try:
            response = requests.post(f"{API_URL}/api/auth/login", 
                                  json={"username": username, "password": password})
            if response.status_code == 200:
                st.session_state.user = response.json()
                st.success("Login successful!")
                st.experimental_rerun()
            else:
                st.error("Invalid credentials")
        except Exception as e:
            st.error(f"Error: {str(e)}")

def register():
    st.title("Register")
    username = st.text_input("Username")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    
    if st.button("Register"):
        try:
            response = requests.post(f"{API_URL}/api/auth/register", 
                                  json={"username": username, "email": email, "password": password})
            if response.status_code == 200:
                st.success("Registration successful! Please login.")
                st.experimental_rerun()
            else:
                st.error("Registration failed")
        except Exception as e:
            st.error(f"Error: {str(e)}")

def chat_interface():
    st.title("Smart Cart Assistant")
    
    # Display current mood
    st.write(f"Current Mood: {get_emoji(st.session_state.mood)} {st.session_state.mood.capitalize()}")
    
    # Chat messages display
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])
    
    # Voice search simulation
    if st.button("🎤 Start Voice Search"):
        st.info("Voice search simulation: Please type your query instead")
    
    # Chat input
    if prompt := st.chat_input("What would you like to know?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.write(prompt)
        
        # Get AI response
        try:
            response = requests.post(f"{API_URL}/api/chat/messages/", 
                                  json={
                                      "message": prompt,
                                      "sender": "user",
                                      "mood": st.session_state.mood,
                                      "persona": st.session_state.persona
                                  })
            if response.status_code == 200:
                ai_response = response.json()["response"]
                st.session_state.messages.append({"role": "assistant", "content": ai_response})
                with st.chat_message("assistant"):
                    st.write(ai_response)
            else:
                st.error("Failed to get response from AI")
        except Exception as e:
            st.error(f"Error: {str(e)}")

def product_recommendations():
    st.title("Product Recommendations")
    
    try:
        response = requests.get(f"{API_URL}/api/recommendations/", 
                             params={
                                 "mood": st.session_state.mood,
                                 "persona": json.dumps(st.session_state.persona)
                             })
        if response.status_code == 200:
            recommendations = response.json()
            
            for rec in recommendations:
                with st.expander(f"Recommended: {rec['product_name']}"):
                    st.image(rec['image_url'], width=200)
                    st.write(f"Price: ${rec['price']}")
                    st.write(f"Match Score: {rec['match_score']}%")
                    st.write(f"Explanation: {rec['explanation']}")
                    
                    # Display storytelling
                    st.write("**Why this might be perfect for you:**")
                    st.write(rec['storytelling'])
                    
                    # Feedback for persona evolution
                    st.write("**Was this recommendation helpful?**")
                    col1, col2 = st.columns(2)
                    with col1:
                        if st.button("👍", key=f"like_{rec['product_id']}"):
                            update_persona({"quality_seeker": 0.1, "trend_follower": 0.1})
                    with col2:
                        if st.button("👎", key=f"dislike_{rec['product_id']}"):
                            update_persona({"quality_seeker": -0.1, "trend_follower": -0.1})
                    
                    if st.button(f"Add to Cart", key=f"add_{rec['product_id']}"):
                        add_to_cart(rec['product_id'])
        else:
            st.error("Failed to get recommendations")
    except Exception as e:
        st.error(f"Error: {str(e)}")

def shopping_cart():
    st.title("Shopping Cart")
    
    if not st.session_state.cart:
        st.write("Your cart is empty")
    else:
        total = 0
        for item in st.session_state.cart:
            col1, col2, col3 = st.columns([3, 1, 1])
            with col1:
                st.write(item['name'])
            with col2:
                st.write(f"${item['price']}")
            with col3:
                if st.button("Remove", key=f"remove_{item['id']}"):
                    remove_from_cart(item['id'])
            total += item['price']
        
        st.write(f"Total: ${total}")
        
        if st.button("Checkout"):
            checkout()

def add_to_cart(product_id):
    try:
        response = requests.post(f"{API_URL}/api/cart/items/", 
                              json={"product_id": product_id},
                              headers={"Authorization": f"Bearer {st.session_state.user['access_token']}"})
        if response.status_code == 200:
            st.success("Added to cart!")
            st.experimental_rerun()
        else:
            st.error("Failed to add to cart")
    except Exception as e:
        st.error(f"Error: {str(e)}")

def remove_from_cart(item_id):
    try:
        response = requests.delete(f"{API_URL}/api/cart/items/{item_id}",
                                headers={"Authorization": f"Bearer {st.session_state.user['access_token']}"})
        if response.status_code == 200:
            st.success("Removed from cart!")
            st.experimental_rerun()
        else:
            st.error("Failed to remove from cart")
    except Exception as e:
        st.error(f"Error: {str(e)}")

def checkout():
    try:
        response = requests.post(f"{API_URL}/api/cart/checkout/",
                              headers={"Authorization": f"Bearer {st.session_state.user['access_token']}"})
        if response.status_code == 200:
            st.success("Checkout successful!")
            st.session_state.cart = []
            st.experimental_rerun()
        else:
            st.error("Checkout failed")
    except Exception as e:
        st.error(f"Error: {str(e)}")

def main():
    st.sidebar.title("Navigation")
    
    if st.session_state.user is None:
        page = st.sidebar.radio("Go to", ["Login", "Register"])
        if page == "Login":
            login()
        else:
            register()
    else:
        page = st.sidebar.radio("Go to", ["Persona", "Chat", "Recommendations", "Cart", "Logout"])
        
        if page == "Persona":
            persona_panel()
        elif page == "Chat":
            chat_interface()
        elif page == "Recommendations":
            product_recommendations()
        elif page == "Cart":
            shopping_cart()
        elif page == "Logout":
            st.session_state.user = None
            st.session_state.messages = []
            st.session_state.cart = []
            st.session_state.mood = "neutral"
            st.session_state.persona = {
                "budget_conscious": 0.5,
                "quality_seeker": 0.5,
                "trend_follower": 0.5,
                "practical_shopper": 0.5
            }
            st.experimental_rerun()

if __name__ == "__main__":
    main() 