import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setReferrer } from "../redux/slice/userDetails";

function Home() {
  const { ref } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    ref ? dispatch(setReferrer(ref)) : dispatch(setReferrer(""))
  }, [])

  return <div className="min-h-screen flex items-center">Home</div>;
}

export default Home;
