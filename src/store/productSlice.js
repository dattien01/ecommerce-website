import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Action bất đồng bộ để lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (__, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(`Lỗi server: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc khởi động lại json-server.');
      } else {
        return rejectWithValue(`Lỗi: ${error.message}`);
      }
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      // Lấy danh sách sản phẩm hiện tại
      const productsResponse = await axios.get(`${API_URL}/products`);
      const products = productsResponse.data;
      
      // Tạo ID mới dạng "001", "002",...
      const maxId = products.length > 0 
        ? Math.max(...products.map(p => parseInt(p.id))) 
        : 0;
      const newId = String(maxId + 1).padStart(3, '0');

      // Thêm ID vào sản phẩm mới
      const newProduct = {
        ...product,
        id: newId
      };

      const response = await axios.post(`${API_URL}/products`, newProduct);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(`Lỗi thêm sản phẩm: ${error.response.data}`);
      } else if (error.request) {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc khởi động lại json-server.');
      } else {
        return rejectWithValue(`Lỗi: ${error.message}`);
      }
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/products/${product.id}`, product);
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return rejectWithValue(`Không tìm thấy sản phẩm với ID: ${product.id}`);
        }
        return rejectWithValue(`Lỗi cập nhật sản phẩm: ${error.response.data}`);
      } else if (error.request) {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc khởi động lại json-server.');
      } else {
        return rejectWithValue(`Lỗi: ${error.message}`);
      }
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      return productId;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return rejectWithValue(`Không tìm thấy sản phẩm với ID: ${productId}`);
        }
        return rejectWithValue(`Lỗi xóa sản phẩm: ${error.response.data}`);
      } else if (error.request) {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc khởi động lại json-server.');
      } else {
        return rejectWithValue(`Lỗi: ${error.message}`);
      }
    }
  }
);

// Action bất đồng bộ để lấy chi tiết sản phẩm
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      if (!response.data) {
        return rejectWithValue(`Không tìm thấy sản phẩm với ID: ${productId}`);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return rejectWithValue(`Không tìm thấy sản phẩm với ID: ${productId}`);
        }
        return rejectWithValue(`Lỗi server: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        return rejectWithValue('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc khởi động lại json-server.');
      } else {
        return rejectWithValue(`Lỗi: ${error.message}`);
      }
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.items = [];
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (product) => product.id !== action.payload
        );
      });

    // Xử lý fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;