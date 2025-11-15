import { Copy, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import contractAbi from "../../contractAbi.json";

const plans = [
  { name: "12 Hours", planId: 1, duration: 12 * 60 * 60 * 1000 },
  { name: "1 Day", planId: 2, duration: 24 * 60 * 60 * 1000 },
  { name: "7 Days", planId: 3, duration: 7 * 24 * 60 * 60 * 1000 },
  { name: "14 Days", planId: 4, duration: 14 * 24 * 60 * 60 * 1000 },
  { name: "30 Days", planId: 5, duration: 30 * 24 * 60 * 60 * 1000 },
];

// Helper: normalize an on-chain timestamp (BigNumber / BigInt / string / number)
// to a plain Number of milliseconds and also return whether the original looked
// like seconds or milliseconds.
function normalizeTimestampToMs(raw) {
  // Try to extract primitive value
  let v = raw;
  try {
    // ethers BigNumber has toNumber, BigInt has value as BigInt
    if (v && typeof v === "object") {
      if (typeof v.toNumber === "function") {
        v = v.toNumber();
      } else if (typeof v.toString === "function") {
        v = v.toString();
      }
    }
  } catch (e) {
    console.log(e)
    // fallthrough
    v = String(raw);
  }

  const numeric = Number(v);

  if (!isFinite(numeric)) {
    return { ms: 0, guessedUnit: "unknown" };
  }

  // Heuristics:
  // - If value > 1e12 treat as milliseconds (since 1e12 ms ~ 2001-09-09)
  // - Otherwise treat as seconds and multiply by 1000
  if (numeric > 1e12) {
    return { ms: Math.floor(numeric), guessedUnit: "ms" };
  } else {
    return { ms: Math.floor(numeric * 1000), guessedUnit: "s" };
  }
}

// ✨ Stylish Countdown Timer (logic-only improvements)
function CountdownTimer({ startTime, planId }) {
  // find plan duration in ms
  const plan = plans.find((p) => p.planId === planId);
  const duration = plan?.duration || 0;

  // normalize raw provided timestamp to ms
  const { ms: providedMs } = normalizeTimestampToMs(startTime);

  // Two possible interpretations:
  // 1) providedMs is a start timestamp in ms -> endIfStart = providedMs + duration
  // 2) providedMs is already an end/maturity timestamp in ms -> endIfProvided = providedMs
  const endIfStart = providedMs + duration;
  const endIfProvided = providedMs;

  // Now decide which end time makes sense:
  // - If provided looks like seconds (guessedUnit === "s"), prefer endIfStart,
  //   but verify by checking remaining ranges.
  // - If provided looks like ms or either candidate yields valid remaining time
  //   within [0, duration], choose the candidate that produces remaining <= duration.
  const now = Date.now();

  const remainingIfStart = Math.max(0, endIfStart - now);
  const remainingIfProvided = Math.max(0, endIfProvided - now);

  // Preference logic (robust):
  // - If remainingIfProvided <= duration and remainingIfProvided <= remainingIfStart:
  //     -> choose endIfProvided (the contract likely returned the maturity timestamp)
  // - Else if remainingIfStart <= duration:
  //     -> choose endIfStart (contract returned deposit start timestamp)
  // - Else fallback to endIfStart (safe default)
  let chosenEnd = endIfStart;
  let chosenRemaining = remainingIfStart;

  if (remainingIfProvided <= duration && remainingIfProvided <= remainingIfStart) {
    chosenEnd = endIfProvided;
    chosenRemaining = remainingIfProvided;
  } else if (remainingIfStart <= duration) {
    chosenEnd = endIfStart;
    chosenRemaining = remainingIfStart;
  } else {
    // fallback: pick the smaller positive remaining to avoid huge doubled durations
    if (remainingIfProvided < remainingIfStart) {
      chosenEnd = endIfProvided;
      chosenRemaining = remainingIfProvided;
    } else {
      chosenEnd = endIfStart;
      chosenRemaining = remainingIfStart;
      console.log(chosenRemaining)
    }
  }

  // Local state driven by chosenEnd
  const [remaining, setRemaining] = useState(() => Math.max(0, chosenEnd - now));

  useEffect(() => {
    // If startTime or planId changes we should recompute
    setRemaining(Math.max(0, chosenEnd - Date.now()));

    const interval = setInterval(() => {
      setRemaining(Math.max(0, chosenEnd - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providedMs, planId, chosenEnd]); // re-run when providedMs or planId changes

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  if (remaining <= 0) {
    return (
      <div
        className={`font-mono font-semibold text-red-400 
          bg-[#1e293b]/50 px-3 py-1 rounded-lg shadow-md border
          animate-pulse-slow transition-all duration-300 inline-block`}
      >
        00:00:00
      </div>
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
      {String(seconds).padStart(2, "0")}h
    </div>
  );
}

function Orders({ tableData }) {
  const [data, setData] = useState([]);

  const isConnected = useSelector((state) => state.user.isConnected);
  const contractAddress = useSelector((state) => state.user.contractAddress);

  async function fetchTableData() {
    const provider = new ethers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    const ctr = new ethers.Contract(contractAddress, contractAbi, provider);

    setData([]);

    for (const item of tableData) {
      const res = await ctr.deposits(item);

      // Keep the raw 'date' as returned by the chain (BigNumber/BigInt/string).
      // CountdownTimer will normalize and decide if it's start or end.
      const formatted = {
        address: res[0],
        amount: Number(ethers.formatUnits(res[1], 18)),
        reward: Number(ethers.formatUnits(res[2], 18)),
        // pass the raw value through (but coerce BigNumber to string if needed)
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
              {data.reverse().map((item, index) => (
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
    </div>
  );
}

export default Orders;
