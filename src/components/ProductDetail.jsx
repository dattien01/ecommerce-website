import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct));
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  return (
    <div className="container max-w-[1280px] mx-auto p-4">
      {loading && <p className="text-gray-500 text-center">Đang tải...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {selectedProduct && !loading && !error && (
        <div className="flex flex-col md:flex-row gap-6 ">
          <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full md:w-1/2 h-96 object-contain" loading="lazy" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <p className="text-lg font-semibold mb-4">${selectedProduct.price}</p>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;