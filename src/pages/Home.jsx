import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

function Home() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const [productsWithReviews, setProductsWithReviews] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Tính toán điểm đánh giá trung bình cho mỗi sản phẩm
    const productsWithRatings = products.map(product => {
      const savedReviews = localStorage.getItem(`product_reviews_${product.id}`);
      const reviews = savedReviews ? JSON.parse(savedReviews) : [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
        : 0;
      
      return {
        ...product,
        averageRating,
        reviewCount: reviews.length
      };
    });

    // Sắp xếp sản phẩm theo điểm đánh giá từ cao đến thấp
    const sortedProducts = [...productsWithRatings]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 4); // Lấy 4 sản phẩm có đánh giá cao nhất

    setProductsWithReviews(sortedProducts);
  }, [products]);

  if (status === 'loading') {
    return <p className="text-center text-gray-500">Đang tải sản phẩm...</p>;
  }

  if (status === 'failed') {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container max-w-[1280px] mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Chào mừng đến với E-commerce</h1>
        <p className="text-gray-600">Khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
      </div>
      
      <div className="mb-8">
        <h2 className="flex justify-end px-4 items-center font-serif text-lg">
          Sản phẩm được đánh giá cao (<span className="font-normal font-serif text-xl blinking-text">Hot</span>)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {productsWithReviews.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between">
              <img src={product.image} alt={product.title} className="w-full h-48 object-contain mb-4" loading="lazy"/>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-gray-600 mb-2">${product.price}</p>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= product.averageRating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.reviewCount > 0 
                    ? `${product.averageRating.toFixed(1)} (${product.reviewCount})`
                    : 'Chưa có đánh giá'}
                </span>
              </div>
              <Link
                to={`/products/${product.id}`}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;