import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { StarIcon } from '@heroicons/react/24/solid';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = localStorage.getItem(`product_reviews_${product.id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [product.id]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="group border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-center object-cover group-hover:opacity-75"
        />
      </div>
      <div className="flex-grow">
        <h3 className="mt-4 text-sm text-gray-700 line-clamp-2">{product.title}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= averageRating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {reviews.length > 0 
              ? `${averageRating.toFixed(1)} (${reviews.length})`
              : 'Chưa có đánh giá'}
          </span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center font-medium text-sm"
        >
          Xem chi tiết
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductCard;