import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setReferrer } from "../redux/slice/userDetails";
import videoBg from "../assets/v3.mp4";
import { Copy } from "lucide-react";

function Home({ setShowModal }) {
  const { ref } = useParams();
  const account = useSelector((state) => state.user.walletAddress);
  const isConnected = useSelector((state) => state.user.isConnected)
  const dispatch = useDispatch();

  useEffect(() => {
    ref ? dispatch(setReferrer(ref)) : dispatch(setReferrer(""));
  }, [ref, dispatch]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://bytrixone.com/${account}`)
      .then(() => alert("Referral Link Copied!"))
      .catch((e) => alert("Error Occurred", e));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white px-4">
      {/* 🎥 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🔲 Overlay for visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-0"></div>

      {/* 🌌 Main Content */}
      <div className="relative z-0 flex flex-col items-center text-center backdrop-blur-2xl border border-cyan-400/40 bg-white/10 shadow-[0_0_30px_rgba(0,191,255,0.3)] rounded-3xl px-8 py-12 max-w-3xl mx-auto">
        <span
          style={{ animationDuration: "2.5s" }}
          className="bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-5xl md:text-7xl lg:text-8xl animate-bounce font-extrabold text-transparent bg-clip-text "
        >
          35,265,653
        </span>

        <div className="mt-2 text-xl font-semibold text-cyan-300 tracking-wide">
          Liquidity
        </div>

        <p className="mt-6 text-gray-200 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl">
          Partner with <span className="text-cyan-400 font-semibold">Bytrix One</span> to pioneer a transformative Web 3.0 financial infrastructure.
        </p>

        {!isConnected ? <button
          onClick={() => setShowModal(true)}
          className="flex cursor-pointer items-center gap-2 mt-10 px-8 py-3 text-lg font-bold rounded-xl 
                     bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]
                     hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all duration-300 transform hover:scale-105"
        >
          Connect Wallet
        </button> : <button
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-2 mt-10 px-8 py-3 text-lg font-bold rounded-xl 
                     bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]
                     hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all duration-300 transform hover:scale-105"
        >
          Invite Friend <Copy size={20} />
        </button>}
      </div>
    </div>
  );
}

export default Home;
