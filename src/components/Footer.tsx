import React from 'react'

function Footer() {
  return (
    <div className='w-[full] h-[300px] bg-[#1F2324] flex justify-around text-gray-300 mt-12 bottom-0 left-0 min-w-full'>
        <div className='left-side'>
          <img className='w-[270px] h-[150px] mt-1' src='https://i.imgur.com/heWOPTm.png'/>
          <div className='text text-sm ml-8'>
            <p>© 2024 HalalBet. All rights reserved.</p>
            <p>
              Halal, the best case unboxing site!
            </p>
            <p>
              Halal is owned and operated by Halal GG Ltd located at Thermistokli Dervi, 48, 3rd Floor, Office 306, 1065, Nicosia, Cyprys
            </p>
          </div>
        </div>
        <div className='right-side flex justify-evenly gap-24 mt-12'>
          <div className="column1">
            <h1>Company</h1>
            <ul>
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>
          <div className="column2">
            <h1>Legal</h1>
            <ul>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
          <div className="column3">
            <h1>Support</h1>
            <ul>
              <li>Help</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
    </div>
  )
}

export default Footer