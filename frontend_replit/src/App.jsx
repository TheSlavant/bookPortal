import React, { useState, useEffect } from "react"
import { ethers } from "ethers";
import "./App.css"
import bookRecPortal from "./utils/BookRecPortal.json"

const App = () => {
  
  // State variables to store user's public wallet and all book recs to date
  const [currentAccount, setCurrentAccount] = useState("");
  const [allRecs, setAllRecs] = useState([]);
  const [currentRec, setCurrentRec] = useState("");
  
  const contractAddress = "0x21296aF733234c33291A5D375e72917e0Cd9Aea6";

  // Create a method that gets all waves from your contract
  const getAllRecs = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const bookRecPortalContract = new ethers.Contract(contractAddress, bookRecPortal.abi, signer);
        
        // Call the getAllRecs method from the Smart Contract
        const bookRecs = await bookRecPortalContract.getAllRecs();
        
        // I only need address, timestamp, and message in the UI
        let bookRecsCleaned = [];
        bookRecs.forEach(bookRec => {
          bookRecsCleaned.push({
            address: bookRec.recommender,
            timestamp: new Date(bookRec.timestamp * 1000),
            message: bookRec.recommendation
          });
        });

        // Store data in React State
        setAllRecs(bookRecsCleaned);

        bookRecPortalContract.on("NewRec", (from, timestamp, recommendation) => {
          console.log("NewRec", from, timestamp, recommendation);

          setAllRecs(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: recommendation
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Check if user already connected the wallet
  const checkIfWalletIsConnected = async () => {
    // Make sure we have access to window.ethereum
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }

    getAllRecs();
  }

  // Connect the wallet
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

  // Submit a recommendation
  const recommend = async (bookRec) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const bookPortalContract = new ethers.Contract(contractAddress, bookRecPortal.abi, signer);

        let count = await bookPortalContract.getTotalNumRecs();
        console.log("Retrieved total book recs count: ", count.toNumber());
        
        // Execute the recommendation from your smart contract
        const recTxn = await bookPortalContract.recommend(bookRec, { gasLimit: 300000 })
        console.log("Mining...", recTxn.hash);

        await recTxn.wait();
        console.log("Mined -- ", recTxn.hash);

        count = await bookPortalContract.getTotalNumRecs();
        console.log("Retrieved total book recs count: ", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Run function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hello!
        </div>

        <div className="bio">
          I am Yaroslav. I like working with data, learning languages, and reading mind-bending philosophical books.
        </div>
        
        <div className="bio">
          Speaking of books, if you were stranded on a desert island for a year, what book would you bring with you and why?
        </div>

        <textarea 
          className="inputField"
          type="text" 
          placeholder="Type here"
          onChange={(event) => setCurrentRec(event.target.value)}
          value={currentRec}>
        </textarea>

        <button className="recButton" disabled={!currentAccount} onClick={() => recommend(currentRec)}>
            Recommend Book
        </button>

        {/* If there is no currentAccount render this button */}
        {!currentAccount && (
          <button className="recButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {!currentAccount && (
          <div id="info-message">
            Connect your Ethereum wallet to see what books others recommended. As a Thank You, there's a 51% chance you'll win some ETH!
          </div>
        )}
        
        {allRecs.map((bookRec, index) => {
          return (
            <div className="recCard" key={index}>
              <div id="metadata">Address: {bookRec.address}</div>
              <div id="metadata">Time: {bookRec.timestamp.toString()}</div>
              <div id="rec">{bookRec.message}</div>
            </div>)
        })}
      </div>
    </div>
  )
}

export default App