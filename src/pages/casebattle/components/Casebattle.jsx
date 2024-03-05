import React, { useState } from 'react'
import All from './All'

function Casebattle(props) {
  
  const [cases, setCases] = useState([
      {
       imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
         imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
        imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
        imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
        imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
        imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
        imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
      {
        imageLink: 'https://i.imgur.com/fsTLJdX.png',
      },
  ])

  return (
    <div className='w-full bg-[#1E2224] h-[130px] p-4 rounded-md flex items-center'>
        
        <div className="teamsection flex flex-col h-[100%] gap-2 w-[310px]">
            <div className='teamone flex items-center gap-4 w-[90px]'>
                <img className='w-[45px] h-[45px] rounded-md' src='https://avatars.steamstatic.com/83d8a4e7d9ce4e21c2a05abc66a3f19202b356bf_full.jpg'/>
                <span><p>+</p></span>
                <img className='w-[45px] h-[45px] rounded-md' src='https://steamuserimages-a.akamaihd.net/ugc/687094810512264399/04BA8A55B390D1ED0389E561E95775BCF33A9857/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'/>
            </div>
            <div className='teamtwo flex items-center gap-4 w-[90px]'>
                <img className='w-[45px] h-[45px] rounded-md' src='https://steamuserimages-a.akamaihd.net/ugc/687094810512264399/04BA8A55B390D1ED0389E561E95775BCF33A9857/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'/>
                <span><p>+</p></span>
                <img className='w-[45px] h-[45px] rounded-md' src='https://steamuserimages-a.akamaihd.net/ugc/687094810512264399/04BA8A55B390D1ED0389E561E95775BCF33A9857/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'/>
            </div>
        </div>

        <div className="case-battles flex items-center h-full bg-[#141814] p-4 gap-4 w-full rounded-md">
            {cases.length > 10 ?
            <button onClick={() => setModal(prev => !prev)} className="w-[128px] h-[50px] bg-[#ff3434] rounded-md stripe-bg">
                <p>View all {cases.length} cases</p>
            </button>
            :
            cases.map((casee, index) => (
                <div key={index} className="case w-[64px] h-[64px]">
                    <img className='w-[64px] h-[64px]' src={casee.imageLink}/>
                </div>
            ))
            }
        </div>

        <div className='flex items-end h-full flex-col gap-2 w-full'>
            <button className='w-[50px] h-[50px]  bg-[#ffffff65] rounded-md stripe-bg'>Watch</button>
            <button className='w-[50px] h-[50px]  bg-[#ffffff65] rounded-md stripe-bg'>Join</button>
        </div>
    </div>
  )
}

export default Casebattle