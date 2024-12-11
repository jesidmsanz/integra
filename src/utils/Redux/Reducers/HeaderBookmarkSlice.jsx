import { BookMarkData } from "@/Data/Layout/LayoutData";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmarkedData: [...BookMarkData],
  linkItemsArray: [],
  notification: false,
  flip: false,
  bookmark: false,
  cart: false,
  message: false,
};

const HeaderBookMarkSlice = createSlice({
  name: "HeaderBookMarkSlice",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    setFlip: (state, action) => {
      state.flip = action.payload;
    },
    setBookmark: (state, action) => {
      state.bookmark = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    getLinkItemsArray: (state, action) => {
      state.linkItemsArray = action.payload;
    },
    handleBookmarkChange: (state, action) => {
      if (!action.payload.bookmarked) {
        state.bookmarkedData.push({
          ...action.payload,
          bookmarked: !action.payload.bookmarked,
        });
      } else {
        const tempt = [];
        state.bookmarkedData.forEach((ele) => {
          if (ele.id !== action.payload.id) {
            tempt.push(ele);
          }
        });
        state.bookmarkedData = tempt;
      }
      const temp = [...state.linkItemsArray];
      temp.splice(action.payload.id - 1, 1, {
        ...action.payload,
        bookmarked: !action.payload.bookmarked,
      });
      state.linkItemsArray = temp;
    },
  },
});

export const {
  setNotification,
  setFlip,
  setBookmark,
  setCart,
  setMessage,
  getLinkItemsArray,
  handleBookmarkChange,
} = HeaderBookMarkSlice.actions;

export default HeaderBookMarkSlice.reducer;
