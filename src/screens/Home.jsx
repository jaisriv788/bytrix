import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setReferrer } from "../redux/slice/userDetails";
import videoBg from "../assets/v3.mp4";
import { Copy } from "lucide-react";
import { ethers, formatUnits } from "ethers";
import contractAbi from "../contractAbi.json";
import erc20Abi from "../erc20Abi.json";
import Content from "../components/home/Content";

function Home({ setShowModal }) {
  const { ref } = useParams();

  const [balanceLoading, setBalanceLoading] = useState(false);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [userStats, setUserStats] = useState(0);

  const account = useSelector((state) => state.user.walletAddress);
  const isConnected = useSelector((state) => state.user.isConnected);
  const USDTAddress = useSelector((state) => state.user.USDTAddress);
  const contractAddress = useSelector((state) => state.user.contractAddress);
  const companyWalletAddress = useSelector(
    (state) => state.user.companyWalletAddress
  );
  const dispatch = useDispatch();

  useEffect(() => {
    ref ? dispatch(setReferrer(ref)) : dispatch(setReferrer(""));
  }, [ref, dispatch]);

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => {
    try {
      setBalanceLoading(true);
      const provider = new ethers.JsonRpcProvider(
        "https://rpc.anghscan.org/"
      );
      console.log(provider)
      const contract = new ethers.Contract(USDTAddress, erc20Abi, provider);
      const ctr = new ethers.Contract(contractAddress, contractAbi, provider);
     
      const balance = await contract.balanceOf("0xFe3039741Bac9F107Ee5EF8d55a0a9BbF1837572");
      const decimals = await contract.decimals();
      const formatted = formatUnits(balance, decimals);
      console.log(formatted);
      setUsdtBalance(formatted);

      const data2 = await ctr.getUserStats(companyWalletAddress);
      
      const formattedStats = data2.map((v, i) =>
        i > 2 ? formatUnits(v, 18) : v.toString()
      );
      console.log(formattedStats)
      setUserStats(formattedStats);
    } catch (error) {
      console.log(error)
    } finally {
      setBalanceLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://bytrixone.com/${account}`)
      .then(() => alert("Referral Link Copied!"))
      .catch((e) => alert("Error Occurred", e));
  };

  return (
 <>
     <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-white overflow-hidden ">

      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={videoBg}
        autoPlay
        loop
        muted
      />

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 w-full">

        {/* LOGO SECTION */}
        {/* <div className="w-28 h-28 rounded-2xl flex items-center justify-center 
            bg-gradient-to-br from-[#00ff8f] to-[#0affd9] 
            shadow-[0_0_30px_rgba(0,255,200,0.4)]">
          <span className="text-5xl font-extrabold text-black">⚡</span>
        </div> */}
            <img src="/logo.png" alt="Logo" className="w-[250px] h-[200px]" />


        <h1 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-wide">
          BYTRIX ONE
        </h1>

        <p className="text-white mt-2 text-xl  ">
          The next generation cryptocurrency ecosystem
        </p>

        {/* BUTTON */}
        {!isConnected ? (
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-8 py-3 rounded-full text-black font-bold 
              bg-gradient-to-r from-[#00ff9d] to-[#00ffd9] 
              shadow-[0_0_20px_rgba(0,255,200,0.4)] hover:scale-105 transition-all"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handleCopy}
            className="mt-6 px-8 py-3 rounded-full text-black font-bold 
              bg-gradient-to-r from-[#00ff9d] to-[#00ffd9] 
              shadow-[0_0_20px_rgba(0,255,200,0.4)] hover:scale-105 transition-all flex items-center gap-2"
          >
            Join Now <Copy size={20} />
          </button>
        )}

        {/* STATS BOXES */}
        <div className="flex flex-col md:flex-row gap-6 mt-12">

          {/* Participants */}
          <div className="w-90 bg-black/60 backdrop-blur-xl border border-[#00ff9d]/30 
              shadow-[0_0_20px_rgba(0,255,150,0.3)] px-10 py-6 rounded-2xl text-center">
            <p className="text-gray-300 text-sm">Participants</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#00ff9d]">
              {userStats[0] || 0}
            </h2>
          </div>

          {/* Participant Income */}
          {/* <div className="bg-black/60 backdrop-blur-xl border border-[#00eaff]/30 
              shadow-[0_0_20px_rgba(0,200,255,0.3)] px-10 py-6 rounded-2xl text-center">
            <p className="text-gray-300 text-sm">Participant Income</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2db2ff]">
              {userStats[1] || 0} USDT
            </h2>
          </div> */}

          {/* Liquidity */}
          {/* <div className="w-90 bg-black/60 backdrop-blur-xl border border-[#ffea00]/30 
              shadow-[0_0_20px_rgba(255,255,0,0.3)] px-10 py-6 rounded-2xl text-center">
            <p className="text-gray-300 text-sm">Liquidity</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ffe600]">
             {balanceLoading ? "Loading..." : Math.round(parseFloat(usdtBalance))}
           
            </h2>
          </div> */}


          <a
  href="https://anghscan.org/address/0xFe3039741Bac9F107Ee5EF8d55a0a9BbF1837572"
  target="_blank"
  rel="noopener noreferrer"
  className="block"
>
  <div
    className="w-90 bg-black/60 backdrop-blur-xl border border-[#ffea00]/30 
    shadow-[0_0_20px_rgba(255,255,0,0.3)] px-10 py-6 rounded-2xl text-center cursor-pointer"
  >
    <p className="text-gray-300 text-sm">Liquidity</p>
    <h2 className="text-2xl md:text-3xl font-bold text-[#ffe600]">
      {balanceLoading ? "Loading..." : Math.round(parseFloat(usdtBalance))}
    </h2>
  </div>
</a>


        </div>
      </div>
    </div>
<Content />
    </>

  );
}

export default Home;
