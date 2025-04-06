from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from typing import Any, Dict
import logging

logger = logging.getLogger(__name__)

class APIError(Exception):
    def __init__(self, status_code: int, message: str, details: Dict[str, Any] = None):
        self.status_code = status_code
        self.message = message
        self.details = details or {}

async def error_handler(request: Request, exc: Exception) -> JSONResponse:
    if isinstance(exc, APIError):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.message,
                    "details": exc.details
                }
            }
        )
    
    elif isinstance(exc, RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "message": "Validation Error",
                    "details": exc.errors()
                }
            }
        )
    
    elif isinstance(exc, SQLAlchemyError):
        logger.error(f"Database error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": "Database Error",
                    "details": "An error occurred while accessing the database"
                }
            }
        )
    
    else:
        logger.error(f"Unexpected error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": "Internal Server Error",
                    "details": "An unexpected error occurred"
                }
            }
        ) 