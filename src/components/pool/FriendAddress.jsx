// import { useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { TiGroup } from "react-icons/ti";
import { SiMoneygram } from "react-icons/si";
import { TfiTarget } from "react-icons/tfi";
import { FaShareAltSquare } from "react-icons/fa";
import { RiExchangeBoxLine } from "react-icons/ri";
import gif from "../../assets/gif2.gif";
// import { formatUnits } from "ethers"

function FriendAddress({ stats }) {
  // const [data, setData] = useState([
  //   { title: "1st generation", value: 0 },
  //   { title: "2nd generation", value: 0 },
  //   { title: "3rd-7th generation", value: 0 },
  //   { title: "8th-10th generation", value: 0 },
  //   { title: "11th-17th generation", value: 0 },
  // ]);

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

      <div className="flex flex-col md:flex-row max-w-4xl px-2 gap-6 mt-10 mx-auto">
        <div className="flex-1 flex flex-col items-center">
          <span className="font-bold text-4xl sm:text-5xl mb-5">My Investment</span>
          <div className="flex flex-row w-full bg-gradient-to-b from-[#13263c] to-[#1d3d55] flex-1 rounded-xl py-6 flex flex-col gap-4 shadow-md">
            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <TfiTarget />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  {" "}
                  {stats[0] ? parseFloat(stats[4]).toFixed(2) : "0.00"}
                </span>
                <span className="text-sm text-gray-300 font-bold">
                  Total Circulation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-7 px-16 sm:px-20 md:px-24">
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00BFFF] to-[#00FFFF] text-white text-3xl">
                <SiMoneygram />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
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
