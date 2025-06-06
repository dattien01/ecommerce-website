import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function SearchFilter({ onFilterChange }) {
  const products = useSelector((state) => state.products.items);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    inStock: false,
  });

  const [categories, setCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const uniqueCategories = ['all', ...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories);
    } else {
      setCategories(['all']);
    }
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      keyword: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStock: false,
    });
    onFilterChange({
      keyword: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      inStock: false,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tìm kiếm theo từ khóa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              name="keyword"
              value={searchParams.keyword}
              onChange={handleInputChange}
              placeholder="Nhập tên sản phẩm..."
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Lọc theo danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="category"
              value={searchParams.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tất cả' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp theo
            </label>
            <select
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="name_asc">Tên A-Z</option>
              <option value="name_desc">Tên Z-A</option>
            </select>
          </div>

          {/* Nút mở rộng bộ lọc */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-700"
            >
              {isExpanded ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
            </button>
          </div>

          {/* Bộ lọc nâng cao */}
          {isExpanded && (
            <>
              {/* Khoảng giá */}
              <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá tối thiểu
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={searchParams.minPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá tối đa
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={searchParams.maxPrice}
                    onChange={handleInputChange}
                    placeholder="1000000"
                    min="0"
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Chỉ hiện sản phẩm còn hàng */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={searchParams.inStock}
                    onChange={handleInputChange}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Chỉ hiện sản phẩm còn hàng</span>
                </label>
              </div>
            </>
          )}

          {/* Nút tìm kiếm và reset */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchFilter; 