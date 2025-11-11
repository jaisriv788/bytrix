import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import contractAbi from "../../contractAbi.json";
import useEthers from "../../hooks/useEthers";
import { ethers, } from "ethers";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { useNotification } from "../../hooks/useNotification";

function SavingBox() {
  const navigate = useNavigate();
  const [boxIds, setBoxIds] = useState([]);
  const [loadingClaim, setLoadingClaim] = useState(false);
  // const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [refetch, setRefetch] = useState(false);
  const { showSuccess, showError } = useNotification();

  const isConnected = useSelector((state) => state.user.isConnected);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const contractAddress = useSelector((state) => state.user.contractAddress);
  const referrer = useSelector((state) => state.user.referrer)

  const { signer } = useEthers();

  useEffect(() => {
    const fetchBoxIds = async () => {
      if (!isConnected || !walletAddress) return;

      try {
        const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);
        const ids = await contract.getUserBoxIds(walletAddress);
        // console.log("ids",ids);
        const parsedIds = ids.map(id => Number(id));
        // console.log("User Box IDs:", parsedIds);
        setBoxIds(parsedIds);

        const stakes = await Promise.all(
          parsedIds.map(async id => {
            const stake = await contract.boxStakes(id);
            return {
              id,
              owner: stake.owner,
              amount: Number(ethers.formatUnits(stake.amount, 18)),
              startTime: Number(stake.startTime),
              lastClaimTime: Number(stake.lastClaimTime),
              unstaked: stake.unstaked
            };
          })
        );

        console.log("Box Stakes:", stakes);
      } catch (err) {
        console.error(err);
        showError("Failed to load user boxes");
      }
    };

    fetchBoxIds();
  }, [isConnected, walletAddress, refetch]);

  const handleRewardSubmit = async (boxId) => {
    try {
      if (!signer) {
        showError("Please connect your wallet first.");
        return;
      }

      if (!boxId || boxIds.length === 0) {
        showError("No active boxes found for this wallet.");
        return;
      }
      console.log(typeof boxId);
      setLoadingClaim(true);
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const stake = await contract.boxStakes(boxId);
      const owner = stake.owner.toLowerCase();
      const user = walletAddress.toLowerCase();
      const amount = ethers.formatUnits(stake.amount, 18);
      const lastClaimTime = Number(stake.lastClaimTime);
      const unstaked = stake.unstaked;
      if (owner !== user) {
        showError("You are not the owner of this box.");
        setLoadingClaim(false);
        return;
      }
      if (unstaked) {
        showError("This box is already unstaked.");
        setLoadingClaim(false);
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      if (now - lastClaimTime < 60) {
        showError("Please wait before claiming interest again.");
        setLoadingClaim(false);
        return;
      }
      const dailyBps = 30;
      const PERCISION = 10000;
      const elapsed = now - lastClaimTime;
      console.log(elapsed);
      const interest = (amount * dailyBps * elapsed) / (PERCISION * 86400);
      //console.log("interest", (interest/1e18));
      if (interest <= 0) {
        showError("No interest accrued yet.");
        setLoadingClaim(false);
        return;
      }

      const tx = await contract.claimBoxInterest(boxId, { gasLimit: 300000 });
      await tx.wait();

      showSuccess(`Interest claimed for box #${boxId}`);
      setRefetch(prev => !prev);
    } catch (error) {
      console.error(error);
      showError("Transaction Failed");
    } finally {
      setLoadingClaim(false);
    }
  };

  // const handleWithdrawSubmit = async (boxId) => {
  //   //  alert("ok");
  //   const BOX_MIN_STAKE_SECONDS = 24 * 60 * 60;
  //   try {
  //     if (!signer) {
  //       showError("Please connect your wallet first.");
  //       return;
  //     }

  //     if (!boxId || boxIds.length === 0) {
  //       showError("No active boxes found for this wallet.");
  //       return;
  //     }
  //     console.log(typeof boxId, boxId);
  //     setLoadingWithdraw(true);
  //     const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  //     const stake = await contract.boxStakes(boxId);
  //     const owner = stake.owner.toLowerCase();
  //     const user = walletAddress.toLowerCase();
  //     const amount = ethers.formatUnits(stake.amount, 18);
  //     const lastClaimTime = Number(stake.lastClaimTime);
  //     const unstaked = stake.unstaked;
  //     if (owner !== user) {
  //       showError("You are not the owner of this box.");
  //       setLoadingWithdraw(false);
  //       return;
  //     }
  //     if (unstaked) {
  //       showError("This box is already unstaked.");
  //       setLoadingWithdraw(false);
  //       return;
  //     }
  //     const startTime = Number(stake.startTime);
  //     const now = Math.floor(Date.now() / 1000);

  //     if (now < startTime + BOX_MIN_STAKE_SECONDS) {
  //       const remaining = startTime + BOX_MIN_STAKE_SECONDS - now;
  //       const hours = Math.floor(remaining / 3600);
  //       const minutes = Math.floor((remaining % 3600) / 60);
  //       const seconds = remaining % 60;
  //       showError(`You can withdraw after 24 hours. Time remaining: ${hours}h ${minutes}m ${seconds}s`);
  //       setLoadingWithdraw(false);
  //       return;
  //     }

  //     const tx = await contract.unstakeBox(boxId, { gasLimit: 300000 });
  //     await tx.wait();

  //     showSuccess(`Interest claimed for box #${boxId}`);
  //     setRefetch(prev => !prev);
  //   } catch (error) {
  //     console.error(error);
  //     showError("Transaction Failed");
  //   } finally {
  //     setLoadingWithdraw(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center px-2">
      <div className="max-w-lg rounded-3xl p-0.5 w-full bg-gradient-to-tr from-[#0afcb3] via-[#0891e0] to-[#08e7d5]">
        <div className="bg-black p-5 rounded-3xl flex flex-col gap-2">
          <div className="bg-gradient-to-tr text-black from-[#0afcb3] to-[#0891e0] rounded-xl px-5 py-3">
            <div>Total Amount</div>
            <div className="text-4xl font-extrabold flex gap-5 items-center">
              0 USDT{" "}
              <FaCircleChevronRight
                // onClick={() => navigate(referrer ? "/saving/total/" + referrer : "/saving/total")}
                className="text-2xl cursor-pointer"
              />
            </div>
            {/* <div className="h-[1px] my-3 bg-black"></div> */}
            {/* <div className="flex">
              <div className="flex-1">
                <div className="text-sm">Yesterday's Earnings</div>
                <div className="font-extrabold text-xl">0 USDT</div>
              </div>
              <div className="flex-1">
                <div className="text-sm flex gap-2 items-center">
                  Total Earnings{" "}
                </div>
                <div className="font-extrabold text-xl">0 USDT </div>
              </div>
            </div> */}
          </div>
          <div className=" pt-5">
            <div className="flex justify-center gap-1">
              <button
                onClick={() => navigate(referrer ? "/saving/form/" + referrer : "/saving/form")}
                className="font-bold text-xl cursor-pointer hover:scale-103 transition ease-in-out duration-300 bg-gradient-to-tr text-black from-[#0afcb3] to-[#0891e0] flex-1 py-2 rounded-2xl"
              >
                Saving
              </button>
              {/* <button
                onClick={() => {if (boxIds.length > 0) handleWithdrawSubmit(boxIds[boxIds.length - 1])}}
                disabled={loadingWithdraw || processing}
                className="font-bold text-xl cursor-pointer hover:scale-103 transition ease-in-out duration-300 bg-gradient-to-tr text-black from-[#0afcb3] to-[#0891e0] w-5/12 md:w-2/5 py-2 rounded-full"
              >
                {loadingWithdraw || processing ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Withdraw"
                )}
                
              </button> */}
            </div>
            <div className="flex flex-col mt-3 gap-3 items-center">
              {/* <button onClick={() => { if (boxIds.length > 0) handleRewardSubmit(boxIds[boxIds.length - 1]) }}
                disabled={loadingClaim || processing} className="border-2 py-2 rounded-2xl font-bold text-xl cursor-pointer text-gray-300 hover:bg-gray-300 hover:text-black transition ease-in-out duration-300 w-full">
                {loadingClaim || processing ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  "Claim Rewards"
                )}
              </button> */}
              <button onClick={() => navigate(referrer ? "/saving/orders/" + referrer : "/saving/orders")} className="border-2 py-2 rounded-2xl font-bold text-xl cursor-pointer text-gray-300 hover:bg-gray-300 hover:text-black transition ease-in-out duration-300 w-full">
                Orders
              </button>
              {/* <button className="border-2 py-2 rounded-2xl font-bold text-xl w-10/12 md:w-4/5 cursor-pointer text-gray-300 hover:bg-gray-300 hover:text-black transition ease-in-out duration-300">
                Withdrawl Records
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavingBox;
