import Cart from '../components/Cart';
import ModalCheckout from '../components/ModalCheckout';
import Toast from '../components/Toast';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';

function CartPage() {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [openCheckout, setOpenCheckout] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleCheckoutSuccess = (orderData) => {
    // Here you would typically send the order data to your backend
    console.log('Order data:', orderData);
    dispatch(clearCart());
    setOpenCheckout(false);
    showToast('Thanh toán thành công! Cảm ơn bạn đã mua hàng.', 'success');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Chưa có sản phẩm để thanh toán !!!.', 'error');
      return;
    }
    setOpenCheckout(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Giỏ hàng</h1>
      <Cart />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 float-end"
        onClick={handleCheckout}
      >
        Thanh toán
      </button>
      <ModalCheckout
        open={openCheckout}
        onClose={() => setOpenCheckout(false)}
        onSuccess={handleCheckoutSuccess}
        cartItems={cartItems}
      />
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}

export default CartPage;