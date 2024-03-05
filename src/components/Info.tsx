import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { auth } from '../firebase/firebase';
import app from '../firebase/firebase';
import { getDoc, getFirestore, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function Info(props: any) {

  const db = getFirestore(app);

  const router = useRouter();
  const [username, setUsername] = useState('')

  function routeToLogout(){
    router.push('/auth/logout')
  }

  useEffect(() => {

    return () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          getDoc(doc(db, "users", auth.currentUser.email)).then((snapshot) => {
            const usernameSnap = snapshot.data()
            const result = usernameSnap?.username;
            setUsername(result);
            console.log(result)
          })
        }
      })
    }
  }, [])

  return (
    <div className="bg-[#1E2224] w-full h-[176px] flex justify-center rounded-lg items-center info">
        <div className='w-[100%] flex justify-start p-4 gap-4'>
          <div className='h-[150px] w-[170px]'>
            <img className='w-[150px] h-[150px] rounded-md' src='https://avatars.steamstatic.com/83d8a4e7d9ce4e21c2a05abc66a3f19202b356bf_full.jpg'/>
          </div>
          <div className='flex flex-col justify-center w-full h-full'>
            <h1 className='text-3xl'>Hey, <span className=''>{username}</span></h1>
            <h2><span className=''>Member since:</span> <span className='text-yellow-500'>{new Date().toLocaleDateString()}</span></h2>
            <h2>Favorite mode: <span className='text-yellow-500'>Battles</span></h2>
            <div className='flex w-full flex-col pt-4'>
              <p>200/500 xp</p>
              <progress className="w-full progress" value="200" max="500"></progress>
            </div>
          </div>
        </div>
    </div>
  )
}


export default Info