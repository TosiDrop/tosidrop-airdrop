import { useSelector, RootStateOrAny } from "react-redux";
import { Button } from "@arco-design/web-react";
import { IconSend } from "@arco-design/web-react/icon";
import { ClassNames } from "utils";
import "./index.scss";

const COMPONENT_CLASS = "token-detail";

interface Props {
  execAirdrop: Function;
  validateAirdropRequest: Function;
  adaToSpend: Number;
  fee: number;
  isAbleToAirdrop: boolean;
}

export default function TokenDetail({
  execAirdrop,
  adaToSpend,
  fee,
  validateAirdropRequest,
  isAbleToAirdrop,
}: Props) {
  const { selectedToken, addressArray, totalAmountToAirdrop } = useSelector(
    (state: RootStateOrAny) => state.global
  );

  const addressArrayLength = addressArray.length;

  return (
    <div className={COMPONENT_CLASS}>
      <div className={`${COMPONENT_CLASS}__row`}>
        <span>Balance in wallet</span>
        <span>
          {(
            selectedToken.amount / Math.pow(10, selectedToken.decimals)
          ).toFixed(2)}{" "}
          {selectedToken.name}
        </span>
      </div>
      <div className={`${COMPONENT_CLASS}__row`}>
        <span>Total tokens to be airdropped</span>
        <span>
          {totalAmountToAirdrop} {selectedToken.name}
        </span>
      </div>
      <div className={`${COMPONENT_CLASS}__row`}>
        <span>Total ADA to spend</span>
        <span>{adaToSpend} ADA</span>
      </div>
      <div className={`${COMPONENT_CLASS}__row`}>
        <span>Estimated transaction fee</span>
        <span>{fee} ADA</span>
      </div>
      <div className={`${COMPONENT_CLASS}__row`}>
        <Button
          className={ClassNames.TOSIDROP_BTN}
          onClick={() => validateAirdropRequest()}
          disabled={
            totalAmountToAirdrop === 0 ||
            selectedToken.name === "" ||
            addressArrayLength === 0 ||
            isAbleToAirdrop
          }
        >
          Validate Airdrop
        </Button>
      </div>
      <div className={`${COMPONENT_CLASS}__row`}>
        <Button
          className={ClassNames.TOSIDROP_BTN}
          onClick={() => execAirdrop()}
          disabled={!isAbleToAirdrop}
        >
          Airdrop
          <IconSend />
        </Button>
      </div>
    </div>
  );
}
