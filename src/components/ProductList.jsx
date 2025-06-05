import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from './ProductCard';

function ProductList() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const productsPerCategory = 4;
  const [categoryPages, setCategoryPages ] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Nhóm sản phẩm theo category và sắp xếp theo mới nhất
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Sắp xếp sản phẩm trong mỗi danh mục theo ID (giả sử ID mới hơn sẽ lớn hơn)
  Object.keys(productsByCategory).forEach(category => {
    productsByCategory[category].sort((a, b) => b.id - a.id);
  });

  // Lấy danh sách danh mục duy nhất
  const categories = ['all', ...new Set(products.map((product) => product.category))];

  // Khởi tạo state trang cho mỗi danh mục
  useEffect(() => {
    const initialPages = {};
    Object.keys(productsByCategory).forEach(category => {
      initialPages[category] = 1;
    });
    setCategoryPages(initialPages);
  }, [products]);

  // Lọc sản phẩm theo danh mục được chọn và phân trang
  const getPagedProducts = (category, products) => {
    const currentPage = categoryPages[category] || 1;
    const start = (currentPage - 1) * productsPerCategory;
    const end = start + productsPerCategory;
    return products.slice(start, end);
  };

  const filteredProductsByCategory =
    selectedCategory === 'all'
      ? Object.fromEntries(
          Object.entries(productsByCategory).map(([category, products]) => [
            category,
            getPagedProducts(category, products)
          ])
        )
      : {
          [selectedCategory]: getPagedProducts(
            selectedCategory,
            productsByCategory[selectedCategory] || []
          )
        };

  const handlePageChange = (category, page) => {
    setCategoryPages(prev => ({
      ...prev,
      [category]: page
    }));
  };

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container max-w-[1280px] mx-auto p-4">
      <select
        name="items"
        id="items"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === 'all' ? 'All' : category}
          </option>
        ))}
      </select>

      {Object.keys(filteredProductsByCategory).length === 0 ? (
        <p className="text-gray-500 text-center">Không có sản phẩm trong danh mục này.</p>
      ) : (
        <div>
          {Object.keys(filteredProductsByCategory).map((category) => {
            const totalPages = Math.ceil(
              (productsByCategory[category] || []).length / productsPerCategory
            );
            
            return (
              <div key={category} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold capitalize">{category}</h3>
                  <Link 
                    to={`/category/${category}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProductsByCategory[category].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(category, index + 1)}
                        className={`px-3 py-1 rounded ${
                          categoryPages[category] === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductList;