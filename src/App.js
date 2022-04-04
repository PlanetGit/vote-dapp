import React, { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import './App.css';
import tiger from "./assets/img/tiger.jpg"
import lion from "./assets/img/lion.jpg"
import chita from "./assets/img/chita.jpg"
import abi from "./contracts/Vote.json";


function App() {
  const [isConnectedWallet, setConnectedWallet] = useState(false)
  const [customerAddress, setCustomerAddress] = useState(null)
  const [customerFavorite, setCustomerFavorite] = useState(null)
  const [existingFavorite, setExistingFavorite] = useState(null)

  const contractAddress = '0xd4cF3346E9d62ebEC3b369e2a0ceEFBB04435F35';
  const contractABI = abi.abi;

  useEffect(() => {
    connectWallet()
    getFavorite();
    getTotalVoter();
  })

  const getFavorite = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const voteContract = new ethers.Contract(contractAddress, contractABI, signer);

      if (customerAddress) {
        let favorite = await voteContract.getVoterFavorite(customerAddress)
        if (favorite) {
          favorite = utils.parseBytes32String(favorite);
          setExistingFavorite(favorite.toString())
          setCustomerFavorite(favorite.toString())
          
          console.log('Getting favorite: ', favorite)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalVoter = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const voteContract = new ethers.Contract(contractAddress, contractABI, signer);

      const favorite = await voteContract.getTotalVoter()
      console.log('Getting total favorite voter: ', favorite.toNumber())      
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0];
      setConnectedWallet(true);
      setCustomerAddress(account);
      console.log("Account Connected: ", account);
      console.log('connect wallet')
    } catch (err) {
      console.log(err)
    }
  }

  const setFavorite = async (favoriteAnimal) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const voteContract = new ethers.Contract(contractAddress, contractABI, signer);

        const transaction = await voteContract.setVoterFavorite(utils.formatBytes32String(favoriteAnimal))
        console.log('Setting favorite animal...')
        await transaction.wait();
        console.log('Set finished.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const selectFavorite = (favoriteAnimal) => {
    setCustomerFavorite(favoriteAnimal)
  }

  const voteFavorite = () => {
    try {
      if (existingFavorite) {
        alert('You have a favorite animal. Thank you!')
      } else if (customerFavorite) {
        console.log('vote: ', customerFavorite)
        setFavorite(customerFavorite)
      } else {
        alert('select favorite animal.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {!isConnectedWallet ?
        <main className="enter-container">
          <h1 className="header-welcome">Welcome to my region!</h1>
          <div className="w-center">
            <button className="btn-wallet" onClick={() => connectWallet()}>
              Enter with wallet
            </button>
          </div>
        </main>
        :
        <main className="vote-container">
          <h1 className="header-welcome">What would you like?</h1>
          <div className="w-center mt-3">
            <div className="grid h-32 overflow-hidden gap-x-8 gap-y-4 grid-cols-3 slate-900">
              <div className="max-h-32">
                <img className="w-40 bg-orange-600 rounded-lg bg-cover bg-center" src={tiger} alt="tiger" />
              </div>
              <div className="max-h-32">
                <img className="w-40 bg-lime-600 rounded-lg bg-contain bg-center" src={lion} alt="lion" />
              </div>
              <div className="max-h-32">
                <img className="w-40 bg-fuchsia-600 rounded-lg bg-cover bg-center" src={chita} alt="chita" />
              </div>
            </div>
          </div>

          <div className="clear-both"></div>
          <div className="flex justify-center">
            <div className="grid overflow-hidden gap-x-32 gap-y-4 grid-cols-3 slate-900">
              <div className="form-check form-check-inline">
                <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="selectAnimal" id="tigerRadio" value="tiger" onChange={() => selectFavorite('tiger')} checked={customerFavorite==="tiger"}/>
                <label className="form-check-label inline-block text-gray-800" htmlFor="tigerRadio">Tiger</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="selectAnimal" id="lionRadio" value="lion" onChange={() => selectFavorite('lion')} checked={customerFavorite==="lion"}/>
                <label className="form-check-label inline-block text-gray-800" htmlFor="lionRadio">Lion</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="selectAnimal" id="chitaRadio" value="chita" onChange={() => selectFavorite('chita')} checked={customerFavorite==="chita"}/>
                <label className="form-check-label inline-block text-gray-800" htmlFor="chitaRadio">Chita</label>
              </div>
            </div>
          </div>
          <div className="clear-both"></div>
          <div className="w-center">
            <button className="btn-wallet" onClick={() => voteFavorite()}>
              Vote for now
            </button >
          </div>
        </main>
      }
    </>
  );
}

export default App;
