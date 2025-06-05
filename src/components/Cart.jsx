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
        <p className="text-gray-500 text-center">Giỏ hàng của bạn đang trống.</p>
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
            <button className="bg-blue-500 text-white px-6 py-2 rounded mt-4 hover:bg-blue-600">
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;