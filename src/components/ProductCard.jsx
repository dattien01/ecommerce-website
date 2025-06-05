import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-48 object-contain mb-4"
        loading="lazy"
      />
      <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-2">${product.price}</p>
      <div className="flex items-center mb-2">
        <span className="text-yellow-500">★</span>
        <span className="ml-1">
          {product.rating?.rate || 0} ({product.rating?.count || 0} đánh giá)
        </span>
      </div>
      <Link
        to={`/products/${product.id}`}
        className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center font-medium"
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

export default ProductCard;