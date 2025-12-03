// import {
//   Copy,
//   DollarSign,
//   HandCoins,
//   Home,
//   LogOut,
//   Menu,
//   Power,
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { setConnection, setAddress, setReferrer } from "../../redux/slice/userDetails";
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation, matchPath } from "react-router";

// const Navbar = ({ showModal }) => {
//   const [wallets, setWallets] = useState([]);

//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const connectedWallet = sessionStorage.getItem("walletName");

//   const isConnected = useSelector((state) => state.user.isConnected);
//   const account = useSelector((state) => state.user.walletAddress);
//   const referrer = useSelector((state) => state.user.referrer)

//   const path = location.pathname;

//   const isHome =
//     matchPath({ path: "/:ref?" }, path) &&
//     !path.startsWith("/loop") &&
//     !path.startsWith("/saving") && !path.startsWith("/lease");

//   const isLoop = matchPath({ path: "/loop/:ref?" }, path);
//   const isSaving = matchPath({ path: "/saving/:ref?" }, path);
//   const isSavingTotal = matchPath({ path: "/saving/total/:ref?" }, path);
//   const isSavingForm = matchPath({ path: "/saving/form/:ref?" }, path);
//   const isSavingOrder = matchPath({ path: "/saving/orders/:ref?" }, path);
//   const isLease = matchPath({ path: "/lease/:ref?" }, path);

//   function handleLogout() {
//     dispatch(setAddress(null));
//     dispatch(setConnection(false));
//     dispatch(setReferrer(""))
//     navigate("/")
//     sessionStorage.clear();
//   }

//   useEffect(() => {
//     // console.log("hi");
//     setWallets([]);

//     function handler(event) {
//       setWallets((prev) => {
//         if (prev.find((p) => p.info.uuid === event.detail.info.uuid)) {
//           return prev;
//         }
//         return [...prev, event.detail];
//       });
//     }
//     window.addEventListener("eip6963:announceProvider", handler);
//     window.dispatchEvent(new Event("eip6963:requestProvider"));

//     return () =>
//       window.removeEventListener("eip6963:announceProvider", handler);
//   }, []);

//   return (
//     <div className="fixed flex z-10 justify-between top-0 bg-black/40 backdrop-blur-lg w-full text-lg py-4 px-3 md:px-10 lg:px-28">
//       <div className="flex gap-10">
//         <div className="flex font-bold text-xl items-center gap-2">
//           <div className=" flex items-center justify-center">
//             {/* <svg viewBox="0 0 200 200" className="w-full h-full">
//               <circle cx="100" cy="100" r="90" fill="#00BFFF" />

//               <polygon
//                 points="100,30 65,100 115,100 70,170 130,105 85,105"
//                 fill="#00FFFF"
//               />
//             </svg> */}
//             <img src="/logo.png" alt="Logo" className="w-[80px] h-[50px]" />

//           </div>

//           {/* <span className="bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] text-transparent bg-clip-text">
//             Bytrix One
//           </span> */}
//         </div>
//         <div className="text-gray-300 hidden md:flex items-center gap-5 font-bold text-base">
//           <Link
//             to={referrer ? `/` + referrer : "/"}
//             className={`${isHome ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"
//               } transition ease-in-out duration-300`}
//           >
//             Home
//           </Link>
//           <Link
//             to={referrer ? `/loop/` + referrer : "/loop"}
//             className={`${isLoop ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"
//               } transition ease-in-out duration-300`}
//           >
//             Emporium
//           </Link>
//           <Link
//             to={referrer ? `/saving/` + referrer : "/saving"}
//             className={`${isSaving || isSavingTotal || isSavingForm || isSavingOrder
//               ? "text-[#00FFFF]"
//               : "hover:text-[#00FFFF]"
//               } transition ease-in-out duration-300`}
//           >
//             Future
//           </Link>
//           <Link
//             to={referrer ? `/lease/` + referrer : "/lease"}
//             className={`${isLease
//               ? "text-[#00FFFF]"
//               : "hover:text-[#00FFFF]"
//               } transition ease-in-out duration-300`}
//           >
//             Lease
//           </Link>
//         </div>
//       </div>

//       <div className="hidden md:flex gap-1.5 items-center">
//         {isConnected && (
//           <Copy
//             size={16}
//             strokeWidth={3}
//             onClick={() =>
//               navigator.clipboard
//                 .writeText(account)
//                 .then(() => alert("Address Copied!"))
//                 .catch((e) => alert("Error Occured", e))
//             }
//             className="text-[#08e7d5] hover:text-[#0afcb3] cursor-pointer transition ease-in-out duration-300"
//           />
//         )}
//         <button
//           onClick={() => {
//             showModal(true);
//           }}
//           className="animated-gradient flex gap-2 items-center h-full font-semibold rounded-lg text-base px-2 cursor-pointer"
//         >
//           {account
//             ? account.slice(0, 4) + "..." + account.slice(-4)
//             : "Connect Wallet"}
//           {isConnected &&
//             wallets
//               .filter((item) => item.info.name === connectedWallet)
//               .map((item, index) => (
//                 <img
//                   key={index}
//                   src={item.info.icon}
//                   alt={item.info.name}
//                   className="h-4 w-4"
//                 />
//               ))}
//         </button>
//         {/* <button className="animated-gradient px-5 cursor-pointer rounded-lg">hello</button> */}
//         {isConnected && (
//           <button
//             onClick={handleLogout}
//             className="animated-gradient h-full font-semibold rounded-lg text-base px-4 cursor-pointer"
//           >
//             Logout
//           </button>
//         )}
//       </div>

