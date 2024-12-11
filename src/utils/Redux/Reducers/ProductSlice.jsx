import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  filterToggle: false,
  productItem: [],
  symbol: "$",
};

export const fetchProductApiData = createAsyncThunk(
  "/api/productapi",
  async () => {
    const response = await axios.get("/api/productapi");
    return response.data;
  }
);

const ProductSlice = createSlice({
  name: "ProductSlice",
  initialState,
  reducers: {
    setFilterToggle: (state) => {
      state.filterToggle = !state.filterToggle;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductApiData.fulfilled, (state, action) => {
      state.productItem = action.payload;
    });
  },
});

export const { setFilterToggle } = ProductSlice.actions;

export default ProductSlice.reducer;