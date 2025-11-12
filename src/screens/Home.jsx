import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setReferrer } from "../redux/slice/userDetails";
import videoBg from "../assets/v3.mp4"
import { Copy } from "lucide-react";
function Home() {
  const { ref } = useParams();

  const account = useSelector((state) => state.user.walletAddress);

  const dispatch = useDispatch();

  useEffect(() => {
    ref ? dispatch(setReferrer(ref)) : dispatch(setReferrer(""))
  }, [])

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
      <div className="flex flex-col backdrop-blur-xl p-15 border rounded-4xl border-gray-500 font-bold items-center gap-2 z-0 ">
        <span style={{ animationDuration: "2.5s" }} className="bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-5xl md:text-7xl lg:text-8xl animate-bounce font-extrabold text-transparent bg-clip-text">
          35,265,653
        </span>

        <div className="bg-gradient-to-r border-2 border-[#00BFFF] px-3 rounded-lg from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
          Liquidity
        </div>
        <div className="mt-15 text-base text-center md:text-xl lg:text-2xl">№1
          Join BitNest to create a newWeb 3.0 economy financial system</div>
        <button onClick={() => {
          navigator.clipboard
            .writeText(`http://localhost:5173/bytrix/${account}`)
            .then(() => alert("Referral Link Copied!"))
            .catch((e) => alert("Error Occurred", e));
        }} className="flex items-center gap-3 animated-gradient h-full font-bold rounded-lg text-lg mt-20 px-20 py-3 cursor-pointer"
        >Invite Friend <Copy /></button>

      </div>

    </div>
  );
}

export default Home;
