import Hero from "../components/lease/Hero"
import { Orders } from "../components/lease/Orders"

function Lease({ showModal }) {
    return (
        <div>
            <Hero showModal={showModal} />
            <Orders />
        </div>
    )
}

export default Lease