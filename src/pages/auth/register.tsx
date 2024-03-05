const { createUserWithEmailAndPassword } = require("firebase/auth")
import { useState } from 'react'
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore'
import app, { auth } from '../../firebase/firebase'

export default function RegisterPage (props: any) {
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [username, setUsername] = useState("")
    const db = getFirestore(app)

    const register = (e: any) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password).then((userCred: any) => {
            console.log(userCred)
            alert("Account created successfully, refresh")
            setDoc(doc(db, "users", email), {
                email: email,
                uid: userCred.user.uid,
                username: username,
                balance: 0.00,
              })
        }).catch((err: any) => {
            console.log(err)
        })
    }

    return(
        <div className='bg-[#1F2324] p-6 w-[400px] rounded-lg flex justify-center items-center flex-col'>
            <h1 className='text-white font-semibold text-xl p-4'>Welcome, Register</h1>
            <div className='w-full flex flex-col'>
                <form onSubmit={register} className='flex flex-col w-full gap-2'>
                    <input value={email} onChange={(e) => setemail(e.target.value)} className='p-2 text-black rounded-md' type="text" placeholder="Email | Used for Login" />
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className='p-2 text-black rounded-md' type="text" placeholder="Username | Public" />
                    <input value={password} onChange={(e) => setpassword(e.target.value)} className='p-2 text-black rounded-md' type="password" placeholder="Password" />
                    <input value="Register" type='submit' className='primary-bg stripe-bg px-2 py-3 rounded-lg'/>
                    <button className='text-blue-500 text-sm p-2 bg-transparent' onClick={props.func}>Already have an account? Login</button>
                </form>
            </div>
        </div>
    )
}
