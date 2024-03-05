import React from 'react'
import Battle from './Battle'
import Info from './Info'

function Gamemodes() {
  return (
    <div className="min-w-full flex justify-center">
        <div className="w-[62%] flex flex-col gap-6 py-10">
            <div className="w-full gap-4 ">
                <div className="w-full flex justify-center gap-4">
                  <div className="w-[100%]">
                    <Info/>
                  </div>
             </div>
          </div>
          <h1 className='text-2xl m-0 p-0 text-white'>Game Modes</h1>
          <div className="w-full gap-4">
            <div className="w-full flex justify-center gap-4">
              <div className="w-[30%]">
                <Battle localClass="cases" link='/casebattle/current' image="https://rustly.s3.eu-central-1.amazonaws.com/e924e64c-b92b-444c-ab13-caedb5a25575-Rustly_Banners_960x540_CaseBattle.jpeg" />
              </div>
              <div className="w-[40%]">
                <Battle localClass="coinflip" link='/coinflip' image="https://rustly.s3.eu-central-1.amazonaws.com/ab4cc8d7-e316-4f1a-ae6b-6f437dee096b-Rustly_Banners_960x540_CaseOpening.jpeg"/>
              </div>
              <div className="w-[30%]">
                <Battle localClass="mines" link="/mines" />
              </div>
            </div>
          </div>
    
          <div className="w-full">
            <div className="w-full flex justify-center gap-4">
              <div className="w-[50%]">
                <Battle localClass="soon"/>
              </div>
              <div className="w-[50%]">
                <Battle localClass="soon"/>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Gamemodes