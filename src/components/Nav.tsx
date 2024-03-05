import React, { useEffect, useState } from 'react'
import siteImage from '../assets/halalbet.png'
import { useRouter } from 'next/router'
import { auth } from '../firebase/firebase';
import app from '../firebase/firebase';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Nav() {

  const db = getFirestore(app);

  const router = useRouter();
  const [balance, setBalance] = useState(0)

  function routeToLogout(){
    router.push('/auth/logout')
  }

  useEffect(() => {

    return () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          getDoc(doc(db, "users", auth.currentUser.email)).then((snapshot) => {
            const balanceSnap = snapshot.data()
            const result = balanceSnap?.balance;
            setBalance(result);
            console.log(result)
          })
        }
      })
    }
  }, [])
  

  return (
    <div className='w-full bg-[#1E2224] h-[75px] flex items-center px-4 justify-between'>
        <div className='flex items-center gap-2'>
          <img onClick={() => window.location.href = '/'} className='w-[270px] h-[150px] mt-1 cursor-pointer' src='https://i.imgur.com/heWOPTm.png'/>
          <button className='sitebutton'>Rewards</button>
          <button className='sitebutton'>Leaderboard</button>
        </div>
        <div className='flex gap-4'>
          <div className='flex items-center gap-2 bg-green-600 p-2 rounded-md'><span>Balance: </span> <span>{balance}</span></div>
          <button className='sitebutton'>Deposit</button>
          <button className='sitebutton'>Withdraw</button>
          <button onClick={routeToLogout} className='sitebutton'>Logout</button>
        </div>
    </div>
  )
}

export default Nav