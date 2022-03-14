import logo from './logo.svg';
import './App.css';
import { useConnect } from 'wagmi'
import { useState, useEffect } from 'react'
import { ethers } from "ethers";
import DynamicNFT from "./util/DynamicNFT.json";

function App () {
  const [{ data, error }, connect] = useConnect();
  const [currentAccount, setCurrentAccount] = useState("");
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  const CONTRACT_ADDRESS = "0xF9C90fAdEBe19117a000588E3ff5D6A8AAF00f57";

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const mintNFT = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, DynamicNFT.abi, signer);


        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.createToken(
          {
            "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
            "external_url": "https://openseacreatures.io/3",
            "image": "ipfs://QmVQhpUHLAs8hT3GsG7og8ydzoBGgtfZJ1KZUm4X6ocYee",
            "name": "Dave Starbelly"
          }
        );

        console.log("Mining...please wait.")
        await nftTxn.wait();

        alert(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`);

        //await getNFTs()

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '80001') {
        alert("Please connect to Mumbai network!")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
    checkNetwork();
    // settotalNFTsLeft(nfts);
  }, [])

  return (
    <div className="min-h-screen bg-lime-400 App">
      <div className='flex justify-between px-4 py-6'>
        <h1 className="text-3xl font-extrabold tracking-tight text-white ">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-800">Dynamics ai </span>
        </h1>
        {!currentAccount ?
          <button className='px-4 py-2 text-purple-100 bg-purple-600 rounded-xl' onClick={connectWallet}>
            Connect to wallet
          </button>
          :
          <div className='px-4 py-2 text-purple-500 border border-purple-500 rounded-xl'> {shortenAddress(currentAccount)}</div>
        }
      </div>


      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-4xl lg:mt-6 xl:text-6xl">
        <span className="block">A better way to mint  </span>
        <span className="block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 to-fuchsia-800 sm:pb-5">
          NFTs using AI
        </span>

      </h1>
      {currentAccount ?
        <div className='mt-5'>
          <button
            onClick={mintNFT}
            className='text-white  bg-gradient-to-r from-purple-500 to-fuchsia-800 rounded-xl px-4 py-2.5 hover:bg-fuchsia-800'>Mint your ai nft</button>
        </div> : ''
      }
    </div>
  );
}

export default App;
