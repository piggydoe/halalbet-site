import Layout from '../components/Layout'
import React from 'react'
import { useState } from 'react'
import Board from './mines/Board'

function mines() {

    const [mines, setMines] = useState(4)
    const [totalSquares, setTotalSquares] = useState(25)

    return (
        <Layout>
            <div className='w-full items-center flex justify-center h-[calc(100vh-130px)]'>
                <div className='w-[50%] h-[75%] bg-[#1E2224]'>
                    <Board/>
                    {process.env.customKey}
                </div>
            </div>
        </Layout>
  )
}

export default mines