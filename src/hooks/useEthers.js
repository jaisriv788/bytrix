import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setConnection, refresh } from "../redux/slice/userDetails";
import { useNotification } from "./useNotification";

export default function useEthers() {
  const [provider, setProvider] = useState(null);
  const [provider2, setProvider2] = useState(null);

  const [signer, setSigner] = useState(null);
  const detectedRef = useRef([]);

  const dispatch = useDispatch();
  const isConnected = useSelector((state) => state.user.isConnected);
  const isRefreshed = useSelector((state) => state.user.refresher);

  const { showSuccess, showError } = useNotification();

  const CHAIN_PARAMS = {
    chainId: "0x420A8",
    chainName: "AnghChain Mainnet",
    nativeCurrency: { name: "ANGH", symbol: "ANGH", decimals: 18 },
    rpcUrls: ["https://rpc.anghscan.org/"],
    blockExplorerUrls: ["https://anghscan.org/"],
  };

  // const CHAIN_PARAMS = {
  //   chainId: "0x38",
  //   chainName: "Binance Smart Chain Mainnet",
  //   nativeCurrency: {
  //     name: "BNB",
  //     symbol: "BNB",
  //     decimals: 18
  //   },
  //   rpcUrls: ["https://bsc-dataseed.binance.org/"],
  //   blockExplorerUrls: ["https://bscscan.com/"],
  // };

  // const CHAIN_PARAMS = {
  //   chainId: "0x61",
  //   chainName: "Binance Smart Chain Testnet",
  //   nativeCurrency: {
  //     name: "BNB",
  //     symbol: "BNB",
  //     decimals: 18,
  //   },
  //   rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  //   blockExplorerUrls: ["https://testnet.bscscan.com/"],
  // };

  const switchNetwork = async (prov) => {
    if (!prov?.request) return;
    try {
      await prov.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_PARAMS.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await prov.request({
          method: "wallet_addEthereumChain",
          params: [CHAIN_PARAMS],
        });
      } else {
        throw error;
      }
    }
  };

  const initProvider = (injectedProvider) => {
    const newProvider = new ethers.BrowserProvider(injectedProvider);
    setProvider(newProvider);
    return newProvider;
  };

  const connectWallet = async (wallet) => {
    try {
      const activeProvider = wallet?.provider
        ? initProvider(wallet.provider)
        : window.ethereum
        ? initProvider(window.ethereum)
        : null;
      if (!activeProvider) throw new Error("No provider found");

      // Switch network safely
      try {
        await switchNetwork(wallet.provider || window.ethereum);
      } catch (error) {
        console.error("Switch network failed:", error);
      }

      // Request accounts safely
      let accounts = [];
      if (window.ethereum && window.ethereum.isSafePal) {
        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      } else {
        accounts = await activeProvider.send("eth_requestAccounts", []);
      }

      if (!accounts || accounts.length === 0)
        throw new Error("No accounts found");

      const newSigner = await activeProvider.getSigner();
      setSigner(newSigner);

      dispatch(setAddress(accounts[0]));
      sessionStorage.setItem("walletId", wallet.info.uuid);
      sessionStorage.setItem("walletName", wallet.info.name);
      dispatch(setConnection(true));
      showSuccess("Wallet Connected!");

      // Listen for account changes
      if (wallet.provider?.on) {
        wallet.provider.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            sessionStorage.removeItem("walletId");
            dispatch(setConnection(false));
            dispatch(setAddress(null));
          } else {
            dispatch(refresh(!isRefreshed));
            dispatch(setAddress(accounts[0]));
          }
        });
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      showError("Wallet Connection Failed!");
    }
  };

  useEffect(() => {
    if (!isConnected) return;
    const walletId = sessionStorage.getItem("walletId");
    const walletName = sessionStorage.getItem("walletName");

    const handler = (event) => detectedRef.current.push(event.detail);

    window.addEventListener("eip6963:announceProvider", handler);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    const tryRestore = async () => {
      let providerInstance = detectedRef.current.find(
        (item) => item.info.name === walletName
      );

      if (!providerInstance) {
        // alert("not present");
        try {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);
          const newSigner = await newProvider.getSigner();
          setSigner(newSigner);
          const accounts = await newProvider.listAccounts();
          if (accounts.length > 0) dispatch(setAddress(accounts[0].address));
        } catch (error) {
          console.log(error);
        }
      }

      if (isConnected && walletId && providerInstance) {
        // alert("present");

        try {
          const newProvider = new ethers.BrowserProvider(
            providerInstance.provider
          );
          setProvider(newProvider);
          const newSigner = await newProvider.getSigner();
          setSigner(newSigner);
          setProvider2(providerInstance.provider);
          const accounts = await newProvider.listAccounts();
          if (accounts.length > 0) dispatch(setAddress(accounts[0].address));
        } catch {
          dispatch(setConnection(false));
          dispatch(setAddress(null));
          sessionStorage.removeItem("walletId");
        }
      }
    };

    setTimeout(tryRestore, 500);
    return () =>
      window.removeEventListener("eip6963:announceProvider", handler);
  }, [isConnected, dispatch]);

  return { provider, provider2, signer, connectWallet };
}
