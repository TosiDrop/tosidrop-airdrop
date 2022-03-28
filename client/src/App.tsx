import { useEffect } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import Navbar from "components/Navbar";
import AirdropTool from "components/AirdropTool";
import PopUp from "components/PopUp";
import useBackgroundImage from "hooks/useBackgroundImage";
import useDualThemeClass from "hooks/useDualThemeClass";
import useWallet from "hooks/useWallet";
import {
  resetSelectedToken,
  setDarkTheme,
  setLoadingApi,
  setTokenArray,
} from "reducers/globalSlice";
import { setWalletAddress, setPopUp } from "reducers/globalSlice";
import { Address } from "@emurgo/cardano-serialization-lib-asmjs";
import { Buffer } from "buffer";
import usePopUp from "hooks/usePopUp";
import "App.scss";

function App() {
  const { setPopUpError } = usePopUp();
  const CONTAINER_CLASS = useDualThemeClass({ main: "container", el: "" })[0];
  const dispatch = useDispatch();
  const api = useSelector((state: RootStateOrAny) => state.global.api);
  const { getTokenArrayInWallet, enableWallet } = useWallet();

  useEffect(() => {
    /**
     * Use setInterval so we can retry if wallet
     * does not want to connect
     */
    const enableWalletInterval = setInterval(() => {
      try {
        const selectedWallet = localStorage.getItem("wallet");
        if (selectedWallet) {
          enableWallet(selectedWallet);
        }
        console.log("wallet connected");
        clearInterval(enableWalletInterval);
      } catch (e) {
        console.log("wallet not ready");
      }
    }, 100);
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "true") {
      dispatch(setDarkTheme(true));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    /**
     * check if wallet is connected
     * and api is working
     */
    (async function () {
      if (api == null) return;
      let address = (await api.getUsedAddresses())[0];

      /**
       * if api changes, set tokenArrayInWallet to []
       * so that it is locked until the new one syncs
       */
      dispatch(resetSelectedToken());
      dispatch(setTokenArray([]));
      dispatch(setLoadingApi(true));

      try {
        address = Address.from_bytes(Buffer.from(address, "hex")).to_bech32();
        if (address) {
          dispatch(setWalletAddress(address));
        }
      } catch (err: any) {
        setPopUpError(err.message);
      }

      await getTokenArrayInWallet(api);
      dispatch(setLoadingApi(false));
    })();
  }, [api]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App" style={useBackgroundImage()}>
      <div className={CONTAINER_CLASS}>
        <Navbar></Navbar>
        <AirdropTool></AirdropTool>
        <PopUp></PopUp>
      </div>
    </div>
  );
}

export default App;
