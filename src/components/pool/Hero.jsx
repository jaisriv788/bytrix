import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import videoBg from "../../assets/v3.mp4";
import contractAbi from "../../contractAbi.json";
import erc20Abi from "../../erc20Abi.json";
import useEthers from "../../hooks/useEthers";
import { ethers, formatUnits } from "ethers";
import { useNotification } from "../../hooks/useNotification";
import { useParams } from "react-router";
import { CircleQuestionMark } from "lucide-react";

function Hero({ showModal, setUserStats, setData }) {
  const defaultPlans = [
    { name: "12 Hours", clicked: true, percentage: 0.1, planId: 1, fees: 1, min: 1, max: 10 },
    { name: "1 Day", clicked: false, percentage: 0.3, planId: 2, fees: 1, min: 10, max: 250 },
    { name: "7 Days", clicked: false, percentage: 3, planId: 3, fees: 1, min: 50, max: 1000 },
    { name: "14 Days", clicked: false, percentage: 7.5, planId: 4, fees: 1, min: 50, max: 5000 },
    { name: "30 Days", clicked: false, percentage: 20, planId: 5, fees: 1, min: 100, max: 10000 },
  ];

  const [dataBox, setDataBox] = useState(defaultPlans);

  const { ref } = useParams();
  const [amount, setAmount] = useState("");
  const [selectedBox, setSelectedBox] = useState(defaultPlans[0]);
  const [usdtValue, setUsdtValue] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [baseAmount, setBaseAmount] = useState("0.00");
  const [feeAmount, setFeeAmount] = useState("0.00");
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [loader, setLoader] = useState(false);

  const { showSuccess, showError } = useNotification();
  const isConnected = useSelector((state) => state.user.isConnected);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const USDTAddress = useSelector((state) => state.user.USDTAddress);
  const contractAddress = useSelector((state) => state.user.contractAddress);
  const companyWalletAddress = useSelector(
    (state) => state.user.companyWalletAddress
  );

  const { signer } = useEthers();

  useEffect(() => {
    const circulationAmount =
      parseFloat(amount || 0) + ((amount || 0) * selectedBox.percentage) / 100;
    setUsdtValue(circulationAmount);
  }, [amount, selectedBox]);

  useEffect(() => {
    const getPrice = async () => {
      try {
        setBalanceLoading(true);
        const provider = new ethers.JsonRpcProvider(
          "https://data-seed-prebsc-1-s1.binance.org:8545/"
        );

        const contract = new ethers.Contract(USDTAddress, erc20Abi, provider);
        const ctr = new ethers.Contract(contractAddress, contractAbi, provider);

        const balance = await contract.balanceOf(walletAddress);
        const decimals = await contract.decimals();
        const formatted = formatUnits(balance, decimals);
        setUsdtBalance(formatted);

        const data1 = await ctr.getUserDepositIds(walletAddress);
        const intArray = data1.map((x) => Number(x));
        setData(intArray);

        const data2 = await ctr.getUserStats(walletAddress);
        const formattedStats = data2.map((v, i) =>
          i > 2 ? formatUnits(v, 18) : v.toString()
        );
        setUserStats(formattedStats);
      } catch (error) {
        console.log(error)
        showError("Something went wrong while fetching the balance.");
      } finally {
        setBalanceLoading(false);
      }
    };

    isConnected ? getPrice() : setUsdtBalance(0);
  }, [isConnected, refetch]);

  // 🔹 Handle duration box click
  const handleClick = (index) => {
    const newData = dataBox.map((item, i) => ({
      ...item,
      clicked: i === index,
    }));
    setDataBox(newData);
    setSelectedBox(newData[index]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleModelSubmit = async () => {
    try {
      if (amount < 1) {
        showError("Amount Is Less Than 1!");
        return;
      }
      if (
        ref &&
        ref.toString().toLowerCase() === walletAddress.toString().toLowerCase()
      ) {
        showError("Referrer and investor cannot be the same.");
        return;
      }

      setLoader(true);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const planid = selectedBox?.planId;
      const fee = selectedBox?.fees;
      const feeIsApplicable = await contract.hasPaidPlan(walletAddress, planid);

      if (!feeIsApplicable) {
        setFeeAmount(fee);
      } else {
        setFeeAmount(0.0);
      }

      setBaseAmount(amount);
      const total = (!feeIsApplicable ? parseFloat(fee) : 0) + parseFloat(amount);
      setTotalAmount(total);
      setShowModel(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (amount < 1) {
        showError("Amount Is Less Than 1!");
        return;
      }

      const refrealAddress = ref ? ref : companyWalletAddress;

      if (!ethers.isAddress(refrealAddress)) {
        showError("Wrong Referral Link Or Address!");
        return;
      }
      console.log(typeof amount, typeof selectedBox?.max, typeof selectedBox?.min)
      if (parseFloat(amount) < selectedBox.min || parseFloat(amount) > selectedBox.max) {
        showError("Enter the amount within the limits!");
        return
      }

      setLoading(true);
      const tokenContract = new ethers.Contract(USDTAddress, erc20Abi, signer);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const planid = selectedBox?.planId;
      const fee = selectedBox?.fees;
      const feeIsApplicable = await contract.hasPaidPlan(walletAddress, planid);

      const addedAmount = String(parseFloat(amount) + fee);
      const originalAmount = ethers.parseUnits(amount, 18);
      const value = ethers.parseUnits(
        feeIsApplicable ? amount : addedAmount,
        18
      );

      const tx = await tokenContract.approve(contractAddress, value);
      await tx.wait();
      // console.log(planid, originalAmount, refrealAddress)
      const tx2 = await contract.invest(planid, originalAmount, refrealAddress, {
        gasLimit: 500000,
      });
      await tx2.wait();

      setRefetch((prev) => !prev);
      showSuccess("Transaction Successful!");
    } catch (error) {
      console.log(error);
      showError("Transaction Failed");
    } finally {
      // ✅ Reset everything properly
      setLoading(false);
      setAmount("");
      setDataBox(defaultPlans);
      setSelectedBox(defaultPlans[0]);
      setShowModel(false);
    }
  };

  const handleDeposite = async () => {
    try {
      setProcessing(true);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      const tx = await contract.processMaturedDeposits(50);
      await tx.wait();
    } catch (error) {
      console.log(error);
      showError("Process Mature Deposit Failed!");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col gap-7 pb-15 items-center  overflow-hidden px-2">
      {/* 🎥 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Confirm Modal */}
      {showModel && (
        <div
          onClick={() => {
            if (loading) return;
            setShowModel(false);
          }}
          className="absolute bg-black/50 backdrop-blur-sm z-10 inset-0 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black px-5 py-3 rounded-lg"
          >
            <div className="font-bold">
              Are You Sure? You want to Continue.
            </div>
            <div className="font-semibold mt-3 flex justify-between">
              <span>Base amount</span>
              <span>${parseFloat(baseAmount).toFixed(2)}</span>
            </div>
            <div className="font-semibold flex justify-between">
              <span>Fee amount</span>
              <span>${parseFloat(feeAmount).toFixed(2)}</span>
            </div>
            <div className="font-semibold flex justify-between">
              <span>Total amount</span>
              <span>${parseFloat(totalAmount).toFixed(2)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || processing}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/80 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
            >
              {loading || processing ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex font-bold mt-30 text-3xl items-center gap-2 z-0">
        <div className="w-15 h-15 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="#00BFFF" />
            <polygon
              points="100,30 65,100 115,100 70,170 130,105 85,105"
              fill="#00FFFF"
            />
          </svg>
        </div>
        <span className="bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
          Bytrix One
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-slate-700/90 backdrop-blur-sm rounded-xl px-3 py-5 w-full max-w-xl shadow-lg">
        <span className="text-2xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
          Circulation
        </span>

        {/* Amount input */}
        <div>
          <div className="flex justify-between mt-3">
            <span className="font-semibold">Amount</span>
            <span>
              <span className="text-gray-400">Balance</span>{" "}
              {balanceLoading ? "0.0000" : parseFloat(usdtBalance).toFixed(4)} -
              USDT
            </span>
          </div>

          <div className="bg-slate-600 focus-within:bg-gradient-to-tr focus-within:from-[#00BFFF] focus-within:to-[#00FFFF] p-1 mt-2 rounded-xl">
            <div className="flex gap-2 px-2 bg-slate-600 rounded-lg items-center">
              <input
                value={amount}
                onChange={handleInputChange}
                disabled={loading}
                className="flex-1 border-none py-2.5 focus:outline-none text-lg focus:text-[#00FFFF] font-semibold bg-transparent"
                type="number"
                placeholder="Enter Amount"
              />
              <button
                onClick={() => {
                  let floored =
                    Math.floor(parseFloat(usdtBalance) * 10000) / 10000;
                  setAmount(floored.toFixed(4));
                }}
                className="bg-white h-fit text-black px-2 rounded cursor-pointer hover:bg-white/70 transition ease-in-out duration-300"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        {/* Duration options */}
        <div>
          <div className="flex justify-between mt-3">
            <span className="font-semibold">Duration</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {dataBox.map((item, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`p-1 min-w-25 ${item.clicked
                  ? "bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF]"
                  : "bg-slate-500"
                  } cursor-pointer rounded-full`}
              >
                <div
                  className={`px-3 py-2 font-semibold rounded-full text-center ${!item.clicked && "bg-slate-500"
                    }`}
                >
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between mt-3">
            <span className="font-semibold flex items-center gap-2 relative">
              Minimum Limit
            </span>

            <span>
              <span className="text-gray-400 font-bold">
                {selectedBox?.min.toFixed(2)}
              </span>{" "}
              - USDT
            </span>
          </div>
          <div className="flex justify-between mt-3">
            <span className="font-semibold flex items-center gap-2 relative">
              Maximum Limit
            </span>

            <span>
              <span className="text-gray-400 font-bold">
                {selectedBox?.max.toFixed(2)}
              </span>{" "}
              - USDT
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <span className="font-semibold flex items-center gap-2 relative">
            One Time Fees
            <div className="group relative flex items-center">
              <CircleQuestionMark
                size={15}
                className="cursor-pointer text-gray-300"
              />
              <div className="w-50 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-5 py-3 rounded-lg shadow-lg z-10">
                This fee is only applicable when you are investing in the
                selected plan for the first time.
              </div>
            </div>
          </span>

          <span>
            <span className="text-gray-400 font-bold">
              {selectedBox?.fees ? selectedBox.fees.toFixed(2) : "0.00"}
            </span>{" "}
            - USDT
          </span>
        </div>

        {/* Fees & Buttons */}
        <div className="mb-1">
          <div className="flex justify-between mt-3">
            {dataBox.map(
              (item, index) =>
                item.clicked && (
                  <span key={index} className="font-semibold">
                    {item.name} (Total Receving Amount)
                  </span>
                )
            )}
            <span>
              <span className="text-gray-400 font-bold">
                ~{usdtValue ? parseFloat(usdtValue).toFixed(4) : "0.0000"}
              </span>{" "}
              - USDT
            </span>
          </div>



          {isConnected ? (
            <button
              onClick={handleModelSubmit}
              disabled={loader}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/80 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
            >
              {loader ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Submit"
              )}
            </button>
          ) : (
            <button
              onClick={() => showModal(true)}
              className="bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/90 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
            >
              Connect Wallet
            </button>
          )}

          {isConnected &&
            walletAddress === "0x6Fdd0f90e8D74e876c59FC24d044E9f2bAE13b53" && (
              <button
                onClick={handleDeposite}
                disabled={loading || processing}
                className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/80 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
              >
                {loading || processing ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Process Mature Deposit"
                )}
              </button>
            )}

          {loading && (
            <div className="text-center mt-3 font-bold text-red-400">
              Please Do Not Close The Tab!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
