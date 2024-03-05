import React from 'react'

function Battle(props: any) {
  return (
    <div onClick={() => window.location.href = props.link} className={`bg-[#1E2224] text-white w-full h-[210px] flex justify-center flex-col rounded-lg p-1 hover:scale-[1.03] transition-all cursor-pointer ${props.localClass}`}>
        <div className=''>

        </div>
    </div>
  )
}

export default Battle