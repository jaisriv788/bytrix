import React, { useEffect, useState } from 'react'
import videoBg from "../../assets/v3.mp4";
import { useSelector } from 'react-redux';
import { ethers, formatUnits } from 'ethers';
// import contractAbi from "../../contractAbi.json";
import erc20Abi from "../../erc20Abi.json";
import { useNotification } from '../../hooks/useNotification';
// import { CircleQuestionMark } from 'lucide-react';

function Lease({ showModal }) {
    const defaultPlans = [
        { name: "1 Day", clicked: true, percentage: 0.3, planId: 1, fees: 1, min: 10, max: 250 },
        { name: "7 Days", clicked: false, percentage: 3, planId: 2, fees: 1, min: 50, max: 1000 },
        { name: "15 Days", clicked: false, percentage: 7.5, planId: 3, fees: 1, min: 50, max: 5000 },
        { name: "30 Days", clicked: false, percentage: 20, planId: 4, fees: 1, min: 100, max: 10000 },
    ];

    const [dataBox, setDataBox] = useState(defaultPlans);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [refetch, setRefetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedBox, setSelectedBox] = useState(defaultPlans[0]);

    const isConnected = useSelector((state) => state.user.isConnected);
    const USDTAddress = useSelector((state) => state.user.USDTAddress);
    // const contractAddress = useSelector((state) => state.user.contractAddress);
    const walletAddress = useSelector((state) => state.user.walletAddress);

    const { showError } = useNotification();

    useEffect(() => {
        const getPrice = async () => {
            try {
                setBalanceLoading(true);
                const provider = new ethers.JsonRpcProvider(
                    "https://data-seed-prebsc-1-s1.binance.org:8545/"
                );

                const contract = new ethers.Contract(USDTAddress, erc20Abi, provider);
                // const ctr = new ethers.Contract(contractAddress, contractAbi, provider);

                const balance = await contract.balanceOf(walletAddress);
                const decimals = await contract.decimals();
                const formatted = formatUnits(balance, decimals);
                setUsdtBalance(formatted);

            } catch (error) {
                console.log(error)
                showError("Something went wrong while fetching the balance.");
            } finally {
                setBalanceLoading(false);
            }
        };

        isConnected ? getPrice() : setUsdtBalance(0);
    }, [isConnected, refetch]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setAmount(value);
    };

    const handleClick = (index) => {
        const newData = dataBox.map((item, i) => ({
            ...item,
            clicked: i === index,
        }));
        setDataBox(newData);
        setSelectedBox(newData[index]);
    };

    async function handleSubmit() {
        console.log(amount, selectedBox)
        setRefetch(false)
        setLoading(false)
    }

    return (
        <div className="relative min-h-screen flex flex-col gap-7 items-center justify-center overflow-hidden px-2">
            {/* 🎥 Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src={videoBg}
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Title */}
            <div className="flex font-bold text-3xl items-center gap-2 z-0">
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
                    Lease
                </span>

                <div className="tabs tabs-border">
                    <input type="radio" name="my_tabs_2" className="tab text-white hover:text-gray-300 transition ease-in-out duration-300" aria-label="Borrow" defaultChecked />
                    <div className="tab-content"> {/* Amount input */}
                        <div>
                            <div className="flex justify-between mt-3">
                                <span className="font-semibold">Borrow Amount</span>
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
                                        placeholder="Enter Borrow Amount"
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

                        {/* Fees & Buttons */}
                        <div className="mb-1">
                            {/* <div className="flex justify-between mt-3">
                        {dataBox.map(
                            (item, index) =>
                                item.clicked && (
                                    <span key={index} className="font-semibold">
                                        {item.name}
                                    </span>
                                )
                        )}
                        <span>
                            <span className="text-gray-400 font-bold">
                                ~{usdtValue ? parseFloat(usdtValue).toFixed(4) : "0.0000"}
                            </span>{" "}
                            - USDT
                        </span>
                    </div> */}

                            {isConnected ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!amount}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/80 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
                                >
                                    Borrow
                                </button>
                            ) : (
                                <button
                                    onClick={() => showModal(true)}
                                    className="bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/90 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
                                >
                                    Connect Wallet
                                </button>
                            )}

                            {loading && (
                                <div className="text-center mt-3 font-bold text-red-400">
                                    Please Do Not Close The Tab!
                                </div>
                            )}
                        </div>
                    </div>

                    <input type="radio" name="my_tabs_2" className="tab text-white hover:text-gray-300 transition ease-in-out duration-300" aria-label="Pay" />
                    <div className="tab-content"> {/* Amount input */}
                        <div>
                            <div className="bg-slate-600 focus-within:bg-gradient-to-tr focus-within:from-[#00BFFF] focus-within:to-[#00FFFF] p-1 mt-2 rounded-xl">
                                <div className="flex gap-2 px-2 bg-slate-600 rounded-lg items-center">
                                    <input
                                        value={amount}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="flex-1 border-none py-2.5 focus:outline-none text-lg focus:text-[#00FFFF] font-semibold bg-transparent"
                                        type="number"
                                        placeholder="Enter Returning Amount"
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
                        <div className="mb-1">
                            {isConnected ? (
                                <button
                                    // onClick={handleSubmit}
                                    // disabled={!amount}
                                    className="disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/80 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
                                >
                                    Pay
                                </button>
                            ) : (
                                <button
                                    onClick={() => showModal(true)}
                                    className="bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] mt-3 w-full py-2 rounded-full font-bold text-black/90 cursor-pointer hover:scale-103 hover:-translate-y-0.5 transition ease-in-out duration-200"
                                >
                                    Connect Wallet
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
            </div>
        </div>
    )
}

export default Lease