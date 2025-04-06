from typing import Dict, Any, Optional
import time
from ..database.models import Product
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class ProductCache:
    def __init__(self, ttl: int = 3600):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl  # Time to live in seconds
        self.last_cleanup = time.time()

    def _cleanup_expired(self):
        """Remove expired cache entries"""
        current_time = time.time()
        if current_time - self.last_cleanup > self.ttl:
            expired_keys = [
                key for key, value in self.cache.items()
                if current_time - value['timestamp'] > self.ttl
            ]
            for key in expired_keys:
                del self.cache[key]
            self.last_cleanup = current_time

    def get(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get product from cache if not expired"""
        self._cleanup_expired()
        
        if product_id in self.cache:
            cached_data = self.cache[product_id]
            if time.time() - cached_data['timestamp'] <= self.ttl:
                return cached_data['data']
            del self.cache[product_id]
        return None

    def set(self, product_id: str, data: Dict[str, Any]):
        """Store product in cache"""
        self.cache[product_id] = {
            'data': data,
            'timestamp': time.time()
        }

    def update_from_db(self, product: Product):
        """Update cache with product from database"""
        product_data = {
            'id': product.id,
            'name': product.name,
            'brand': product.brand,
            'category': product.category,
            'description': product.description,
            'price': product.price,
            'features': product.features,
            'unique_selling_points': product.unique_selling_points,
            'price_point': product.price_point,
            'quality_level': product.quality_level,
            'mood_tags': product.mood_tags,
            'story': product.story,
            'image_url': product.image_url
        }
        self.set(product.id, product_data)

    def invalidate(self, product_id: str):
        """Remove product from cache"""
        if product_id in self.cache:
            del self.cache[product_id]

    def clear(self):
        """Clear entire cache"""
        self.cache.clear()
        self.last_cleanup = time.time()

# Create a singleton instance
product_cache = ProductCache() 