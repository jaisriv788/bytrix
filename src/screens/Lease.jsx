import { useState } from "react"
import Hero from "../components/lease/Hero"
import { Orders } from "../components/lease/Orders"

function Lease({ showModal }) {
    const [reloadData, setReloadData] = useState(false)
    return (
        <>
      
            <Hero showModal={showModal} reloadData={reloadData} setReloadData={setReloadData} />
            <Orders reloadData={reloadData} setReloadData={setReloadData} />
       
        </>
    )
}

export default Lease