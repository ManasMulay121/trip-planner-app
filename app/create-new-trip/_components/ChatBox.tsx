"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUI'
import BudgetUi from './BudgetUI'
import SelectDays from './SelectDays'
import FinalUi from './FinalUi'

type Message={
    role:string,
    content:string,
    ui?: string,

}

type TripInfo={
    budget:string,
    destination:string,
    duration:string,
    group_size:string,
    origin:string,
    hotels:any,
    itinerary:any
}
export default function ChatBox() {

    const [messages, setMessages]=useState<Message[]>([]);
    const [userInput, setUserInput]=useState<string>();
    const [loading,setLoading]=useState(false);
    const [isFinal,setIsFinal]=useState(false);
    const [finalPlan, setFinalPlan] = useState<any | null>(null);
    const [tripDetail, setTripDetails] = useState<TripInfo | null>(null);
    const onSend = async() => {
        if(!userInput?.trim()) return;
        setLoading(true);
        setUserInput('');
        const newMsg:Message={
            role:'user',
            content:userInput ?? ''
        }

        setMessages((prev:Message[])=>[...prev,newMsg]);
        const result=await axios.post('/api/aimodel',{
            messages:[...messages,newMsg],
            isFinal: isFinal
        })
        console.log("TRIP", result.data);

        if(!isFinal) {
            setMessages((prev:Message[])=>[...prev,{
                role:'assistant',
                content: result?.data?.resp,
                ui: result?.data?.ui
            }]);
        } else {
            // avoid adding a duplicate "Preparing your itinerary..." assistant message
            setMessages((prev:Message[])=>{
                const last = prev[prev.length - 1];
                if(last?.role === 'assistant' && last?.ui === 'final') {
                    // already showing preparing message from previous assistant reply — don't add another
                    return prev;
                }
                return [...prev,{
                    role:'assistant',
                    content: 'Preparing your itinerary...',
                    ui: 'final'
                }];
            });
            setFinalPlan(result.data);
            setTripDetails(result?.data?.trip_plan);
        }

        console.log(result.data);
        setLoading(false);
    }

    const RenderGenerativeUi=(ui:string)=>{
        if(ui=='budget') 
        {
            return <BudgetUi onSelectedOption={(v:string)=>{setUserInput(v); onSend()}}/>
        } else if(ui=='groupSize') {
            return <GroupSizeUi onSelectedOption={(v:string)=>{setUserInput(v); onSend()}}/>
        } else if(ui=='tripDuration') {
            return <SelectDays onSelectedOption={(v:string)=>{setUserInput(v); onSend()}}/>
        } else if(ui=='final') {
            return <FinalUi viewTrip={() => console.log} disable={!tripDetail}/>
        }
        return null
    }

    useEffect(()=> {
        const lastmsg=messages[messages.length-1];
        if(lastmsg?.ui=='final') {
            setIsFinal(true);
            setUserInput('Ok, Great!');
            //onSend();
        }
    },[messages])

    useEffect(()=> {
        if(isFinal && userInput) {
            onSend();
        }
    },[isFinal]);
    return (
        <div className='h-[85vh] flex flex-col'>
            {messages?.length==0 &&
                <EmptyBoxState onSelectOption={(v:string)=>{setUserInput(v); onSend()}}/>
            }
            <section className='flex-1 overflow-y-auto p-4'>
                {messages.map((msg:Message,index)=>(
                    msg.role=='user'?
                    <div className='flex justify-end mt-2' key={index}>
                    <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                        {msg.content}
                    </div>
                </div>:
                <div className='flex justify-start mt-2' key={index}>
                    <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                        {msg.content}
                        {RenderGenerativeUi(msg.ui??'')}
                    </div>
                </div>
                ))}
                {loading&& <div className='flex justify-start mt-2' >
                    <div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
                        <Loader className='animate-spin'/>
                    </div>
                </div>
                }
            </section>
            <section>
                <div className='border rounded-2xl p-4 relative'>
                    <Textarea placeholder='Start typing here...'
                        className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
                        onChange={(event)=>setUserInput(event.target.value)}
                        value={userInput}
                    />
                    <Button size={'icon'} className='absolute right-6 bottom-6' onClick={()=>onSend()}>
                        <Send className='h-4 w-4'/>
                    </Button>
                </div>
            </section>
        </div>
    )
}