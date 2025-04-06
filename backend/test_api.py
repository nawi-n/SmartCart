import requests
import json

def test_api():
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    print("Testing health endpoint...")
    response = requests.get(f"{base_url}/health")
    print(f"Health check status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test products endpoint
    print("\nTesting products endpoint...")
    response = requests.get(f"{base_url}/api/products/")
    print(f"Products endpoint status: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Error response: {response.text}")

if __name__ == "__main__":
    test_api() 