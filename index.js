import { useState, useEffect } from "react";
import { ethers } from "ethers";
import gameTokenAbi from "../artifacts/contracts/GameToken.sol/GameToken.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [gameToken, setGameToken] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [tokenName, setTokenName] = useState(undefined);
  const [tokenAbbreviation, setTokenAbbreviation] = useState(undefined);
  const [totalSupply, setTotalSupply] = useState(undefined);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [redeemItemAmount, setRedeemItemAmount] = useState(0);
  const [redeemItemName, setRedeemItemName] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const gameTokenABI = gameTokenAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getGameTokenContract();
  };

  const getGameTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const gameTokenContract = new ethers.Contract(contractAddress, gameTokenABI, signer);

    setGameToken(gameTokenContract);
  };

  const getBalance = async () => {
    if (gameToken) {
      setBalance((await gameToken.getBalance()).toNumber());
    }
  };

  const getTotalSupply = async () => {
    if (gameToken) {
      setTotalSupply((await gameToken.getTotalSupply()).toNumber());
    }
  };

  const getTokenName = async () => {
    if (gameToken) {
      setTokenName(await gameToken.getTokenName());
    }
  };

  const getTokenAbbreviation = async () => {
    if (gameToken) {
      setTokenAbbreviation(await gameToken.getTokenAbbrv());
    }
  };

  const recharge = async () => {
    if (gameToken && rechargeAmount > 0) {
      let tx = await gameToken.recharge(account, rechargeAmount);
      await tx.wait();
      getTotalSupply();
      getBalance();
    }
  };


  const redeemItem = async () => {
    if (gameToken && redeemItemAmount > 0 && redeemItemName) {
      let tx = await gameToken.redeemItem(account, redeemItemAmount /*, redeemItemName */);
      await tx.wait();
      getTotalSupply();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    if (tokenName === undefined) {
      getTokenName();
      getTotalSupply();
    }

    if (tokenAbbreviation === undefined) {
      getTokenAbbreviation();
    }
    
    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Token Name: {tokenName}</p>
        <p>Token Abbreviation: {tokenAbbreviation}</p>
        <p>Total Supply: {totalSupply}</p>
        <p>Your Balance: {balance}</p>
        <div>
          <input
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(Number(e.target.value))}
            placeholder="Amount to recharge"
          />
          <button onClick={recharge}>Recharge</button>
        </div>
        <div>
          <input
            type="number"
            value={redeemItemAmount}
            onChange={(e) => setRedeemItemAmount(Number(e.target.value))}
            placeholder="Amount to redeem item"
          />
          <input
            type="text"
            value={redeemItemName}
            onChange={(e) => setRedeemItemName(e.target.value)}
            placeholder="Item name"
          />
          <button onClick={redeemItem}>Redeem Item</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Game Token Manager!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}
