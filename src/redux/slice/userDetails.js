import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
  walletAddress: null,
  refresher: false,
  USDTAddress: "0xf78a55db9391e9b689734ba3e45c1c3a5535a857", //testnet
  BtxAddress: "0x623A217Ad73C4E3C150A407100dFEdC775566657", //testnet
  contractAddress: "0x55D6F7900E7f09a0A31Be7c75E3516708B59D120",
  savingContractAddress: "0xc8db1BB544342FDb0f5C3Ec8B10db7e0757181df",
  leaseConstractAddress: "0xeaf436bE0A65747CCdbE25a07E80fB1F5AF04C05",
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
