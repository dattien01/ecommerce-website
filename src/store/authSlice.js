import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = 'http://localhost:3001';
// Action bất đồng bộ để đăng nhập
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.get('/db.json');
    const users = response.data.users;
    const user = users.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Action bất đồng bộ để đăng xuất
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});
// Action đăng ký
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    // Kiểm tra username đã tồn tại chưa
    const checkResponse = await axios.get(`${API_URL}/users?username=${userData.username}`);
    if (checkResponse.data.length > 0) {
      return rejectWithValue('Tên đăng nhập đã tồn tại');
    }

    // Kiểm tra email đã tồn tại chưa
    const emailCheck = await axios.get(`${API_URL}/users?email=${userData.email}`);
    if (emailCheck.data.length > 0) {
      return rejectWithValue('Email đã được sử dụng');
    }

    // Lấy danh sách users hiện tại để tạo ID mới
    const usersResponse = await axios.get(`${API_URL}/users`);
    const users = usersResponse.data;
    // const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    const newId = users.length > 0 ? (Math.max(...users.map(u => parseInt(u.id))) + 1).toString() : "1";

    // Tạo user mới với ID được kiểm soát
    const newUser = {
      ...userData,
      id: newId,
      role: 'user' // Mặc định role là user
    };

    const response = await axios.post(`${API_URL}/users`, newUser);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Đăng ký thất bại');
  }
});
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 