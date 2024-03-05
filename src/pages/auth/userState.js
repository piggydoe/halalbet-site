const { onAuthStateChanged } = require("firebase/auth");


import React, { useEffect, useState } from 'react'

function userState() {
    const [userLoggedIn, setUserLoggedIn] = useState(null)

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if(user){
                setUserLoggedIn(user)
            } else {
                setUserLoggedIn(null)
            }
        })
      return () => {
        listen();
      }
    }, [])
    
  return (
    <div></div>
  )
}

export default userState