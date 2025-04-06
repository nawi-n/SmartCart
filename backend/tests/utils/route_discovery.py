from typing import List, Dict, Any, Callable
from fastapi import FastAPI
from fastapi.routing import APIRoute
import inspect
from pydantic import BaseModel

def get_all_routes(app: FastAPI) -> List[Dict[str, Any]]:
    """Get all routes from FastAPI app with their details."""
    routes = []
    for route in app.routes:
        if isinstance(route, APIRoute):
            route_info = {
                "path": route.path,
                "methods": route.methods,
                "endpoint": route.endpoint,
                "response_model": route.response_model,
                "dependencies": route.dependencies,
                "tags": route.tags,
                "summary": route.summary,
                "description": route.description,
            }
            routes.append(route_info)
    return routes

def get_route_parameters(route: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Get parameters for a route's endpoint function."""
    params = []
    sig = inspect.signature(route["endpoint"])
    
    for name, param in sig.parameters.items():
        if name not in ["self", "request", "response"]:
            param_info = {
                "name": name,
                "type": param.annotation,
                "default": param.default if param.default != inspect.Parameter.empty else None,
                "required": param.default == inspect.Parameter.empty,
            }
            params.append(param_info)
    
    return params

def generate_test_data(param_type: Any) -> Any:
    """Generate test data based on parameter type."""
    if param_type == str:
        return "test_string"
    elif param_type == int:
        return 42
    elif param_type == float:
        return 3.14
    elif param_type == bool:
        return True
    elif inspect.isclass(param_type) and issubclass(param_type, BaseModel):
        # Generate test data for Pydantic models
        fields = param_type.__fields__
        return {field: generate_test_data(field_info.type_) for field, field_info in fields.items()}
    return None

def create_route_test_cases(route: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Create test cases for a route based on its parameters."""
    test_cases = []
    params = get_route_parameters(route)
    
    # Create a base test case with all required parameters
    base_case = {
        "params": {},
        "body": {},
        "expected_status": 200,
    }
    
    for param in params:
        if param["required"]:
            if param["type"] in [str, int, float, bool]:
                base_case["params"][param["name"]] = generate_test_data(param["type"])
            else:
                base_case["body"][param["name"]] = generate_test_data(param["type"])
    
    test_cases.append(base_case)
    
    # Create test cases for missing required parameters
    for param in params:
        if param["required"]:
            invalid_case = base_case.copy()
            if param["name"] in invalid_case["params"]:
                del invalid_case["params"][param["name"]]
            else:
                del invalid_case["body"][param["name"]]
            invalid_case["expected_status"] = 422  # Validation error
            test_cases.append(invalid_case)
    
    return test_cases

def validate_response(response: Any, route: Dict[str, Any]) -> bool:
    """Validate response against route's response model."""
    if not route["response_model"]:
        return True
    
    try:
        if isinstance(response, dict):
            route["response_model"](**response)
        else:
            route["response_model"](response)
        return True
    except Exception:
        return False 