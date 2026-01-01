import React from 'react'
import ChatBox from "./_components/ChatBox";
import Iternary from './_components/Iternary';
function CreateNewTrip() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 p-10 min-h-screen'>
            <div className='min-w-0'>
                <ChatBox/>
            </div> 
            <div className='col-span-2'>
                <Iternary />
            </div>
        </div>
    )
}

export default CreateNewTrip