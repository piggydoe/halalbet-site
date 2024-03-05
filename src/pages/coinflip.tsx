import Layout from '../components/Layout.tsx'
import React, { useState } from 'react'
import app from '../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { auth } from '../firebase/firebase';
import store from 'store';

function coinflip() {
  const db = getFirestore(app);
  const [coinflip, setCoinflip] = useState(false)
  const [gameId, setGameId] = useState("")
  const [bet, setBet] = useState(0)
  const [startButton, setStartButton] = useState(true)
  const [clientSideCoinflip, setClientSideCoinflip] = useState("Unknown")
  const [userCoinSide, setUserCoinSide] = useState("heads")
  const [outcome, setOutcome] = useState("undecided")
  const [allBets, setAllBets] = useState([])
  const [userBalance, setUserBalance] = useState(0)

  function getUserBalance() {
    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
      console.error("User email is null or undefined.");
      return;
    }
  
    getDoc(doc(db, "users", userEmail)).then((snapshot) => {
      const balanceSnap = snapshot.data();
      const result = balanceSnap?.balance;
      setUserBalance(result);
    });
  }

  const updateBalance = async (balanceToUpdate: number, email: string) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", email);
      await updateDoc(userDocRef, { balance: balanceToUpdate });
    } else {
      console.error("User is not logged in.");
    }
  };  

  function getRandomString(length: number) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
    }
    return result;
  }

  const createGameIdInDatabase = () => {
      getUserBalance()
      if(bet === 0 || bet <= 0 || isNaN(bet) && userBalance <= bet){
        alert("Please enter a bet")
      } else {
        const gameId = getRandomString(10)
        setGameId(gameId)
        const userBet = userCoinSide;
        const number = Math.floor(Math.random() * 100) + 1
        setDoc(doc(db, "coinflip", gameId), {
          gameId: gameId,
          bet: bet,
          userBet: userBet,
          probability: number,
          coinFlip: number % 2 === 0 ? "heads" : "tails",
        })
        store.set("gameId", gameId)
        setStartButton(true)
      }
    }

    const flipCoin = () => {
      setStartButton(false);
      getDoc(doc(db, "coinflip", store.get("gameId"))).then((snapshot) => {
        const coinFlip = snapshot.data();
        const result = coinFlip?.coinFlip;
        setCoinflip(result);
        setUserBalance(prevBalance => {
          let newBalance = prevBalance;
          if (result === coinFlip?.userBet) {
            setOutcome("win");
            newBalance += parseInt(coinFlip?.bet);
          } else {
            setOutcome("lose");
            newBalance -= parseInt(coinFlip?.bet);
          }
          updateBalance(newBalance, auth.currentUser.email); // Update balance here
          return newBalance;
        });
        getUserBalance();
        setClientSideCoinflip(coinFlip?.coinFlip);
      });
    
      setTimeout(() => {
        setBet(0);
        setGameId("");
        store.set("gameId", "");
        setClientSideCoinflip("Unknown");
        setUserCoinSide("heads");
        setOutcome("undecided");
      }, 4000);
    };
    
    

  return (
    <Layout>
      <div className='w-full items-center flex justify-center h-[calc(100vh-130px)]'>
        <div className='w-[50%]'>
          <h1 className="text-3xl font-semibold p-4 text-center">Coinflip</h1>
          <div className='p-4'>
            <div className='bg-[#1E2224] text-white w-full h-[210px] flex flex-col rounded-lg p-2 mb-[15rem]'>
          {gameId === "" ? 
          <>
              <input className='text-white bg-[#1E2224] transition-all focus:border-b focus:outline-none' type="number" placeholder="Bet"  value={bet} onChange={(e) => setBet(parseFloat(e.target.value))}/>
              <p className='text-white'>Game ID: {gameId}</p>
              <div className='flex gap-2 flex-col h-full justify-end'>
                <button className='primary-bg text-white font-bold py-2 px-4 rounded stripe-bg' onClick={() => setUserCoinSide(userCoinSide === "heads" ? "tails" : "heads")}>Switch side: {userCoinSide}</button>
                <button className='bg-green-500 text-white font-bold py-2 px-4 rounded stripe-bg' disabled={bet === 0} onClick={() => createGameIdInDatabase()}>Create Game</button>
              </div>
          </>
          :
          <div>
            <p>outcome: {outcome}</p>
            <p>coin flipped: {clientSideCoinflip}</p>
            <p>your bet: {userCoinSide}</p>

            {startButton ? <button onClick={() => flipCoin()}>Flip Coin</button> : <p>Flipped</p>}
          </div>
          }
              </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default coinflip