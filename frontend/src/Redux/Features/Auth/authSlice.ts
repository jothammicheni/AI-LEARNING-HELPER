import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { toast } from 'react-toastify'; 
import { authService } from './authService';
import { UserData } from '../DataTypes';
import axios from 'axios';

const initialState = {
    isLoggedIn: false, 
    user: null,
    users: [],    
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
};

// async thunk for registration
export const register = createAsyncThunk<unknown, UserData>(
  'auth/register',
  async (userData, thunkApi) => {
      try {
          return await authService.register(userData);
      } catch (error) {
          let message: string;

          if (axios.isAxiosError(error) && error.response) {
              message = error.response.data?.message || error.message;
          } else if (error instanceof Error) {
              message = error.message;
          } else {
              message = 'An unknown error occurred';
          }
          
          return thunkApi.rejectWithValue(message);
      }
  }
);

export const login = createAsyncThunk<unknown, UserData>(
  'auth/login',
  async (userData, thunkApi) => {
      try {
          return await authService.loginuser(userData);
      } catch (error) {
          let message: string;

          if (axios.isAxiosError(error) && error.response) {
              message = error.response.data?.message || error.message;
          } else if (error instanceof Error) {
              message = error.message;
          } else {
              message = 'An unknown error occurred';
          }
          
          return thunkApi.rejectWithValue(message);
      }
  }
);

export const loginStatus = createAsyncThunk<boolean>(
  'auth/loginStatus',
  async (_, thunkApi) => {
      try {
          const response = await authService.loginStatus();
          return response;
      } catch (error) {
          let message: string;

          if (axios.isAxiosError(error) && error.response) {
              message = error.response.data?.message || error.message;
          } else if (error instanceof Error) {
              message = error.message;
          } else {
              message = 'An unknown error occurred';
          }
          
          return thunkApi.rejectWithValue(message);
      }
  }
);

export const googleAuthLogin = createAsyncThunk(
  'auth/googleLogin',
  async (_, thunkApi) => {
      try {
          return await authService.googleLogin();
      } catch (error) {
          let message: string;
          if (axios.isAxiosError(error) && error.response) {
              message = error.response.data?.message || error.message;
          } else if (error instanceof Error) {
              message = error.message;
          } else {
              message = 'An unknown error occurred';
          }
          return thunkApi.rejectWithValue(message);
      }
  }
);

export const logout = createAsyncThunk<unknown>(
  'auth/logout',
  async (_, thunkApi) => {
      try {
          return await authService.logOutUser();
      } catch (error) {
          let message: string;

          if (axios.isAxiosError(error) && error.response) {
              message = error.response.data?.message || error.message;
          } else if (error instanceof Error) {
              message = error.message;
          } else {
              message = 'An unknown error occurred';
          }
          
          return thunkApi.rejectWithValue(message);
      }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      RESET(state) {
        state.isError = false;
        state.isLoading = false;
        state.isSuccess = false;        
        state.message = '';
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(register.fulfilled, (state) => {
          state.isLoading = false;
          state.isError = false;
          state.isLoggedIn = true;
          state.isSuccess = true;
          toast.success('Registration Successful');
        })
        .addCase(register.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isLoggedIn = false;
          toast.error(`Registration Failed: ${action.payload}`);
        })
        // login user
        .addCase(login.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(login.fulfilled, (state) => {
          state.isLoading = false;
          state.isError = false;
          state.isLoggedIn = true;
          state.isSuccess = true;
          toast.success('Login Successful');
        })
        .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isLoggedIn = false;
          toast.error(`Login Failed: ${action.payload}`);
        })
        // get login status
        .addCase(loginStatus.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(loginStatus.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isLoggedIn = action.payload;
          state.isSuccess = true;
        })
        .addCase(loginStatus.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isLoggedIn = false;
          toast.error(`Error Checking Login Status: ${action.payload}`);
        })
        // logout user
        .addCase(logout.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(logout.fulfilled, (state) => {
          state.isLoading = false;
          state.isError = false;
          state.isLoggedIn = false;
          state.isSuccess = true;
          toast.success('Logout Successful');
        })
        .addCase(logout.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
          toast.error('Logout Failed');
        })

        //Login with google
        .addCase(googleAuthLogin.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(googleAuthLogin.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isLoggedIn = true;
          state.user = action.payload;
          toast.success('Google Login Successful');
      })
      .addCase(googleAuthLogin.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          toast.error(`Google Login Failed: ${action.payload}`);
      });
        ;
    }
});

export const { RESET } = authSlice.actions;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export default authSlice.reducer;
