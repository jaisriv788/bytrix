import { useState } from "react";
import { useSelector } from "react-redux";

export const Orders = () => {
    const isConnected = useSelector((state) => state.user.isConnected);
    const [data, setData] = useState([1, 2, 3, 4, 5])

    return (
        <div className="py-10 px-2">
            <div className="flex justify-center items-center gap-2">
                <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
                    Orders
                </span>
                {/* <button
                    onClick={() => fetchTableData()}
                    className="border px-2 rounded-lg cursor-pointer text-sm text-[#00BFFF]"
                >
                    Refresh
                </button> */}
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
                                <th className="text-center py-3">Borrow Amount</th>
                                <th className="text-center py-3">Repay Amount</th>
                                <th className="text-center py-3">Borrow Date</th>
                                <th className="text-center py-3">Repay Date</th>
                                <th className="text-center py-3">Repay</th>
                            </tr>
                        </thead>

                        <tbody className="text-[#e2e8f0] bg-gradient-to-b from-[#13263c] to-[#1d3d55] md:text-lg">
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-[#1e3a5f]/60 transition-colors duration-200"
                                >
                                    <th className="text-center py-2">{index + 1}</th>
                                    <td className="text-center py-2">2</td>
                                    <td className="text-center py-2">3</td>
                                    <td className="text-center py-2">4</td>
                                    <td className="text-center py-2">5</td>
                                    <td className="text-center py-2">Repay</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
