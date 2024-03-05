const { onAuthStateChanged, signOut } = require("firebase/auth");
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { auth } from '../../firebase/firebase';

function logoutPage() {
    const router = useRouter()

    const logOut = () => {
        signOut(auth)
        .then(() => {
            router.push('/')
        })
    }

  return (
    <div>
        <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default logoutPage