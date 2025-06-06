import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-xl mb-4">Giỏ hàng của bạn đang trống. 
          <svg className='max-h-[100px] max-w-[100px] mx-auto p-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32L360 32l0 102.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-64 64c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L312 32 120.1 32C111 12.8 91.6 0 69.5 0L24 0zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/></svg>
        </p>
      ) : (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border p-4 rounded shadow">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-contain mr-4" loading="lazy"/>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold">Tổng cộng: ${totalPrice.toFixed(2)}</h3>
            {/* <button className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600">
              Thanh toán
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;