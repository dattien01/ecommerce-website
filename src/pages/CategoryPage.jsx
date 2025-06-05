import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';

function CategoryPage() {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categoryProducts = products.filter(
    (product) => product.category === categoryName
  );

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container max-w-[1280px] mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 capitalize">{categoryName}</h2>
      {categoryProducts.length === 0 ? (
        <p className="text-gray-500 text-center">Không có sản phẩm trong danh mục này.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage; 