import { Inter } from "next/font/google";
import Gamemodes from "../components/Gamemodes.tsx";
import Layout from "../components/Layout.tsx";
import { auth } from "../firebase/firebase.js";
import { useEffect, useState } from "react";
import LoginPage from "./auth/login.tsx";
import RegisterPage from "./auth/register.tsx";
import { onAuthStateChanged } from "firebase/auth";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [showingLoginPage, setShowingLoginPage] = useState(true)

  function switchPage(){
    setShowingLoginPage(!showingLoginPage)
  }

  useEffect(() => {
    return () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setShowingLoginPage(false)
        }
      })
    }
  }, [])
  

  return (
    <Layout>
      {auth.currentUser ? <Gamemodes/> : 
      
        <div className="w-full h-[calc(100vh-130px)] flex items-center justify-center">
          {showingLoginPage ? <LoginPage func={switchPage} /> : <RegisterPage func={switchPage} />}
        </div>

      }
    </Layout>
  );
}
