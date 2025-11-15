import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import contractAbi from "../../savingAbi.json";
import useEthers from "../../hooks/useEthers";
import { useNotification } from "../../hooks/useNotification";

function SavingOrders() {
  const isConnected = useSelector((state) => state.user.isConnected);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const contractAddress = useSelector((state) => state.user.savingContractAddress);

  const { signer } = useEthers();
  const { showSuccess, showError } = useNotification();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingId, setLoadingId] = useState(null)
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [loadingClaimId, setLoadingClaimId] = useState(null)


  useEffect(() => {
    const fetchOrders = async () => {
      if (!isConnected || !walletAddress) return;
      setLoading(true);

      try {
        const provider = new ethers.JsonRpcProvider(
          "https://data-seed-prebsc-1-s1.binance.org:8545/"
        );
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        const ids = await contract.getUserBoxIds(walletAddress);
        const parsedIds = ids.map((id) => Number(id));
        // console.log({parsedIds})
        const stakes = await Promise.all(
          parsedIds.map(async (id) => {
            const s = await contract.boxStakes(id);
            // console.log(s)
            return {
              id,
              amount: Number(ethers.formatUnits(s.amount, 18)),
              reward: 0,
              timestamp: Number(s.startTime),
              user: s.owner,
              withdrawn: s.unstaked,
            };
          })
        );
        // console.log({ stakes })
        setTableData(stakes.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isConnected, walletAddress]);

  const handleWithdrawSubmit = async (boxId, i) => {
    // const BOX_MIN_STAKE_SECONDS = 24 * 60 * 60;
    try {
      if (!signer) {
        showError("Please connect your wallet first.");
        return;
      }

      if (boxId == null || boxId == undefined) {
        showError("No active boxes found for this wallet.");
        return;
      }

      // console.log(typeof boxId, boxId);
      setLoadingWithdraw(true);
      setLoadingId(i)
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const stake = await contract.boxStakes(boxId);
      const owner = stake.owner.toLowerCase();
      const user = walletAddress.toLowerCase();
      // const amount = ethers.formatUnits(stake.amount, 18);
      // const lastClaimTime = Number(stake.lastClaimTime);
      // console.log({ amount, lastClaimTime })
      const unstaked = stake.unstaked;
      if (owner !== user) {
        showError("You are not the owner of this box.");
        setLoadingWithdraw(false);
        return;
      }
      if (unstaked) {
        showError("This box is already unstaked.");
        setLoadingWithdraw(false);
        return;
      }
      // const startTime = Number(stake.startTime);
      // const now = Math.floor(Date.now() / 1000);

      // if (now < startTime + BOX_MIN_STAKE_SECONDS) {
      //   const remaining = startTime + BOX_MIN_STAKE_SECONDS - now;
      //   const hours = Math.floor(remaining / 3600);
      //   const minutes = Math.floor((remaining % 3600) / 60);
      //   const seconds = remaining % 60;
      //   showError(`You can withdraw after 24 hours. Time remaining: ${hours}h ${minutes}m ${seconds}s`);
      //   setLoadingWithdraw(false);
      //   return;
      // }

      console.log("running the unstake fn")

      const tx = await contract.unstakeBox(boxId, { gasLimit: 500000 });
      await tx.wait();

      showSuccess(`Interest claimed for box #${boxId}`);
    } catch (error) {
      console.error(error);
      showError("Transaction Failed");
    } finally {
      setLoadingWithdraw(false);
      setLoadingId(null)
    }
  };

  const handleRewardSubmit = async (boxId, i) => {
    try {
      if (!signer) {
        showError("Please connect your wallet first.");
        return;
      }

      if (boxId == null || boxId == undefined) {
        showError("No active boxes found for this wallet.");
        return;
      }

      // console.log(typeof boxId);
      setLoadingClaim(true);
      setLoadingClaimId(i)
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
      // if (now - lastClaimTime < 60) {
      //   showError("Please wait before claiming interest again.");
      //   setLoadingClaim(false);
      //   return;
      // }
      const dailyBps = 30;
      const PERCISION = 10000;
      const elapsed = now - lastClaimTime;
      // console.log(elapsed);
      const interest = (amount * dailyBps * elapsed) / (PERCISION * 86400);
      //console.log("interest", (interest/1e18));
      if (interest <= 0) {
        showError("No interest accrued yet.");
        setLoadingClaim(false);
        return;
      }
      console.log("running the claim fn")
      const tx = await contract.claimBoxInterest(boxId, { gasLimit: 500000 });
      await tx.wait();

      showSuccess(`Interest claimed for box #${boxId}`);
    } catch (error) {
      console.error(error);
      showError("Transaction Failed");
    } finally {
      setLoadingClaim(false);
      setLoadingClaimId(null)
    }
  };

  return (
    <div className="pt-20 px-2 min-h-screen">
      <div className="flex justify-center items-center gap-2">
        <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
          Orders
        </span>
      </div>

      {!isConnected ? (
        <div className="mt-5 flex items-center justify-center h-30 text-gray-300">
          Connect To Wallet
        </div>
      ) : loading ? (
        <div className="mt-5 flex items-center justify-center h-30 text-gray-300">
          Loading...
        </div>
      ) : tableData.length === 0 ? (
        <div className="mt-5 flex items-center justify-center h-30 text-gray-300">
          No Data Found
        </div>
      ) : (
        <div className="overflow-x-auto max-w-7xl mx-auto mt-10">
          <table className="table overflow-hidden">
            <thead className="text-white bg-gradient-to-r from-[#0a2540] to-[#0d3c61] md:text-lg">
              <tr>
                <th className="text-center">S.No.</th>
                <th className="text-center">Amount (USDT)</th>
                <th className="text-center">Start Time</th>
                <th className="text-center">Last Claim</th>
                <th className="text-center">Withdrawn</th>
                <th className="text-center">Unstake</th>
                <th className="text-center">Claim</th>
              </tr>
            </thead>
            <tbody className="text-[#e2e8f0] bg-gradient-to-b from-[#13263c] to-[#1d3d55] md:text-lg">
              {tableData.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{item.amount}</td>
                  <td className="text-center text-nowrap">
                    {new Date(item.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="text-center text-nowrap">
                    {new Date(item.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="text-center">{item.withdrawn ? "Yes" : "No"}</td>
                  <td className="">
                    <button disabled={loadingWithdraw && loadingId == index} onClick={() => handleWithdrawSubmit(item.id, index)} className="animated-gradient h-full font-semibold rounded-lg text-base px-4 cursor-pointer"
                    >{loadingWithdraw && loadingId == index ? "Unstacking..." : "Unstake"}</button>
                  </td>
                  <td className="">
                    <button disabled={loadingClaim && loadingClaimId == index} onClick={() => handleRewardSubmit(item.id, index)} className="animated-gradient h-full font-semibold rounded-lg text-base px-4 cursor-pointer"
                    >{loadingClaim && loadingClaimId == index ? "Claiming..." : "Claim"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SavingOrders;
