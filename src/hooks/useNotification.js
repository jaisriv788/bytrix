import { useDispatch } from "react-redux";
import {
  isSuccessModalVisible,
  isErrorModalVisible,
  setMessage,
} from "../redux/slice/modalSlice";

export const useNotification = () => {
  const dispatch = useDispatch();

  const showSuccess = (msg) => {
    dispatch(setMessage(msg));
    dispatch(isSuccessModalVisible(true));
    setTimeout(() => {
      dispatch(setMessage(""));
      dispatch(isSuccessModalVisible(false));
    }, 1500);
  };

  const showError = (msg) => {
    dispatch(setMessage(msg));
    dispatch(isErrorModalVisible(true));
    setTimeout(() => {
      dispatch(setMessage(""));
      dispatch(isErrorModalVisible(false));
    }, 1500);
  };
  return { showSuccess, showError };
};
