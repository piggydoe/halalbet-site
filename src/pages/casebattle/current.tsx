import Layout from '../../components/Layout'
import React, { useState } from 'react'
import Casebattle from './components/Casebattle'

function casebattle() {

  const [currentBattles, setCurrentBattles] = useState([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
  ])

  return (
    <Layout>
      <div className='listofcases flex flex-col gap-4 p-4 w-full'>
        {currentBattles.map(battle => (
          <Casebattle key={battle.id} id={battle.id} />
        ))}
      </div>
    </Layout>
  )
}

export default casebattle