import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../store/productSlice';

function AdminProducts() {
  const dispatch = useDispatch();
  const { items: products = [], status, error } = useSelector((state) => state.products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số sản phẩm trên mỗi trang

  // Tính toán số trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Sắp xếp sản phẩm theo ID giảm dần và lấy sản phẩm cho trang hiện tại
  const currentProducts = [...products]
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  // Hàm xử lý chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'

  const validateImageUrl = (url) => {
    try {
      new URL(url);
      const extension = url.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      return validExtensions.includes(extension);
    } catch {
      return false;
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: url
    }));

    if (!url) {
      setErrors(prev => ({
        ...prev,
        image: 'Image URL is required'
      }));
      setImagePreview(null);
      return;
    }

    if (!validateImageUrl(url)) {
      setErrors(prev => ({
        ...prev,
        image: 'Please enter a valid image URL (jpg, jpeg, png, gif, webp)'
      }));
      setImagePreview(null);
      return;
    }

    // Kiểm tra xem URL có trỏ đến ảnh thật không
    const img = new Image();
    img.onload = () => {
      setImagePreview(url);
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    };
    img.onerror = () => {
      setErrors(prev => ({
        ...prev,
        image: 'Invalid image URL or image cannot be loaded'
      }));
      setImagePreview(null);
    };
    img.src = url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, GIF, or WEBP)'
        }));
        return;
      }

      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      // Tạo URL để preview ảnh
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      // Chuyển đổi file thành base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);

      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Kiểm tra price
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (parseFloat(formData.price) > 1000000) {
      newErrors.price = 'Price must be less than 1,000,000';
    }

    // Kiểm tra description
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Kiểm tra category
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.length < 2) {
      newErrors.category = 'Category must be at least 2 characters';
    }

    // Kiểm tra image
    if (!formData.image) {
      newErrors.image = 'Image is required';
    } else if (imageSource === 'url' && !validateImageUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingProduct) {
        dispatch(updateProduct({ ...formData, id: editingProduct.id }));
      } else {
        dispatch(addProduct(formData));
      }
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
      });
      setImagePreview(null);
      setErrors({});
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    });
    setShowAddForm(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId));
    }
  };

  // Cleanup preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingProduct(null);
            setFormData({
              title: '',
              price: '',
              description: '',
              category: '',
              image: '',
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-1/2 h-auto fixed">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className={`mt-2 block w-full rounded-md shadow-sm p-1 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-blue-500`}
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`mt-2 block w-full rounded-md shadow-sm p-1 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-blue-500`}
                  required
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className={`mt-2 block w-full rounded-md shadow-sm p-1 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-blue-500`}
                  required
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <div className="flex space-x-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="url"
                      checked={imageSource === 'url'}
                      onChange={() => {
                        setImageSource('url');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="form-radio"
                    />
                    <span className="ml-2">Image URL</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="upload"
                      checked={imageSource === 'upload'}
                      onChange={() => {
                        setImageSource('upload');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="form-radio"
                    />
                    <span className="ml-2">Upload Image</span>
                  </label>
                </div>

                {imageSource === 'url' ? (
                  <input
                    type="text"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleImageUrlChange}
                    placeholder="Enter image URL"
                    className={`mt-2 block w-full rounded-md shadow-sm p-1 ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    } focus:border-blue-500 focus:ring-blue-500`}
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className={`mt-2 block w-full ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className={`mt-2 block w-full rounded-md shadow-sm p-1 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-blue-500`}
                  rows="3"
                  required
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setErrors({});
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              currentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0">
                        <img
                          className="h-full w-full rounded-full object-cover"
                          src={product.image}
                          alt={product.title}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {product.title || 'No title'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-[150px]">{product.category}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">${product.price}</div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Phần phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-4 bg-gray-50">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts; 