//       <div className="dropdown dropdown-end block md:hidden ">
//         <div
//           tabIndex={0}
//           role="button"
//           className="m-1 cursor-pointer text-white"
//         >
//           <Menu />
//         </div>
//         <ul
//           tabIndex={0}
//           className="dropdown-content menu bg-slate-500 text-white font-semibold rounded-box z-50 w-52 p-2 shadow-sm"
//         >
//           <div className="border-b mb-1">Navigation</div>
//           <li
//             onClick={() => navigate(referrer ? `/` + referrer : "/")}
//           >
//             <a>
//               <Home size={15} />
//               Home
//             </a>
//           </li>
//           <li onClick={() => navigate(referrer ? `/loop/` + referrer : "/loop")}>
//             <a>
//               <DollarSign size={15} />
//               Loop
//             </a>
//           </li>
//           <li
//             onClick={() => navigate(referrer ? `/saving/` + referrer : "/saving")}
//           >
//             <a>
//               <HandCoins size={15} />
//               Saving
//             </a>
//           </li>
//           <li
//             onClick={() => navigate(referrer ? `/lease/` + referrer : "/lease")}
//           >
//             <a>
//               <HandCoins size={15} />
//               Lease
//             </a>
//           </li>

//           <div className="border-b mt-2 mb-1">Connections</div>
//           <li
//             onClick={() => {
//               showModal(true);
//             }}
//           >
//             <a>
//               <Power size={15} />
//               {account
//                 ? account.slice(0, 4) + "..." + account.slice(-4)
//                 : "Connect Wallet"}
//               {isConnected &&
//                 wallets
//                   .filter((item) => item.info.name === connectedWallet)
//                   .map((item, index) => (
//                     <img
//                       key={index}
//                       src={item.info.icon}
//                       alt={item.info.name}
//                       className="h-4 w-4"
//                     />
//                   ))}
//             </a>
//           </li>
//           {isConnected && (
//             <li
//               onClick={() =>
//                 navigator.clipboard
//                   .writeText(account)
//                   .then(() => alert("Address Copied!"))
//                   .catch((e) => alert("Error Occured", e))
//               }
//             >
//               <a>
//                 <Copy size={15} />
//                 Copy Address
//               </a>
//             </li>
//           )}
//           {isConnected && (
//             <li onClick={handleLogout}>
//               <a>
//                 <LogOut size={15} />
//                 Logout
//               </a>
//             </li>
//           )}
//         </ul>
//       </div>
//     </div >
//   );
// };

// export default Navbar;



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
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation, matchPath } from "react-router";

