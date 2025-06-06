import React, { useState, useEffect } from 'react';

function ModalCheckout({ open, onClose, onSuccess, cartItems }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    coupon: '',
    paymentMethod: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 10; // Free shipping for orders over $100
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount with coupon
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        note: '',
        coupon: '',
        paymentMethod: 'cod'
      });
      setErrors({});
      setCouponApplied(false);
      setShowConfirm(false);
    }
  }, [open]);

  useEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
  }, []);

  const saveCurrentAddress = () => {
    const newAddress = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    setErrors(prev => ({ ...prev, saveAddress: 'Đã lưu địa chỉ thành công!' }));
    setTimeout(() => {
      setErrors(prev => ({ ...prev, saveAddress: '' }));
    }, 3000);
  };

  const fillWithSavedAddress = (address) => {
    setForm(prev => ({
      ...prev,
      name: address.name,
      email: address.email,
      phone: address.phone,
      address: address.address
    }));
    setShowSavedAddresses(false);
  };

  const deleteSavedAddress = (id) => {
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== id);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    // Address validation
    if (!form.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplyCoupon = () => {
    if (form.coupon.toLowerCase() === 'discount10') {
      setCouponApplied(true);
      setErrors(prev => ({ ...prev, coupon: '' }));
      // Show success message
      setErrors(prev => ({ ...prev, couponSuccess: 'Đã áp dụng mã giảm giá 10%!' }));
      // Clear success message after 3 seconds
      setTimeout(() => {
        setErrors(prev => ({ ...prev, couponSuccess: '' }));
      }, 3000);
    } else {
      setCouponApplied(false);
      setErrors(prev => ({ ...prev, coupon: 'Mã giảm giá không hợp lệ' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Show confirmation dialog
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess({
        ...form,
        subtotal,
        shippingFee,
        discount,
        total,
        items: cartItems
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: `Có lỗi xảy ra: ${error.message || 'Vui lòng thử lại'}` }));
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const Notification = ({ type, message }) => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };

    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg border ${styles[type]} animate-fade-in`}>
        {icons[type]}
        <span className="text-sm">{message}</span>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-300 scrollbar-track-gray-200">
        <button
          className="absolute top-2 right-2 text-gray-900 hover:text-red-700 text-3xl transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Thanh toán</h2>
        
        {errors.submit && <Notification type="error" message={errors.submit} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded p-2 transition-colors duration-200 ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.name && <Notification type="error" message={errors.name} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded p-2 transition-colors duration-200 ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.email && <Notification type="error" message={errors.email} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border rounded p-2 transition-colors duration-200 ${
                errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.phone && <Notification type="error" message={errors.phone} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`w-full border rounded p-2 transition-colors duration-200 ${
                errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              rows="2"
            />
            {errors.address && <Notification type="error" message={errors.address} />}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 transition-colors duration-200 focus:border-blue-500"
              rows="2"
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mã giảm giá</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="coupon"
                value={form.coupon}
                onChange={handleChange}
                className={`flex-1 border rounded p-2 transition-colors duration-200 ${
                  errors.coupon ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="Nhập mã giảm giá"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Áp dụng
              </button>
            </div>
            {errors.coupon && <Notification type="error" message={errors.coupon} />}
            {errors.couponSuccess && <Notification type="success" message={errors.couponSuccess} />}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Địa chỉ đã lưu</h3>
              <button
                type="button"
                onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                {showSavedAddresses ? 'Ẩn địa chỉ' : 'Xem địa chỉ đã lưu'}
              </button>
            </div>

            {showSavedAddresses && (
              <div className="space-y-2">
                {savedAddresses.map(address => (
                  <div key={address.id} className="border rounded p-3 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{address.name}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600">{address.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fillWithSavedAddress(address)}
                          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                        >
                          Sử dụng
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSavedAddress(address.id)}
                          className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {savedAddresses.length === 0 && (
                  <p className="text-gray-500 text-sm">Chưa có địa chỉ nào được lưu</p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={saveCurrentAddress}
              className="mt-2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              Lưu địa chỉ này
            </button>
            {errors.saveAddress && <Notification type="success" message={errors.saveAddress} />}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="text-blue-500"
                />
                <div>
                  <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                  <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={form.paymentMethod === 'banking'}
                  onChange={handleChange}
                  className="text-blue-500"
                />
                <div>
                  <span className="font-medium">Chuyển khoản ngân hàng</span>
                  <p className="text-sm text-gray-500">Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={form.paymentMethod === 'momo'}
                  onChange={handleChange}
                  className="text-blue-500"
                />
                <div>
                  <span className="font-medium">Ví MoMo</span>
                  <p className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="font-semibold text-lg mb-2">Tóm tắt đơn hàng</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">Tổng:</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                  {shippingFee === 0 ? 'Miễn phí' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá (10%):</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
              {shippingFee > 0 && (
                <p className="text-sm text-gray-500 italic">
                  * Miễn phí vận chuyển cho đơn hàng trên $100
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </form>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-scale-in">
              <h3 className="text-xl font-bold mb-4">Xác nhận thanh toán</h3>
              <p className="mb-4">Bạn có chắc chắn muốn thanh toán đơn hàng này?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalCheckout; 