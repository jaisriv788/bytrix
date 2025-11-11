import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import contractAbi from "../../contractAbi.json";

function SavingOrders() {
  const isConnected = useSelector((state) => state.user.isConnected);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const contractAddress = useSelector((state) => state.user.contractAddress);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isConnected || !walletAddress) return;
      setLoading(true);

      try {
        const provider = new ethers.JsonRpcProvider(
          "https://data-seed-prebsc-1-s1.binance.org:8545/"
        );
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);

        // ✅ 1. Get user box IDs
        const ids = await contract.getUserBoxIds(walletAddress);
        const parsedIds = ids.map((id) => Number(id));

        // ✅ 2. Get all BoxStake details for those IDs
        const stakes = await Promise.all(
          parsedIds.map(async (id) => {
            const s = await contract.boxStakes(id);
            return {
              id,
              amount: Number(ethers.formatUnits(s.amount, 18)),
              reward: 0, // Optional: calculate locally or fetch if contract supports it
              timestamp: Number(s.startTime),
              user: s.owner,
              withdrawn: s.unstaked,
            };
          })
        );

        setTableData(stakes.reverse()); // show newest first
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isConnected, walletAddress]);

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
                <th className="text-center">Withdraw</th>
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
                  <td className="flex gap-2 justify-center items-center">
                    button
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
