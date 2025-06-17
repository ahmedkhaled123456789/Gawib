import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import useInsertData from "../../hooks/useInsertData";
import { useInsUpdateData } from "../../hooks/useUpdateData";
import useDeleteData from "../../hooks/useDeleteData";
import { useGetDataToken } from "../../hooks/useGetData";

// Product Interface
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// State Interface
interface ProductState {
  products: IProduct[] | null;
  oneProduct: IProduct | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: null,
  oneProduct: null,
  loading: false,
  error: null,
};

// ========================== Create Product ==========================
export const addProduct = createAsyncThunk<IProduct, Partial<IProduct>>(
  "product/addProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await useInsertData("/api/products", data);
      return res as IProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      return rejectWithValue("Failed to add product");
    }
  }
);

// ========================== Get All Products ==========================
export const getProducts = createAsyncThunk<IProduct[]>(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await useGetDataToken("/products?productType=digital");
      return res as IProduct[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue("Failed to fetch products");
    }
  }
);

// ========================== Get Single Product ==========================
export const getProduct = createAsyncThunk<IProduct, string>(
  "product/getProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await useGetDataToken(`/api/products/${id}`);
      return res as IProduct;
    } catch (error) {
      console.error("Error fetching product:", error);
      return rejectWithValue("Failed to fetch product");
    }
  }
);

// ========================== Update Product ==========================
export const updateProduct = createAsyncThunk<
  IProduct,
  { id: string; formData: Partial<IProduct> }
>("product/updateProduct", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await useInsUpdateData(`/api/products/${id}`, formData);
    return res.data as IProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    return rejectWithValue("Failed to update product");
  }
});

// ========================== Delete Product ==========================
export const deleteProduct = createAsyncThunk<string, string>(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await useDeleteData(`/api/products/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting product:", error);
      return rejectWithValue("Failed to delete product");
    }
  }
);

// ========================== Create Slice ==========================
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        if (state.products) {
          state.products.push(action.payload);
        } else {
          state.products = [action.payload];
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get All Products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Single Product
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        state.oneProduct = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        if (state.products) {
          state.products = state.products.map((product) =>
            product._id === action.payload._id ? action.payload : product
          );
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (state.products) {
          state.products = state.products.filter((product) => product._id !== action.payload);
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
