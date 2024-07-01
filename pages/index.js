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
        <button onClick={connectAccount} className="btn-connect">
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
      <div className="info-container">
        <p><strong>Your Account:</strong> {account}</p>
        <p><strong>Token Name:</strong> {tokenName}</p>
        <p><strong>Token Abbreviation:</strong> {tokenAbbreviation}</p>
        <p><strong>Total Supply:</strong> {totalSupply}</p>
        <p><strong>Your Balance:</strong> {balance}</p>
        <div className="input-group">
          <input
            type="number"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(Number(e.target.value))}
            placeholder="Amount to recharge"
            className="input-field"
          />
          <button onClick={recharge} className="btn-recharge">Recharge</button>
        </div>
        <div className="input-group">
          <input
            type="number"
            value={redeemItemAmount}
            onChange={(e) => setRedeemItemAmount(Number(e.target.value))}
            placeholder="Amount to redeem item"
            className="input-field"
          />
          <input
            type="text"
            value={redeemItemName}
            onChange={(e) => setRedeemItemName(e.target.value)}
            placeholder="Item name"
            className="input-field"
          />
          <button onClick={redeemItem} className="btn-redeem">Redeem Item</button>
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
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            padding: 20px;
            font-family: 'Arial', sans-serif;
            color: #333;
            animation: fadeIn 1.5s ease-in-out;
            background-image: url('https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
            background-size: cover;
            background-attachment: fixed;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          header {
            margin-bottom: 20px;
          }
          h1 {
            font-size: 2.5em;
            font-weight: bold;
            color: #1d3557;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            margin: 0;
            animation: slideIn 1s ease-in-out;
          }
          @keyframes slideIn {
            from {
              transform: translateY(-50px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .info-container {
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            animation: fadeIn 1.5s ease-in-out;
          }
          .input-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }
          .input-field {
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s;
          }
          .input-field:focus {
            border-color: #1d3557;
            outline: none;
          }
          .btn-connect, .btn-recharge, .btn-redeem {
            padding: 10px 20px;
            background-color: #1d3557;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s, transform 0.3s;
            margin-top: 10px;
          }
          .btn-connect:hover, .btn-recharge:hover, .btn-redeem:hover {
            background-color: #457b9d;
            transform: translateY(-2px);
          }
          .btn-connect:active, .btn-recharge:active, .btn-redeem:active {
            background-color: #1d3557;
            transform: translateY(0);
          }
        `}
      </style>
    </main>
  );
}
