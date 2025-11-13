import Pool from "./screens/Pool";
import Home from "./screens/Home";
import Saving from "./screens/Saving";
import { Routes, Route, useLocation } from "react-router";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import WalletOptions from "./components/WalletOptions";
import Total from "./components/saving/Total";
import Form from "./components/saving/Form";
import SavingOrders from "./components/saving/SavingOrders";
import Lease from "./screens/Lease";
import { useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";


function App() {
  const [showModal, setShowModal] = useState(false);

  const showSuccessModal = useSelector(
    (state) => state.showModal.showSuccessModal
  );
  const showErrorModal = useSelector((state) => state.showModal.showErrorModal);
  const msg = useSelector((state) => state.showModal.message);

  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  function visibility(val) {
    setShowModal(val);
  }

  return (
    <div>
      {showSuccessModal && (
        <div
          role="alert"
          className="fixed right-2 bottom-2 opacity-85 text-white font-semibold bg-emerald-500 alert alert-success z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{msg}</span>
        </div>
      )}

      {showErrorModal && (
        <div
          role="alert"
          className="fixed z-50 right-2 bottom-2  bg-red-500 opacity-85 text-white font-semibold alert alert-error"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{msg}</span>
        </div>
      )}

      {showModal && <WalletOptions showModal={visibility} />}

      <Navbar showModal={visibility} />
      <Routes key={pathname}>
        <Route path="/:ref?" element={<Home setShowModal={setShowModal} />} />
        <Route path="/loop/:ref?" element={<Pool showModal={visibility} />} />
        <Route path="/saving/:ref?" element={<Saving />} />
        <Route path="/saving/total/:ref?" element={<Total />} />
        <Route path="/saving/form/:ref?" element={<Form showModal={visibility} />} />
        <Route path="/saving/orders/:ref?" element={<SavingOrders />} />
        <Route path="/lease/:ref?" element={<Lease showModal={visibility} />} />
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex justify-center items-center">
              Page Not Found
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
