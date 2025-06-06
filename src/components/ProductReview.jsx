import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const ProductReview = ({ productId, reviews = [], onAddReview }) => {
  const user = useSelector((state) => state.auth.user);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setNewReview(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reviewData = {
        ...newReview,
        productId,
        date: new Date().toISOString(),
        userId: user.id,
        username: user.username
      };

      if (editingReview) {
        // Update existing review
        const updatedReviews = reviews.map(review => 
          review.id === editingReview.id ? { ...reviewData, id: review.id } : review
        );
        localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(updatedReviews));
      } else {
        // Add new review
        await onAddReview(reviewData);
      }

      setNewReview({
        rating: 0,
        title: '',
        comment: '',
        images: []
      });
      setEditingReview(null);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    if (user.role === 'admin' || review.userId === user.id) {
      setEditingReview(review);
      setNewReview({
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        images: review.images || []
      });
      setShowReviewForm(true);
    }
  };

  const handleDeleteReview = (review) => {
    if (user.role === 'admin' || review.userId === user.id) {
      const updatedReviews = reviews.filter(r => r.id !== review.id);
      localStorage.setItem(`product_reviews_${productId}`, JSON.stringify(updatedReviews));
      window.location.reload();
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
        <div className="flex items-center">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-6 w-6 ${
                  star <= averageRating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600">
            {reviews.length > 0
              ? `${averageRating.toFixed(1)} (${reviews.length} đánh giá)`
              : 'Chưa có đánh giá'}
          </span>
        </div>
      </div>

      {!showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Viết đánh giá
        </button>
      )}

      {showReviewForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá mới'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  {star <= (hoveredRating || newReview.rating) ? (
                    <StarIcon className="h-8 w-8 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon className="h-8 w-8 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh (tùy chọn)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border rounded-lg"
            />
            {newReview.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {newReview.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : editingReview ? 'Cập nhật' : 'Gửi đánh giá'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setEditingReview(null);
                setNewReview({
                  rating: 0,
                  title: '',
                  comment: '',
                  images: []
                });
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {review.username || 'Người dùng'}
                  </span>
                </div>
                <h4 className="font-semibold">{review.title}</h4>
              </div>
              {(user.role === 'admin' || review.userId === user.id) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Sửa
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => handleDeleteReview(review)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-4">{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2">
                {review.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`Review ${index + 1} - Image ${imgIndex + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReview; 