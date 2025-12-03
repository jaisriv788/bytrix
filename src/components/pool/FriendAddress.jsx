// import { useState } from "react";
import { useEffect, useState } from "react";

import { AiFillThunderbolt } from "react-icons/ai";
import { TiGroup } from "react-icons/ti";
import { SiMoneygram } from "react-icons/si";
import { TfiTarget } from "react-icons/tfi";
import { FaShareAltSquare } from "react-icons/fa";
import { RiExchangeBoxLine } from "react-icons/ri";
import { useNotification } from "../../hooks/useNotification";

import gif from "../../assets/gif2.gif";
import { useSelector } from "react-redux";
import { ethers, formatEther } from "ethers";
import contractAbi from "../../contractAbi.json";
// import { formatUnits } from "ethers"

function FriendAddress({ stats }) {
  // const [data, setData] = useState([
  //   { title: "1st generation", value: 0 },
  //   { title: "2nd generation", value: 0 },
  //   { title: "3rd-7th generation", value: 0 },
  //   { title: "8th-10th generation", value: 0 },
  //   { title: "11th-17th generation", value: 0 },
  // ]);
  const { showSuccess, showError } = useNotification();

  const [todayIncome, setTodayIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const isConnected = useSelector((state) => state.user.isConnected);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  // const USDTAddress = useSelector((state) => state.user.USDTAddress);
  const contractAddress = useSelector((state) => state.user.contractAddress);
  // const companyWalletAddress = useSelector(
  //   (state) => state.user.companyWalletAddress
  // );

  useEffect(() => {
    const getPrice = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.anghscan.org/");
        const ctr = new ethers.Contract(contractAddress, contractAbi, provider);

        const todayIndex = Math.floor(Date.now() / 1000 / 86400);

        // console.log({ todayIndex });

        const todayLog = await ctr.getTodayIncomeLog(
          walletAddress,
          todayIndex
        );
        console.log("Today Log:", todayLog);

        const sum = [0, 1, 2, 3]
          .map(i => BigInt(todayLog[i] || 0))
          .reduce((a, b) => a + b, 0n);

        const todayIncomeInt = formatEther(sum);

        console.log("Today Income:", todayIncomeInt);

        setTodayIncome(todayIncomeInt);

        if (!stats) return;
        const totalSum = [stats[5], stats[6]]
          .map(Number)
          .reduce((a, b) => a + b, 0);

        // console.log("TotalSum:", totalSum);
        setTotalIncome(totalSum);


      } catch (err) {
        showError("Something went wrong while fetching the balance.");
      }
    };

    if (isConnected) {
      getPrice();
    } else {
      setTodayIncome(0);
      setTotalIncome(0);
    }
  }, [isConnected, stats]);

  //   useEffect(() => {
  //   const getPrice = async () => {
  //     try {
  //       const provider = new ethers.JsonRpcProvider("https://rpc.anghscan.org/");
  //       const ctr = new ethers.Contract(contractAddress, contractAbi, provider);

  //       const userAddr = ethers.getAddress(walletAddress);

  //       // 1) Primary: compute today's dayIndex like contract
  //       const todayIndex = Math.floor(Date.now() / 1000 / 86400);
  //       console.log({ todayIndex });

  //       // Try today and a few prior days (small lookback to catch UTC-edge logs)
  //       const lookbackDays = 3;
  //       let found = false;
  //       for (let d = 0; d <= lookbackDays; d++) {
  //         const dayToCheck = todayIndex - d;
  //         if (dayToCheck < 0) break;
  //         const todayLog = await ctr.getTodayIncomeLog(userAddr, dayToCheck);
  //         // ethers v6 returns BigInt by default; however shape may be array-like:
  //         const exists = todayLog.exists ?? todayLog[4] ?? false;
  //         console.log("Checked day", dayToCheck, "exists:", exists, "raw:", todayLog);
  //         if (exists) {
  //           // read values (support both named props and tuple)
  //           const ref = BigInt(todayLog.referralIncome ?? todayLog[0] ?? 0);
  //           const mat = BigInt(todayLog.maturityIncome ?? todayLog[1] ?? 0);
  //           const sin = BigInt(todayLog.singleIncome ?? todayLog[2] ?? 0);
  //           const spo = BigInt(todayLog.sponsorIncome ?? todayLog[3] ?? 0);
  //           const sum = ref + mat + sin + spo;
  //           const todayIncomeInt = Number(sum); // if > Number.MAX_SAFE_INTEGER, use sum.toString()
  //           setTodayIncome(todayIncomeInt);
  //           found = true;
  //           break;
  //         }
  //       }

  //       // 2) Fallback: if not found, scan events to find most recent write block and try from there
  //       if (!found) {
  //         console.log("No income log found for recent days; scanning events as fallback...");

  //         // event signatures
  //         const sigReferral = ethers.id("ReferralPaid(address,address,uint256,uint256)");
  //         const sigDepositProcessed = ethers.id("DepositProcessed(uint256,address,uint256)");
  //         const sigSponsor = ethers.id("SponsorRewardPaid(address,string,uint256)");
  //         const sigInvest = ethers.id("Invest(address,uint8,uint256,uint256)");

  //         const addressTopic = (addr) => ethers.zeroPadValue(addr, 32);

  //         // Collect logs where user appears in indexed position(s).
  //         // ReferralPaid: topics [sig, from, to] -> user as 'to' => topic index 2
  //         const logsReferral = await provider.getLogs({
  //           fromBlock: 0,
  //           toBlock: "latest",
  //           address: contractAddress,
  //           topics: [sigReferral, null, addressTopic(userAddr)]
  //         }).catch(() => []);

  //         // DepositProcessed: topics [sig, depositId, user] -> topic 2 is user
  //         const logsDeposit = await provider.getLogs({
  //           fromBlock: 0,
  //           toBlock: "latest",
  //           address: contractAddress,
  //           topics: [sigDepositProcessed, null, addressTopic(userAddr)]
  //         }).catch(() => []);

  //         // SponsorRewardPaid: topics [sig, user] -> topic1 user
  //         const logsSponsor = await provider.getLogs({
  //           fromBlock: 0,
  //           toBlock: "latest",
  //           address: contractAddress,
  //           topics: [sigSponsor, addressTopic(userAddr)]
  //         }).catch(() => []);

  //         // Invest: topics [sig, user] -> topic1 user
  //         const logsInvest = await provider.getLogs({
  //           fromBlock: 0,
  //           toBlock: "latest",
  //           address: contractAddress,
  //           topics: [sigInvest, addressTopic(userAddr)]
  //         }).catch(() => []);

  //         const allLogs = [...logsReferral, ...logsDeposit, ...logsSponsor, ...logsInvest];
  //         if (allLogs.length === 0) {
  //           console.log("No relevant logs found; no income logs available on-chain for this user.");
  //           setTodayIncome(0);
  //         } else {
  //           // pick most recent (largest blockNumber)
  //           const lastLog = allLogs.reduce((a, b) => (Number(a.blockNumber) >= Number(b.blockNumber) ? a : b));
  //           const block = await provider.getBlock(lastLog.blockNumber);
  //           const writeDayIndex = Math.floor(Number(block.timestamp) / 86400);
  //           console.log("Most recent write block:", lastLog.blockNumber, "ts:", Number(block.timestamp), "dayIndex:", writeDayIndex);

  //           // check writeDayIndex and a few previous days
  //           let found2 = false;
  //           for (let d = 0; d <= 3 && !found2; d++) {
  //             const day = writeDayIndex - d;
  //             if (day < 0) break;
  //             const l = await ctr.getTodayIncomeLog(userAddr, day);
  //             const exists2 = l.exists ?? l[4] ?? false;
  //             console.log("Checking day from event fallback:", day, "exists:", exists2);
  //             if (exists2) {
  //               const ref = BigInt(l.referralIncome ?? l[0] ?? 0);
  //               const mat = BigInt(l.maturityIncome ?? l[1] ?? 0);
  //               const sin = BigInt(l.singleIncome ?? l[2] ?? 0);
  //               const spo = BigInt(l.sponsorIncome ?? l[3] ?? 0);
  //               const sum = ref + mat + sin + spo;
  //               setTodayIncome(Number(sum));
  //               found2 = true;
  //               break;
  //             }
  //           }
  //           if (!found2) {
  //             console.log("Fallback scan didn't find any income entries near last write. Setting 0.");
  //             setTodayIncome(0);
  //           }
  //         }
  //       }

  //       // total income from stats (same as before)
  //       if (stats) {
  //         const totalSum = [stats[5], stats[6]]
  //           .map(Number)
  //           .reduce((a, b) => a + b, 0);
  //         setTotalIncome(totalSum);
  //       }

  //     } catch (err) {
  //       console.error("Something went wrong while fetching today income:", err);
  //       showError("Something went wrong while fetching the balance.");
  //     }
  //   };

  //   if (isConnected) {
  //     getPrice();
  //   } else {
  //     setTodayIncome(0);
  //     setTotalIncome(0);
  //   }
  // // include walletAddress if it can change
  // }, [isConnected, stats, walletAddress]);


  return (
    <div
      style={{
        background:
          "radial-gradient(circle at center, #00000F 0%, #339797ff 30%, #151617 60%)",
      }}
      className="py-17"
    >
      {/* <div className="flex justify-center items-center gap-2">
        <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
          Friend Address
        </span>
      </div>
      <div className="flex sm:flex-row max-w-4xl  mx-auto flex-col justify-center mt-10 text-lg font-bold">
        <div className="px-5 py-2 w-full sm:w-1/2 border-b sm:border-b-0 border-gray-300 sm:border-r">
          {data.map((item, index) => (
            <div key={`l${index}`} className="flex justify-between ">
              <span className="text-gray-400">{item.title}</span>
              <span className="text-[#00FFFF]">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-2 w-full sm:w-1/2 border-t sm:border-t-0 border-gray-300 sm:border-l">
          {" "}
          {data.map((item, index) => (
            <div key={`l${index}`} className="flex justify-between ">
              <span className="text-gray-400">{item.title}</span>
              <span className="text-[#00FFFF]">{item.value}</span>
            </div>
          ))}
        </div>
      </div> */}
      <div className="flex flex-col md:flex-row max-w-4xl px-2 gap-6 mt-10 mx-auto">
        {/* Teams Section */}
        <div className="flex-1 flex flex-col items-center">
          <span className="font-bold text-4xl sm:text-5xl mb-5">Teams</span>
          <div className="w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55] flex-1 rounded-xl py-6 flex flex-col gap-4 shadow-md">
            {/* Box Item */}
            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <AiFillThunderbolt />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {stats[0] ? Math.floor(stats[0]) : "0"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Invitation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <TiGroup />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {" "}
                  {stats[1] ? Math.floor(stats[1]) : "0"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Team Size
                </span>
              </div>
            </div>

            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <TiGroup />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {" "}
                  {stats[0] ? Math.floor(stats[2]) : "0"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Participating Users
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Section */}
        <div className="flex-1 flex flex-col items-center">
          <span className="font-bold text-4xl sm:text-5xl mb-5">Personal</span>
          <div className="w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55] flex-1 rounded-xl py-6 flex flex-col gap-4 shadow-md">
            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <FaShareAltSquare />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {" "}
                  {stats[0] ? parseFloat(stats[5]).toFixed(2) : "0.00"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Personal Returns
                </span>
              </div>
            </div>

            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <RiExchangeBoxLine />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {" "}
                  {stats[0] ? parseFloat(stats[6]).toFixed(2) : "0.00"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Sharing Benefits
                </span>
              </div>
            </div>

            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <RiExchangeBoxLine />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {" "}0.00
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Special Sponsor Reward
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Investment */}
      <div className="flex flex-col md:flex-row max-w-4xl px-3 md:px-2 gap-6 mt-10 mx-auto">
        <div className="flex-1 flex flex-col items-center">

          <span className="font-bold text-3xl sm:text-4xl md:text-5xl mb-5">
            My Investment
          </span>

          <div className="
      w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55]
      flex flex-col sm:flex-row   /* <-- FIX HERE */
      flex-1 rounded-xl py-5 md:py-6 gap-4 shadow-md
    ">

            {/* Total Circulation */}
            <div className="flex items-center gap-4 md:gap-7 px-6 sm:px-10 md:px-24">
              <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center 
        rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] 
        text-white text-2xl md:text-3xl">
                <TfiTarget />
              </div>

              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold">
                  {stats[0] ? parseFloat(stats[4]).toFixed(2) : "0.00"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Total Circulation
                </span>
              </div>
            </div>

            {/* Active Circulation */}
            <div className="flex items-center gap-4 md:gap-7 px-6 sm:px-10 md:px-24">
              <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center 
        rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] 
        text-white text-2xl md:text-3xl">
                <SiMoneygram />
              </div>

              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold">
                  {stats[0] ? parseFloat(stats[3]).toFixed(2) : "0.00"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Active Circulation
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* My Income */}
      <div className="flex flex-col md:flex-row max-w-4xl px-3 md:px-2 gap-6 mt-10 mx-auto">
        <div className="flex-1 flex flex-col items-center">

          <span className="font-bold text-3xl sm:text-4xl md:text-5xl mb-5">
            My Income
          </span>

          <div className="
      w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55]
      flex flex-col sm:flex-row   /* <-- FIX HERE */
      flex-1 rounded-xl py-5 md:py-6 gap-4 shadow-md
    ">

            {/* Total Income */}
            <div className="flex items-center gap-4 md:gap-7 px-6 sm:px-10 md:px-24">
              <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center 
        rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] 
        text-white text-2xl md:text-3xl">
                <TfiTarget />
              </div>

              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold">
                  {Number(totalIncome).toFixed(4)}

                </span>
                <span className="text-sm text-gray-300 font-bold">Total Income</span>
              </div>
            </div>

            {/* Today Income */}
            <div className="flex items-center gap-4 md:gap-7 px-6 sm:px-10 md:px-24">
              <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center 
        rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] 
        text-white text-2xl md:text-3xl">
                <SiMoneygram />
              </div>

              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold">
                  {Number(todayIncome).toFixed(4)}

                </span>

                <span className="text-sm text-gray-300 font-bold">Today Income</span>
              </div>
            </div>

          </div>
        </div>
      </div>






      {/* My Investment */}
      {/* <div className="max-w-4xl w-full px-4 mt-10 mx-auto">
  <div className="flex flex-col items-center">
    <span className="font-bold text-3xl sm:text-4xl md:text-5xl mb-5">
      My Investment
    </span>

    <div className="w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55] rounded-xl py-6 flex flex-col gap-6 shadow-md">

  
      <div className="flex items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-10 md:px-16">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
          rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-2xl sm:text-3xl">
          <TfiTarget />
        </div>

        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold">
            {stats[0] ? parseFloat(stats[4]).toFixed(2) : "0.00"}
          </span>
          <span className="text-xs sm:text-sm text-gray-300 font-bold">
            Total Circulation
          </span>
        </div>
      </div>

 
      <div className="flex items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-10 md:px-16">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
          rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-2xl sm:text-3xl">
          <SiMoneygram />
        </div>

        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold">
            {stats[0] ? parseFloat(stats[3]).toFixed(2) : "0.00"}
          </span>
          <span className="text-xs sm:text-sm text-gray-300 font-bold">
            Active Circulation
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
 */}


      {/* My Income */}
      {/* <div className="max-w-4xl w-full px-4 mt-10 mx-auto">
  <div className="flex flex-col items-center">
    <span className="font-bold text-3xl sm:text-4xl md:text-5xl mb-5">
      My Income
    </span>

    <div className="w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55] rounded-xl py-6 flex flex-col gap-6 shadow-md">

      <div className="flex items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-10 md:px-16">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
          rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-2xl sm:text-3xl">
          <TfiTarget />
        </div>

        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold">0.00</span>
          <span className="text-xs sm:text-sm text-gray-300 font-bold">
            Total Income
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 md:gap-7 px-4 sm:px-10 md:px-16">
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
          rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-2xl sm:text-3xl">
          <SiMoneygram />
        </div>

        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-bold">0.00</span>
          <span className="text-xs sm:text-sm text-gray-300 font-bold">
            Today Income
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
 */}




      <div className="flex flex-col items-center mt-7">
        <div className="max-w-4xl lg:text-5xl sm:text-4xl text-xl font-bold text-center bg-gradient-to-br from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text ">
          New opportunities for the world with blockchain and smart contracts
        </div>
        <div className="max-w-4xl text-sm mt-5 text-gray-300 text-center">
          DeFi is brought about by decentralised blockchain and open and
          transparent smart contracts, and is a revolutionary technological
          change that enables decentralisation, openness and transparency in
          finance, as well as efficient operations with security far beyond
          traditional finance.
        </div>
      </div>
      <div className="flex justify-center">
        <img src={gif} alt="gif" />
      </div>
    </div>
  );
}

export default FriendAddress;
