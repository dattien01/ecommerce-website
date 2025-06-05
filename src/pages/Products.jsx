import ProductList from '../components/ProductList';

function Products() {
  return (
    <div className="container max-w-[1280px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Danh sách sản phẩm</h1>
      <ProductList />
    </div>
  );
}

export default Products;