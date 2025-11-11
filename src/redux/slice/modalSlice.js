import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showErrorModal: false,
  showSuccessModal: false,
  message: "",
};

const modalSlice = createSlice({
  name: "show_modal",
  initialState,
  reducers: {
    isSuccessModalVisible: (state, action) => {
      state.showSuccessModal = action.payload;
    },
    isErrorModalVisible: (state, action) => {
      state.showErrorModal = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { isSuccessModalVisible, isErrorModalVisible, setMessage } =
  modalSlice.actions;
export default modalSlice.reducer;
