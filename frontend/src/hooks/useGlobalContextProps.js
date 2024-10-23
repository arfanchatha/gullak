import { useContext } from "react";
import GlobalContext from "../components/GlobalContext";
export function useGlobalContextProps() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContextProps must be used within a GlobalContextProvider"
    );
  }
  return context;
}
