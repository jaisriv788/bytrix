import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  walletAddress: null,
  refresher: false,
  USDTAddress: "0xd1b7916d20F3b9D439B66AF25FC45f6A28c157d0",
  BtxAddress: "0xcda698886c3Ab092531Ae8ce477eF46CD9cA4D9D",
  contractAddress: "0xFe3039741Bac9F107Ee5EF8d55a0a9BbF1837572",
  savingContractAddress: "0x7751cCef575C389FA44674e2fb51d2F755fF1543",
  leaseConstractAddress: "0xBA44B2D68536035e6e019E68584570E3Ed084905",
  companyWalletAddress: "0xcb79720F6C6155cd8e56f34DA5BBc33ba6C53E8e",
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
