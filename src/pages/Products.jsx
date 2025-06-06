import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';
import SearchFilter from '../components/SearchFilter';

function Products() {
  const dispatch = useDispatch();
  const { items = [], status, error } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);
  // Update filtered products when items change
  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
      setFilteredProducts(items);
    }
  }, [items]);

  const handleFilterChange = (filters) => {
    if (!Array.isArray(items) || items.length === 0) return;
    
    let result = [...items];

    // Lọc theo từ khóa
    if (filters.keyword) {
      result = result.filter(product =>
        (product.title || '').toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (filters.category && filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }

    // Lọc theo khoảng giá
    if (filters.minPrice) {
      result = result.filter(product => product.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(product => product.price <= Number(filters.maxPrice));
    }

    // Lọc theo trạng thái còn hàng
    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    // Sắp xếp sản phẩm
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    setFilteredProducts(result);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Có lỗi xảy ra: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách sản phẩm</h1>
      
      <SearchFilter onFilterChange={handleFilterChange} />

      {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Không tìm thấy sản phẩm nào phù hợp với bộ lọc
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;