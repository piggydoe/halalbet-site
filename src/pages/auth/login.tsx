import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/firebase'

export default function LoginPage  (props: any) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const login = (e: any) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password).then((userCred) => {
            console.log(userCred)
        }).catch((err) => {
            console.log(err)
        })
    }

    return(
        <div className='bg-[#1F2324] p-6 w-[400px] rounded-lg flex justify-center items-center flex-col'>
            <h1 className='text-white font-semibold text-xl p-4'>Welcome back, Login</h1>
            <div className='w-full flex flex-col'>
                <form onSubmit={login} className='flex flex-col w-full gap-2'>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 text-black rounded-md' type="text" placeholder="Email" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className='p-2 text-black rounded-md' type="password" placeholder="Password" />
                    <input value="Login" type='submit' className='primary-bg stripe-bg px-2 py-3 rounded-lg'/>
                    <button className='text-blue-500 text-sm p-2 bg-transparent' onClick={props.func}>Don't have an account? Register</button>
                </form>
            </div>
        </div>
    )
}

