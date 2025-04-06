from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable
import time
import redis
import os

class RateLimiter:
    def __init__(self, redis_url: str = None):
        self.redis = redis.from_url(redis_url or os.getenv('REDIS_URL', 'redis://localhost:6379'))
        self.rate_limit = 100  # requests per minute
        self.window_size = 60  # seconds

    async def __call__(self, request: Request, call_next: Callable):
        client_ip = request.client.host
        key = f"rate_limit:{client_ip}"
        
        # Get current timestamp
        current_time = int(time.time())
        
        # Get request count for this window
        request_count = self.redis.get(key)
        if request_count is None:
            # First request in window
            self.redis.setex(key, self.window_size, 1)
        else:
            request_count = int(request_count)
            if request_count >= self.rate_limit:
                # Rate limit exceeded
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": {
                            "message": "Rate limit exceeded",
                            "details": f"Please try again in {self.window_size} seconds"
                        }
                    }
                )
            else:
                # Increment request count
                self.redis.incr(key)
        
        # Process request
        response = await call_next(request)
        return response

# Initialize rate limiter
rate_limiter = RateLimiter() 