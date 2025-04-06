from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create customers table
    op.create_table(
        'customers',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create customer_personas table
    op.create_table(
        'customer_personas',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('customer_id', sa.String(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=True),
        sa.Column('gender', sa.String(), nullable=True),
        sa.Column('interests', sa.JSON(), nullable=True),
        sa.Column('psychographic_traits', sa.JSON(), nullable=True),
        sa.Column('behavioral_patterns', sa.JSON(), nullable=True),
        sa.Column('purchase_history', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create customer_behaviors table
    op.create_table(
        'customer_behaviors',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('customer_id', sa.String(), nullable=False),
        sa.Column('viewed_products', sa.JSON(), nullable=True),
        sa.Column('time_spent', sa.Integer(), nullable=True),
        sa.Column('search_history', sa.JSON(), nullable=True),
        sa.Column('category_interests', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create customer_moods table
    op.create_table(
        'customer_moods',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('customer_id', sa.String(), nullable=False),
        sa.Column('mood', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create products table
    op.create_table(
        'products',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('brand', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('features', sa.JSON(), nullable=True),
        sa.Column('unique_selling_points', sa.JSON(), nullable=True),
        sa.Column('price_point', sa.String(), nullable=True),
        sa.Column('quality_level', sa.String(), nullable=True),
        sa.Column('mood_tags', sa.JSON(), nullable=True),
        sa.Column('story', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create recommendations table
    op.create_table(
        'recommendations',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('customer_id', sa.String(), nullable=False),
        sa.Column('product_id', sa.String(), nullable=False),
        sa.Column('psychographic_match', sa.Float(), nullable=True),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create chat_history table
    op.create_table(
        'chat_history',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('customer_id', sa.String(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('response', sa.Text(), nullable=False),
        sa.Column('context', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_customers_id', 'customers', ['id'])
    op.create_index('ix_customer_personas_customer_id', 'customer_personas', ['customer_id'])
    op.create_index('ix_customer_behaviors_customer_id', 'customer_behaviors', ['customer_id'])
    op.create_index('ix_customer_moods_customer_id', 'customer_moods', ['customer_id'])
    op.create_index('ix_products_id', 'products', ['id'])
    op.create_index('ix_recommendations_customer_id', 'recommendations', ['customer_id'])
    op.create_index('ix_recommendations_product_id', 'recommendations', ['product_id'])
    op.create_index('ix_chat_history_customer_id', 'chat_history', ['customer_id'])

def downgrade():
    # Drop indexes
    op.drop_index('ix_chat_history_customer_id')
    op.drop_index('ix_recommendations_product_id')
    op.drop_index('ix_recommendations_customer_id')
    op.drop_index('ix_products_id')
    op.drop_index('ix_customer_moods_customer_id')
    op.drop_index('ix_customer_behaviors_customer_id')
    op.drop_index('ix_customer_personas_customer_id')
    op.drop_index('ix_customers_id')

    # Drop tables
    op.drop_table('chat_history')
    op.drop_table('recommendations')
    op.drop_table('products')
    op.drop_table('customer_moods')
    op.drop_table('customer_behaviors')
    op.drop_table('customer_personas')
    op.drop_table('customers') 