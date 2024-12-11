import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideBarOn: false,
  isFilter: false,
  listView: false,
  colClass: "col-xl-3 col-sm-6 xl-4",
  filter: {
    brand: ["Diesel", "Hudson", "Lee", "Levis", "Spykar", "Denien"],
    color: "",
    value: { min: 10, max: 100 },
    sortBy: "",
    searchBy: "",
    category: [
      "Dream Beauty Fashion",
      "Men's Shirt",
      "Men's Jacket",
      "Woman T-shirt",
    ],
  },
};

const FilterSlice = createSlice({
  name: "FilterSlice",
  initialState,
  reducers: {
    filterGender: (state, action) => {
      state.filter.category.push(action.payload);
    },
    removeGender: (state, action) => {
      state.filter.category = state.filter.category.filter(
        (category) => category !== action.payload
      );
    },
    addNewBrand: (state, action) => {
      state.filter.brand.push(action.payload);
    },
    removeBrand: (state, action) => {
      state.filter.brand.splice(action.payload.index, 1);
      state.filter = { ...state.filter, brand: action.payload.category };
    },
    setIsFilter: (state) => {
      state.isFilter = !state.isFilter;
    },
    setSideBarOn: (state) => {
      state.sideBarOn = !state.sideBarOn;
    },
    setListView: (state, action) => {
      state.listView = action.payload;
    },
    setColView: (state, action) => {
      state.colClass = action.payload;
    },
    filterSearchBy: (state, action) => {
      state.filter = { ...state.filter, searchBy: action.payload };
    },
    filterColor: (state, action) => {
      state.filter = { ...state.filter, color: action.payload };
    },
    filterSortBy: (state, action) => {
      state.filter = { ...state.filter, sortBy: action.payload };
    },
    filterPrice: (state, action) => {
      state.filter = {
        ...state.filter,
        value: { min: action.payload[0], max: action.payload[1] },
      };
    },
  },
});

export const {
  setSideBarOn,
  filterColor,
  filterPrice,
  filterSortBy,
  filterSearchBy,
  setIsFilter,
  setListView,
  setColView,
  filterGender,
  removeGender,
  addNewBrand,
  removeBrand,
} = FilterSlice.actions;

export default FilterSlice.reducer;
