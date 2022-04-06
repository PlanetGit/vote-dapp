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

  const contractAddress = '0x7aE226372Cd0c78684161cDE429121165A91E3b8';
  const contractABI = abi.abi;
  const receiverAddress = '0x04B11544047981291E2fAc7C424407500ED682AC';

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

  const donateNature = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const voteContract = new ethers.Contract(contractAddress, contractABI, signer);

        const transaction = await voteContract.sendVoteDonate(receiverAddress, ethers.utils.parseEther(1))
        console.log('Send donate amount...')
        await transaction.wait();
        console.log('Sent now.')
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
                <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="selectAnimal" id="tigerRadio" value="tiger" onChange={() => selectFavorite('tiger')} checked={customerFavorite === "tiger"} />
                <label className="form-check-label inline-block text-gray-800" htmlFor="tigerRadio">Tiger</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="selectAnimal" id="lionRadio" value="lion" onChange={() => selectFavorite('lion')} checked={customerFavorite === "lion"} />
                <label className="form-check-label inline-block text-gray-800" htmlFor="lionRadio">Lion</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="selectAnimal" id="chitaRadio" value="chita" onChange={() => selectFavorite('chita')} checked={customerFavorite === "chita"} />
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

          <section class="mb-12 text-center text-gray-800">
            <div class="max-w-[700px] mx-auto px-3 lg:px-6">
              <form>
                <div class="form-group mb-6">
                  <textarea class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="exampleFormControlTextarea13" rows="3" placeholder="Message"></textarea>
                </div>
                <button 
                  onClick={() => donateNature()}
                  class="w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
                  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                  active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Donate for nature</button>
              </form>
            </div>
          </section>
        </main>
      }
    </>
  );
}

export default App;
