import Cart from '../components/Cart';

function CartPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Giỏ hàng</h1>
      <Cart />
    </div>
  );
}

export default CartPage;