const Navbar = ({ showModal }) => {
  const [wallets, setWallets] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const connectedWallet = sessionStorage.getItem("walletName");

  const isConnected = useSelector((state) => state.user.isConnected);
  const account = useSelector((state) => state.user.walletAddress);
  const referrer = useSelector((state) => state.user.referrer);

  const path = location.pathname;

  const isHome =
    matchPath({ path: "/:ref?" }, path) &&
    !path.startsWith("/loop") &&
    !path.startsWith("/saving") &&
    !path.startsWith("/lease");

  const isLoop = matchPath({ path: "/loop/:ref?" }, path);
  const isSaving =
    matchPath({ path: "/saving/:ref?" }, path) ||
    matchPath({ path: "/saving/total/:ref?" }, path) ||
    matchPath({ path: "/saving/form/:ref?" }, path) ||
    matchPath({ path: "/saving/orders/:ref?" }, path);

  const isLease = matchPath({ path: "/lease/:ref?" }, path);

  const handleLogout = () => {
    dispatch(setAddress(null));
    dispatch(setConnection(false));
    dispatch(setReferrer(""));
    navigate("/");
    sessionStorage.clear();
  };

  useEffect(() => {
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

    return () => window.removeEventListener("eip6963:announceProvider", handler);
  }, []);

  // ---- mobile menu helpers: close on outside click, escape key, route change ----
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // outside click & escape key
  useEffect(() => {
    function handleDocClick(e) {
      if (!mobileOpen) return;
      const menuEl = mobileMenuRef.current;
      const btnEl = menuButtonRef.current;
      if (menuEl && !menuEl.contains(e.target) && btnEl && !btnEl.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("touchstart", handleDocClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("touchstart", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mobileOpen]);

  return (
    <div className="fixed flex z-50 justify-between top-0 bg-black/40 backdrop-blur-lg w-full text-lg py-4 px-3 md:px-10 lg:px-28">
      {/* Logo & Desktop Menu */}
      <div className="flex gap-10">
        <div className="flex font-bold text-xl items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-[80px] h-[50px]" />
        </div>

        <div className="text-gray-300 hidden md:flex items-center gap-5 font-bold text-base">
          <Link
            to={referrer ? `/${referrer}` : "/"}
            className={`${isHome ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"} transition ease-in-out duration-300`}
          >
            Home
          </Link>
          <Link
            to={referrer ? `/loop/${referrer}` : "/loop"}
            className={`${isLoop ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"} transition ease-in-out duration-300`}
          >
            Emporium
          </Link>
          <Link
            to={referrer ? `/saving/${referrer}` : "/saving"}
            className={`${isSaving ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"} transition ease-in-out duration-300`}
          >
            Future
          </Link>
          <Link
            to={referrer ? `/lease/${referrer}` : "/lease"}
            className={`${isLease ? "text-[#00FFFF]" : "hover:text-[#00FFFF]"} transition ease-in-out duration-300`}
          >
            Lease
          </Link>
        </div>
      </div>

      {/* Desktop Wallet / Actions */}
      <div className="hidden md:flex gap-1.5 items-center">
        {isConnected && (
          <Copy
            size={16}
            strokeWidth={3}
            onClick={() =>
              navigator.clipboard
                .writeText(account)
                .then(() => alert("Address Copied!"))
                .catch((e) => alert("Error Occurred", e))
            }
            className="text-[#08e7d5] hover:text-[#0afcb3] cursor-pointer transition ease-in-out duration-300"
          />
        )}
        <button
          onClick={() => showModal(true)}
          className="animated-gradient flex gap-2 items-center h-full font-semibold rounded-lg text-base px-2 cursor-pointer"
        >
          {account ? account.slice(0, 4) + "..." + account.slice(-4) : "Connect Wallet"}
          {isConnected &&
            wallets
              .filter((item) => item.info.name === connectedWallet)
              .map((item, index) => (
                <img key={index} src={item.info.icon} alt={item.info.name} className="h-4 w-4" />
              ))}
        </button>

        {isConnected && (
          <button
            onClick={handleLogout}
            className="animated-gradient h-full font-semibold rounded-lg text-base px-4 cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden relative">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileOpen((s) => !s)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="p-2 rounded-md text-white z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FFFF]"
        >
          <Menu />
        </button>

        {mobileOpen && (
          <ul
            id="mobile-menu"
            ref={mobileMenuRef}
            className="absolute right-0 mt-2 menu bg-slate-700 text-white font-semibold rounded-md z-50 w-56 p-2 shadow-lg"
          >
            <div className="border-b mb-1 px-2 py-1 text-slate-200">Navigation</div>

            <li
              className="px-2 py-1 hover:bg-slate-600 rounded"
              onClick={() => {
                navigate(referrer ? `/${referrer}` : "/");
                setMobileOpen(false);
              }}
            >
              <a className="flex items-center gap-2"><Home size={15} /> Home</a>
            </li>

            <li
              className="px-2 py-1 hover:bg-slate-600 rounded"
              onClick={() => {
                navigate(referrer ? `/loop/${referrer}` : "/loop");
                setMobileOpen(false);
              }}
            >
              <a className="flex items-center gap-2"><DollarSign size={15} /> Emporium</a>
            </li>

            <li
              className="px-2 py-1 hover:bg-slate-600 rounded"
              onClick={() => {
                navigate(referrer ? `/saving/${referrer}` : "/saving");
                setMobileOpen(false);
              }}
            >
              <a className="flex items-center gap-2"><HandCoins size={15} /> Future</a>
            </li>

            <li
              className="px-2 py-1 hover:bg-slate-600 rounded"
              onClick={() => {
                navigate(referrer ? `/lease/${referrer}` : "/lease");
                setMobileOpen(false);
              }}
            >
              <a className="flex items-center gap-2"><HandCoins size={15} /> Lease</a>
            </li>

            <div className="border-b mt-2 mb-1 px-2 py-1 text-slate-200">Connections</div>

            <li
              className="px-2 py-1 hover:bg-slate-600 rounded"
              onClick={() => {
                showModal(true);
                setMobileOpen(false);
              }}
            >
              <a className="flex items-center gap-2"><Power size={15} /> {account ? account.slice(0, 4) + "..." + account.slice(-4) : "Connect Wallet"}</a>
            </li>

            {isConnected && (
              <li
                className="px-2 py-1 hover:bg-slate-600 rounded"
                onClick={() => {
                  navigator.clipboard.writeText(account).then(() => alert("Copied")).catch(() => alert("Copy failed"));
                  setMobileOpen(false);
                }}
              >
                <a className="flex items-center gap-2"><Copy size={15} /> Copy Address</a>
              </li>
            )}

            {isConnected && (
              <li
                className="px-2 py-1 hover:bg-slate-600 rounded"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
              >
                <a className="flex items-center gap-2"><LogOut size={15} /> Logout</a>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
