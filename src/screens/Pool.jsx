import Hero from "../components/pool/Hero";
import Order from "../components/pool/Orders";
import FriendAddres from "../components/pool/FriendAddress";
import Faq from "../components/pool/Faq";
import { useState } from "react";

function Pool({ showModal }) {
  const [userStats, setUserStats] = useState([]);
  const [userDataTable, setUserDataTable] = useState([]);
  return (
    <>
      <Hero
        showModal={showModal}
        setUserStats={setUserStats}
        setData={setUserDataTable}
      />
      <Order tableData={userDataTable} />
      <FriendAddres stats={userStats} />
      <Faq />
    </>
  );
}

export default Pool;
