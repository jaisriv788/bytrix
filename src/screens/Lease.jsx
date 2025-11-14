import { useState } from "react"
import Hero from "../components/lease/Hero"
import { Orders } from "../components/lease/Orders"

function Lease({ showModal }) {
    const [reloadData, setReloadData] = useState(false)
    return (
        <div>
            <Hero showModal={showModal} setReloadData={setReloadData} />
            <Orders reloadData={reloadData} />
        </div>
    )
}

export default Lease