import React from 'react'
import Footer from './Footer'
import Nav from './Nav'

function Layout({children}: any) {
  return (
    <div className='min-h-screen w-full m-0 p-0'>
      <Nav />
        <main>
            {children}
        </main>
        <Footer/>
    </div>
  )
}

export default Layout