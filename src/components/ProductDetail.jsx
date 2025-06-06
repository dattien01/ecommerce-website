import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import ProductReview from './ProductReview';
import Toast from './Toast';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    // Fetch product details
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setSelectedImage(data.image);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setToastMessage('Có lỗi xảy ra khi tải thông tin sản phẩm');
        setToastType('error');
        setShowToast(true);
      });

    // Load reviews from localStorage
    const savedReviews = localStorage.getItem(`product_reviews_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity
      }));
      setToastMessage('Đã thêm sản phẩm vào giỏ hàng');
      setToastType('success');
      setShowToast(true);
    }
  };

  const handleAddReview = async (review) => {
    try {
      const newReview = {
        ...review,
        id: Date.now(),
        productId: id,
        date: new Date().toISOString()
      };

      // Update reviews in state
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);

      // Save to localStorage
      localStorage.setItem(`product_reviews_${id}`, JSON.stringify(updatedReviews));

      setToastMessage('Đánh giá của bạn đã được gửi thành công');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error adding review:', error);
      setToastMessage('Có lỗi xảy ra khi gửi đánh giá');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[product.image, ...product.images || []].map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                  selectedImage === image ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-gray-700">Số lượng:</label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <ProductReview
          productId={id}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </div>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default ProductDetail;