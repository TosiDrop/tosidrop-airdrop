export interface Token {
  name: string;
  amount: number;
}

export interface GlobalState {
  darkTheme: boolean;
  tokenArray: Token[];
  selectedToken: Token;
  addressArray: AddressAmount[];
  totalAmountToAirdrop: number;
}

export type API = object | undefined;

export interface BlockchainState {
  api: API;
  walletAddress: string;
}

export enum WalletName {
  NAMI = "nami",
  CCVAULT = "ccvault",
}

export interface AssetsSummary {
  [key: string]: number;
}

export interface AddressAmount {
  address: string;
  amount: number;
}
