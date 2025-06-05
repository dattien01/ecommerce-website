import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import { Link } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Sắp xếp sản phẩm theo rating từ cao đến thấp
  const topRatedProducts = [...products]
    .sort((a, b) => {
      const ratingA = a.rating?.rate || 0;
      const ratingB = b.rating?.rate || 0;
      return ratingB - ratingA;
    })
    .slice(0, 4); // Lấy 4 sản phẩm có rating cao nhất

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
          Sản phẩm bán chạy (<span className="font-normal font-serif text-xl blinking-text">Hot</span>)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {topRatedProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between">
              <img src={product.image} alt={product.title} className="w-full h-48 object-contain mb-4" loading="lazy"/>
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