import { useState } from "react";
import { useSelector } from "react-redux";
import contractAbi from "../../savingAbi.json";
import erc20Abi from "../../erc20Abi.json";
import useEthers from "../../hooks/useEthers";
import { ethers } from "ethers";
import { useNotification } from "../../hooks/useNotification";
import { useParams } from "react-router";

function Form({ showModal }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(""); // <-- track input amount

  const { showSuccess, showError } = useNotification();

  const { ref } = useParams();

  const isConnected = useSelector((state) => state.user.isConnected);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const USDTAddress = useSelector((state) => state.user.USDTAddress);
  const contractAddress = useSelector((state) => state.user.savingContractAddress);
  const companyWalletAddress = useSelector(
    (state) => state.user.companyWalletAddress
  );

  const { signer } = useEthers();

  const handleSubmit = async () => {
    try {
      if (!signer) {
        showError("Please connect your wallet first.");
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        showError("Amount must be greater than 0!");
        return;
      }

      if (ref && ref.toLowerCase() == walletAddress.toLowerCase()) {
        {
          showError("Referrer and investor can not be same.");
          return;
        }
      }

      const referralAddress =
        ref && ethers.isAddress(ref) ? ref : companyWalletAddress;

      if (!ethers.isAddress(referralAddress)) {
        showError("Invalid referral address!");
        return;
      }

      setLoading(true);
      const tokenContract = new ethers.Contract(USDTAddress, erc20Abi, signer);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      const value = ethers.parseUnits(amount, 18);
      const MaxUint256 = ethers.MaxUint256;
      const tx = await tokenContract.approve(contractAddress, value);
      await tx.wait();
      const tx2 = await contract.investSaving(value, referralAddress, {
        gasLimit: 300000,
      });
      await tx2.wait();

      showSuccess(`Successfully invested ${amount} USDT into the Saving Box!`);
      setAmount("");
    } catch (error) {
      console.error(error);
      showError("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="max-w-xl rounded-3xl p-0.5 w-full bg-gradient-to-tr from-[#0afcb3] via-[#0891e0] to-[#08e7d5]">
        <div className="bg-black p-5 rounded-3xl flex flex-col gap-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
            Saving Box Investment
          </h2>

          <div className="bg-slate-600 p-1 rounded-xl">
            <div className="flex gap-2 px-2 bg-slate-600 rounded-lg items-center">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="flex-1 border-none py-2.5 focus:outline-none text-lg focus:text-[#00FFFF] font-semibold bg-transparent"
                type="number"
                placeholder="Enter amount (USDT)"
              />
            </div>
          </div>

          {isConnected ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/80 
              cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Invest Now"
              )}
            </button>
          ) : (
            <button
              onClick={() => { showModal(true); }}
              className="bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/90 
              cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Form;
