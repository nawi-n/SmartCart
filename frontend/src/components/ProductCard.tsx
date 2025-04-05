import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  category,
  imageUrl,
}: ProductCardProps) => {
  return (
    <div className="card group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-xl bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <svg
              className="h-12 w-12 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            <Link to={`/products/${id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {name}
            </Link>
          </h3>
          <p className="text-lg font-medium text-primary-600">${price.toFixed(2)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{category}</p>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
      <div className="card-footer">
        <Link
          to={`/products/${id}`}
          className="btn btn-primary w-full"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 