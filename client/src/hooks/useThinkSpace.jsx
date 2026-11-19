import { useContext } from "react";
import { ThinkSpaceContext } from "../../provider/Provider";

const useThinkSpace = () => {
  return useContext(ThinkSpaceContext);
};

export default useThinkSpace;
