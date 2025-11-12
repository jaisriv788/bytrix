import { Copy, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import contractAbi from "../../contractAbi.json";

const plans = [
  { name: "12 hours", planId: 1, duration: 12 * 60 * 60 * 1000 },
  { name: "1 Day", planId: 2, duration: 24 * 60 * 60 * 1000 },
  { name: "7 Days", planId: 3, duration: 7 * 24 * 60 * 60 * 1000 },
  { name: "14 Days", planId: 4, duration: 14 * 24 * 60 * 60 * 1000 },
  { name: "30 Days", planId: 5, duration: 30 * 24 * 60 * 60 * 1000 },
];

// ✨ Stylish Countdown Timer
function CountdownTimer({ startTime, planId }) {
  const plan = plans.find((p) => p.planId === planId);
  const duration = plan?.duration || 0;
  const endTime = Number(startTime) * 1000 + duration;

  const [remaining, setRemaining] = useState(() => Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  if (remaining <= 0) {
    return (
      <span className="font-mono font-semibold text-red-400 tracking-widest">
        0
      </span>
    );
  }

  // Change color dynamically based on remaining time
  const colorClass =
    remaining < 60 * 60 * 1000 // <1 hour
      ? "text-orange-400 border-orange-400/30"
      : remaining < 6 * 60 * 60 * 1000 // <6 hours
        ? "text-yellow-300 border-yellow-300/30"
        : "text-cyan-300 border-cyan-300/30";

  return (
    <div
      className={`font-mono font-semibold ${colorClass} 
        bg-[#1e293b]/50 px-3 py-1 rounded-lg shadow-md border
        animate-pulse-slow transition-all duration-300 inline-block`}
    >
      {days > 0 ? `${days}d ` : ""}
      {String(hours).padStart(2, "0")}:
      {String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </div>
  );
}

function Orders({ tableData }) {
  const [data, setData] = useState([]);

  const isConnected = useSelector((state) => state.user.isConnected);
  const contractAddress = useSelector((state) => state.user.contractAddress);
  // const account = useSelector((state) => state.user.walletAddress);

  async function fetchTableData() {
    const provider = new ethers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    const ctr = new ethers.Contract(contractAddress, contractAbi, provider);

    setData([]);

    for (const item of tableData) {
      const res = await ctr.deposits(item);

      const formatted = {
        address: res[0],
        amount: Number(ethers.formatUnits(res[1], 18)),
        reward: Number(ethers.formatUnits(res[2], 18)),
        date: res[3],
        withdrawn: res[4],
        planId: Number(res[5]),
      };

      setData((prev) => [...prev, formatted]);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, [tableData]);

  return (
    <div className="py-10 px-2">
      <div className="flex justify-center items-center gap-2">
        <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
          Orders
        </span>
        <button
          onClick={() => fetchTableData()}
          className="border px-2 rounded-lg cursor-pointer text-sm text-[#00BFFF]"
        >
          Refresh
        </button>
      </div>

      {!isConnected ? (
        <div className="mt-5 flex items-center justify-center h-30 text-gray-300">
          Connect To Wallet
        </div>
      ) : data.length === 0 ? (
        <div className="mt-5 flex items-center justify-center h-30 text-gray-300">
          No Data Found
        </div>
      ) : (
        <div className="overflow-x-auto max-w-7xl mx-auto mt-10">
          <table className="table overflow-hidden border border-[#1c3d5a] rounded-lg shadow-lg">
            <thead className="text-white bg-gradient-to-r from-[#0a2540] to-[#0d3c61] md:text-lg">
              <tr>
                <th className="text-center py-3">S.No.</th>
                <th className="text-center py-3">Amount</th>
                <th className="text-center py-3">Reward</th>
                <th className="text-center py-3">Plan</th>
                <th className="text-center py-3">Time Left</th>
                <th className="text-center py-3">Withdrawn</th>
              </tr>
            </thead>

            <tbody className="text-[#e2e8f0] bg-gradient-to-b from-[#13263c] to-[#1d3d55] md:text-lg">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#1e3a5f]/60 transition-colors duration-200"
                >
                  <th className="text-center py-2">{index + 1}</th>
                  <td className="text-center py-2">${item.amount}</td>
                  <td className="text-center py-2">${item.reward}</td>

                  <td className="flex gap-3 items-center justify-center py-2">
                    {plans.find((plan) => plan.planId === item.planId)?.name ||
                      "-"}
                  </td>
                  <td className="text-center py-2">
                    <CountdownTimer startTime={item.date} planId={item.planId} />
                  </td>
                  <td className="text-center py-2">
                    {item.withdrawn ? (
                      <span className="text-green-400 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-400 font-medium">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* {isConnected && (
        <div className="mt-10 bg-gradient-to-b from-[#13263c] to-[#1d3d55] max-w-7xl mx-auto px-4 py-4 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-white font-semibold">
            <span className="text-base md:text-lg font-bold">
              Referral Link:
            </span>

            <div className="flex items-center gap-2 bg-gradient-to-r from-[#0a2540] to-[#0d3c61] rounded-lg px-3 py-2 w-full md:w-auto">
              <div className="overflow-x-auto whitespace-nowrap text-sm md:text-base scrollbar-hide">
                {`http://localhost:5173/bytrix/${account}`}
              </div>

              <Copy
                onClick={() => {
                  navigator.clipboard
                    .writeText(`http://localhost:5173/bytrix/${account}`)
                    .then(() => alert("Address Copied!"))
                    .catch((e) => alert("Error Occurred", e));
                }}
                size={18}
                className="hover:text-gray-300 cursor-pointer transition-transform transform hover:scale-110"
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Orders;
