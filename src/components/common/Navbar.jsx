import {
  Copy,
  DollarSign,
  HandCoins,
  Home,
  LogOut,
  Menu,
  Power,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setConnection, setAddress, setReferrer } from "../../redux/slice/userDetails";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";

const Navbar = ({ showModal }) => {
  const [wallets, setWallets] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const connectedWallet = sessionStorage.getItem("walletName");

  const isConnected = useSelector((state) => state.user.isConnected);
  const account = useSelector((state) => state.user.walletAddress);
  const referrer = useSelector((state) => state.user.referrer)

  const isHome = location.pathname === "/";
  const isLoop = location.pathname === "/loop";
  const isSaving = location.pathname === "/saving";
  const isSavingTotal = location.pathname === "/saving/total";

  function handleLogout() {
    dispatch(setAddress(null));
    dispatch(setConnection(false));
    dispatch(setReferrer(""))
    navigate("/")
    sessionStorage.clear();
  }

  useEffect(() => {
    // console.log("hi");
    setWallets([]);

    function handler(event) {
      setWallets((prev) => {
        if (prev.find((p) => p.info.uuid === event.detail.info.uuid)) {
          return prev;
        }
        return [...prev, event.detail];
      });
    }
    window.addEventListener("eip6963:announceProvider", handler);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener("eip6963:announceProvider", handler);
  }, []);

  return (
    <div className="fixed flex z-10 justify-between top-0 bg-black/40 backdrop-blur-lg w-full text-lg py-4 px-3 md:px-10 lg:px-28">
      <div className="flex gap-10">
        <div className="flex font-bold text-xl items-center gap-2">
          <div className="w-9 h-9 flex items-center justify-center">
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
        <div className="text-gray-300 hidden md:flex items-center gap-5 font-bold text-base">
          <Link
            to={referrer ? `/` + referrer : "/"}
            className={`${isHome ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"
              } transition ease-in-out duration-300`}
          >
            Home
          </Link>
          <Link
            to={referrer ? `/loop/` + referrer : "/loop"}
            className={`${isLoop ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"
              } transition ease-in-out duration-300`}
          >
            Loop
          </Link>
          <Link
            to={referrer ? `/saving/` + referrer : "/saving"}
            className={`${isSaving || isSavingTotal
              ? "text-[#00FFFF]"
              : "hover:text-[#00FFFF]"
              } transition ease-in-out duration-300`}
          >
            Savings
          </Link>
        </div>
      </div>

      <div className="hidden md:flex gap-1.5 items-center">
        {isConnected && (
          <Copy
            size={16}
            strokeWidth={3}
            onClick={() =>
              navigator.clipboard
                .writeText(account)
                .then(() => alert("Address Copied!"))
                .catch((e) => alert("Error Occured", e))
            }
            className="text-[#08e7d5] hover:text-[#0afcb3] cursor-pointer transition ease-in-out duration-300"
          />
        )}
        <button
          onClick={() => {
            showModal(true);
          }}
          className="animated-gradient flex gap-2 items-center h-full font-semibold rounded-lg text-base px-2 cursor-pointer"
        >
          {account
            ? account.slice(0, 4) + "..." + account.slice(-4)
            : "Connect Wallet"}
          {isConnected &&
            wallets
              .filter((item) => item.info.name === connectedWallet)
              .map((item, index) => (
                <img
                  key={index}
                  src={item.info.icon}
                  alt={item.info.name}
                  className="h-4 w-4"
                />
              ))}
        </button>
        {/* <button className="animated-gradient px-5 cursor-pointer rounded-lg">hello</button> */}
        {isConnected && (
          <button
            onClick={handleLogout}
            className="animated-gradient h-full font-semibold rounded-lg text-base px-4 cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>

      <div className="dropdown dropdown-end block md:hidden ">
        <div
          tabIndex={0}
          role="button"
          className="m-1 cursor-pointer text-white"
        >
          <Menu />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-slate-500 text-white font-semibold rounded-box z-50 w-52 p-2 shadow-sm"
        >
          <div className="border-b mb-1">Navigation</div>
          <li
            onClick={() => navigate(referrer ? `/` + referrer : "/")}
          >
            <a>
              <Home size={15} />
              Home
            </a>
          </li>
          <li onClick={() => navigate(referrer ? `/loop/` + referrer : "/loop")}>
            <a>
              <DollarSign size={15} />
              Loop
            </a>
          </li>
          <li
            onClick={() => navigate(referrer ? `/saving/` + referrer : "/saving")}
          >
            <a>
              <HandCoins size={15} />
              Saving
            </a>
          </li>

          <div className="border-b mt-2 mb-1">Connections</div>
          <li
            onClick={() => {
              showModal(true);
            }}
          >
            <a>
              <Power size={15} />
              {account
                ? account.slice(0, 4) + "..." + account.slice(-4)
                : "Connect Wallet"}
              {isConnected &&
                wallets
                  .filter((item) => item.info.name === connectedWallet)
                  .map((item, index) => (
                    <img
                      key={index}
                      src={item.info.icon}
                      alt={item.info.name}
                      className="h-4 w-4"
                    />
                  ))}
            </a>
          </li>
          {isConnected && (
            <li
              onClick={() =>
                navigator.clipboard
                  .writeText(account)
                  .then(() => alert("Address Copied!"))
                  .catch((e) => alert("Error Occured", e))
              }
            >
              <a>
                <Copy size={15} />
                Copy Address
              </a>
            </li>
          )}
          {isConnected && (
            <li onClick={handleLogout}>
              <a>
                <LogOut size={15} />
                Logout
              </a>
            </li>
          )}
        </ul>
      </div>
    </div >
  );
};

export default Navbar;
