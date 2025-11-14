import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  walletAddress: null,
  refresher: false,
  USDTAddress: "0xf78a55db9391e9b689734ba3e45c1c3a5535a857", //testnet
  contractAddress: "0xbFc2a31aF9ff26C3f698d262eE476Fd9DCE53730",
  savingContractAddress: "0x902e8eADfa72818dc834Da03681d8C29AfFDB587",
  leaseConstractAddress: "0x235394a7206719fd29fb4e0520db5822e65fc2a6",
  companyWalletAddress: "0x6Fdd0f90e8D74e876c59FC24d044E9f2bAE13b53",
  referrer: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setConnection: (state, action) => {
      state.isConnected = action.payload;
    },
    refresh: (state, action) => {
      state.refresher = action.payload;
    },
    setReferrer: (state, action) => {
      state.referrer = action.payload;
    },
  },
});

export const { setAddress, setConnection, refresh, setReferrer } =
  userSlice.actions;
export default userSlice.reducer;
