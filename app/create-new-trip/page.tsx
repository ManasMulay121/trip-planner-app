import React from 'react'
import ChatBox from "./_components/ChatBox";
import Iternary from './_components/Iternary';
function CreateNewTrip() {
    return (
        <div className='h-screen flex gap-5 p-10 overflow-hidden'>
            <div className='w-full md:w-1/3 flex-shrink-0'>
                <ChatBox/>
            </div> 
            <div className='flex-1 overflow-y-auto'>
                <Iternary />
            </div>
        </div>
    )
}

export default CreateNewTrip