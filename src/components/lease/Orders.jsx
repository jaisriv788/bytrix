import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import contractAbi from "../../leaseAbi.json";
import useEthers from "../../hooks/useEthers";
import { useNotification } from "../../hooks/useNotification";
import erc20Abi from "../../erc20Abi.json";

const defaultPlans = [
    { percentage: 2, planId: 1 },
    { percentage: 10, planId: 2 },
    { percentage: 20, planId: 3 },
    { percentage: 36, planId: 4 },
];

export const Orders = ({ reloadData, setReloadData }) => {
    const isConnected = useSelector((state) => state.user.isConnected);
    const contractAddress = useSelector((state) => state.user.leaseConstractAddress);
    const walletAddress = useSelector((state) => state.user.walletAddress);
    const USDTAddress = useSelector((state) => state.user.USDTAddress);

    const [data, setData] = useState([]);
    const [clickedBtn, setClickedBtn] = useState(null)
    const [balance, setBalance] = useState(0)
    const { signer } = useEthers();

    const { showError, showSuccess } = useNotification();


    async function handleRepayment(id, amount, i) {
        try {
            if (parseFloat(balance) < parseFloat(amount)) {
                showError("Insufficient Funds.");
                return;
            }
            console.log(id)
            setClickedBtn(i)
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);
            const tokenContract = new ethers.Contract(USDTAddress, erc20Abi, signer);

            const amt = ethers.parseUnits(amount.toString(), 18)

            const tx = await tokenContract.approve(contractAddress, amt);
            await tx.wait();

            const tx2 = await contract.returnUSDT(id, {
                gasLimit: 500000,
            });
            await tx2.wait();
            showSuccess("Transaction Successful!");
            setReloadData((prev) => !prev);
        } catch (error) {
            showError("Transaction Failed");
            console.log("Error fetching data:", error);
        } finally {
            setClickedBtn(null)
        }
    }

    async function fetchData() {
        try {
            const provider = new ethers.JsonRpcProvider(
                "https://data-seed-prebsc-1-s1.binance.org:8545/"
            );
            const ctr = new ethers.Contract(contractAddress, contractAbi, provider);
            const tokenContract = new ethers.Contract(USDTAddress, erc20Abi, provider);

            const amt = await tokenContract.balanceOf(walletAddress)
            const balance = ethers.formatEther(amt)
            setBalance(balance)
            // console.log({ balance })
            setData([]);

            const res = await ctr.getUserActiveLeases(walletAddress);

            // console.log(res)
            for (const item of res) {
                const id = parseInt(item);
                const leaseDetails = await ctr.getLease(id);

                // console.log({ leaseDetails })
                const formatedData = {
                    address: leaseDetails[0],
                    BtxAmount: Number(ethers.formatUnits(leaseDetails[1], 18)),
                    UsdtAmount: Number(ethers.formatUnits(leaseDetails[2], 18)),
                    borrowDate: new Date(Number(leaseDetails[3]) * 1000).toLocaleString(),
                    returningDate: new Date(Number(leaseDetails[4]) * 1000).toLocaleString(),
                    planId: Number(leaseDetails[5]),
                    paid: leaseDetails[6],
                    boxId: Number(item)
                }
                // console.log(formatedData)
                setData((prev) => [...prev, formatedData]);
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [reloadData]);

    return (
        <div className="py-10 px-4">
            {/* Header */}
            <div className="flex justify-center items-center gap-2 mb-10">
                <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
                    Orders
                </h1>
            </div>

            {/* Connection Check */}
            {!isConnected ? (
                <div className="mt-5 flex items-center justify-center text-gray-400 text-lg">
                    Connect To Wallet
                </div>
            ) : data.length === 0 ? (
                <div className="mt-5 flex items-center justify-center text-gray-400 text-lg">
                    No Data Found
                </div>
            ) : (
                // <div className="flex flex-wrap justify-evenly gap-10">
                //     {data.map((item, index) => (
                //         <div
                //             key={index}
                //             className="
                //                 rounded-3xl p-7 
                //                 backdrop-blur-xl 
                //                 bg-gradient-to-br from-[#0afcb320] via-[#1da1ee20] to-[#0891e020]
                //                 border border-cyan-400/30 
                //                 shadow-[0_0_25px_#00eaff40] 
                //                 text-white 
                //                 transition-all duration-300 
                //                 hover:scale-[1.04] 
                //                 hover:shadow-[0_0_45px_#00eaff70]
                //             "
                //         >
                //             {/* Title */}
                //             <h2 className="text-xl font-bold mb-5 tracking-wide">
                //                 Lease Summary
                //             </h2>

                //             {/* Info Fields */}
                //             <div className="space-y-3 text-sm text-gray-200">
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">Id:</span> {item?.boxId}</p>
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">BTX Amount:</span> ${item?.BtxAmount}</p>
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">USDT Amount:</span> ${item?.UsdtAmount}</p>
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">Borrow Date:</span> {item?.borrowDate}</p>
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">Returning Date:</span> {item?.returningDate}</p>
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">Intrest Percentage:</span> {defaultPlans.find(p => p.planId === item.planId)?.percentage}%</p>
                //                 <p className="flex justify-between gap-3 md:gap-10"><span className="font-semibold text-cyan-300">Receving Amount:</span> ${item?.BtxAmount - (item?.BtxAmount * defaultPlans.find(p => p.planId === item.planId)?.percentage / 100)}</p>
                //             </div>

                //             {/* Button */}
                //             <button
                //                 disabled={item?.paid || clickedBtn}
                //                 onClick={() => { handleRepayment(item?.boxId, item?.UsdtAmount, index) }}
                //                 className={`
                //                     mt-7 w-full py-3 
                //                     rounded-2xl font-bold 
                //                     transition-all duration-300 
                //                     shadow-lg 
                //                     bg-gradient-to-r cursor-pointer
                //                     disabled:cursor-not-allowed
                //                     ${item?.paid
                //                         ? "from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                //                         : "from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                //                     }
                //                     text-black
                //                 `}
                //             >
                //                 {index === clickedBtn ? <span className="loading loading-spinner loading-md"></span> : "Pay Now"}
                //             </button>
                //         </div>
                //     ))}
                // </div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
    {data.map((item, index) => {
        const plan = defaultPlans.find(p => p.planId === item.planId);
        const receiving = item?.BtxAmount - (item?.BtxAmount * plan?.percentage / 100);

        return (
            <div
                key={index}
                className="
                    rounded-3xl p-6
                    backdrop-blur-xl 
                    bg-gradient-to-br from-[#0afcb310] via-[#1da1ee15] to-[#0891e015]
                    border border-cyan-400/40  
                    shadow-[0_0_20px_#00eaff40]
                    text-white 
                    w-full max-w-sm
                    transition-all duration-300 
                    hover:scale-[1.03] hover:shadow-[0_0_40px_#00eaff80]
                "
            >
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold tracking-wide text-cyan-200">
                        Lease Summary
                    </h2>
                    <p className="text-xs text-gray-300 mt-1">
                        ID #{item?.boxId}
                    </p>
                </div>

                {/* Section 1 */}
                <div className="bg-white/5 rounded-xl p-4 space-y-1 border border-white/10">
                    <h3 className="text-sm text-cyan-300 font-semibold mb-1">Amounts</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">BTX Amount</span>
                        <span>${item?.BtxAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">USDT Amount</span>
                        <span>${item?.UsdtAmount}</span>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white/5 rounded-xl p-4 mt-4 space-y-1 border border-white/10">
                    <h3 className="text-sm text-cyan-300 font-semibold mb-1">Timeline</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Borrow Date</span>
                        <span>{item?.borrowDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Returning Date</span>
                        <span>{item?.returningDate}</span>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white/5 rounded-xl p-4 mt-4 space-y-1 border border-white/10">
                    <h3 className="text-sm text-cyan-300 font-semibold mb-1">Financials</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Interest</span>
                        <span>{plan?.percentage}%</span>
                    </div>

                    <div className="flex justify-between text-sm font-semibold text-cyan-200 mt-1">
                        <span>Final Receiving</span>
                        <span>${receiving}</span>
                    </div>
                </div>

                {/* Button */}
                <button
                    disabled={item?.paid || clickedBtn}
                    onClick={() => handleRepayment(item?.boxId, item?.UsdtAmount, index)}
                    className={`
                        mt-6 w-full py-3 
                        rounded-xl font-bold 
                        transition-all duration-300 
                        shadow-md 
                        bg-gradient-to-r cursor-pointer
                        disabled:cursor-not-allowed
                        ${item?.paid
                            ? "from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                            : "from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                        }
                        text-black
                    `}
                >
                    {index === clickedBtn
                        ? <span className="loading loading-spinner loading-md"></span>
                        : "Pay Now"}
                </button>
            </div>
        );
    })}
</div>

            )}
        </div>
    );
};
