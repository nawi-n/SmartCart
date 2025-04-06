import pandas as pd
from typing import List, Dict, Any
import os

class ProductService:
    def __init__(self):
        self.data_path = os.path.join(os.path.dirname(__file__), '../../data/product_recommendation_data.csv')
        self.products = self._load_products()

    def _load_products(self) -> pd.DataFrame:
        """Load products from CSV file"""
        try:
            df = pd.read_csv(self.data_path)
            # Clean and transform data
            df = df.dropna(subset=['Product_ID', 'Category', 'Price'])
            df['Price'] = df['Price'].astype(float)
            df['Product_Rating'] = df['Product_Rating'].fillna(0)
            return df
        except Exception as e:
            print(f"Error loading products: {e}")
            return pd.DataFrame()

    def get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products with formatted data"""
        products = []
        for _, row in self.products.iterrows():
            product = {
                'id': row['Product_ID'],
                'name': f"{row['Brand']} {row['Subcategory']}",
                'description': f"{row['Category']} - {row['Subcategory']}",
                'price': float(row['Price']),
                'category': row['Category'],
                'subcategory': row['Subcategory'],
                'brand': row['Brand'],
                'rating': float(row['Product_Rating']),
                'image': f"/images/products/{row['Product_ID']}.jpg"  # Placeholder image path
            }
            products.append(product)
        return products

    def get_products_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get products filtered by category"""
        filtered_df = self.products[self.products['Category'] == category]
        return self._format_products(filtered_df)

    def get_product_by_id(self, product_id: str) -> Dict[str, Any]:
        """Get a single product by ID"""
        product = self.products[self.products['Product_ID'] == product_id]
        if not product.empty:
            return self._format_products(product)[0]
        return {}

    def _format_products(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Format products from DataFrame to list of dictionaries"""
        products = []
        for _, row in df.iterrows():
            product = {
                'id': row['Product_ID'],
                'name': f"{row['Brand']} {row['Subcategory']}",
                'description': f"{row['Category']} - {row['Subcategory']}",
                'price': float(row['Price']),
                'category': row['Category'],
                'subcategory': row['Subcategory'],
                'brand': row['Brand'],
                'rating': float(row['Product_Rating']),
                'image': f"/images/products/{row['Product_ID']}.jpg"  # Placeholder image path
            }
            products.append(product)
        return products 