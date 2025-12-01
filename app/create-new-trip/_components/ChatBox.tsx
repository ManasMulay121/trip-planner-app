"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUI'
import BudgetUi from './BudgetUi'
import SelectDays from './SelectDays'
import FinalUi from './FinalUi'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useTripDetail, useUserDetail } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

type Message={
    role:string,
    content:string,
    ui?: string,

}

export type TripInfo={
    budget:string,
    destination:string,
    duration:string,
    group_size:string,
    origin:string,
    hotels:Hotel[],
    itinerary:Iternary[]
}

export type Hotel={
    hotel_name:string,
    hotel_address:string,
    price_per_night:string,
    hotel_image_url:string,
    geo_coordinates:{
        latitude:number,
        longitude:number
    },
    rating:number,
    description:string
};

export type Activity={
    place_name:string,
    place_details:string,
    place_image_url:string,
    geo_coordinates:{
        latitude:number,
        longitude:number
    },
    place_address:string,
    ticket_pricing:string,
    time_travel_each_location:string,
    best_time_to_visit:string;
}

type Iternary={
    day:number,
    day_plan:string,
    best_time_to_visit_day:string,
    activities:Activity[];
}
export default function ChatBox() {
    const router = useRouter();
    const [generatedTripId, setGeneratedTripId] = useState<string | null>(null);
    const [messages, setMessages]=useState<Message[]>([]);
    const [userInput, setUserInput]=useState<string>();
    const [loading,setLoading]=useState(false);
    const [isFinal,setIsFinal]=useState(false);
    const [finalPlan, setFinalPlan] = useState<any | null>(null);
    const [tripDetail, setTripDetails] = useState<TripInfo | null>(null);
    const SaveTripDetail=useMutation(api.tripDetail.CreateTripDetail);
    const {userDetail, setUserDetails}=useUserDetail();
    const tripDetailContext = useTripDetail();
    const tripDetailInfo = tripDetailContext?.tripDetailInfo;
    const setTripDetailInfo = tripDetailContext?.setTripDetailInfo;
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
                if(last?.role === 'assistant' && last?.ui === 'trip_ready') {
                    // already showing preparing message from previous assistant reply — don't add another
                    return prev;
                }
                return [...prev,{
                    role:'assistant',
                    content: 'Your trip is ready!',
                    ui: 'trip_ready'
                }];
            });
            if (result?.data?.trip_plan) {
                setTripDetails(result?.data?.trip_plan);
                if (setTripDetailInfo) {
                    setTripDetailInfo(result?.data?.trip_plan);
                }
                const tripId=uuidv4();
                setGeneratedTripId(tripId);
                if(userDetail) {
                    await SaveTripDetail({
                        tripDetail: result?.data?.trip_plan,
                        tripId: tripId,
                        uid: userDetail
                    });
                }
            } else {
                console.error("Trip plan not found in response", result.data);
            }

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
        } else if(ui=='trip_ready') {
            return <FinalUi viewTrip={() => router.push('/view-trip/'+generatedTripId)} disable={!tripDetail}/>
        } else if(ui=='final') {
            if (tripDetail) return null;
            return <FinalUi viewTrip={() => {}} disable={true}/>
        }
        return null
    }

    useEffect(()=> {
        const lastmsg=messages[messages.length-1];
        if(lastmsg?.ui=='final') {
            setIsFinal(true);
            setUserInput('Ok, Great!');
        }
    },[messages])

    useEffect(()=> {
        if(isFinal && userInput === 'Ok, Great!') {
            onSend();
        }
    },[isFinal, userInput]);
    return (
        <div className='h-[85vh] flex flex-col border shadow rounded-2xl p-5'>
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
                    <div className='max-w-lg bg-gray-200 text-gray-900 px-4 py-2 rounded-lg'>
                        {msg.content}
                        {RenderGenerativeUi(msg.ui??'')}
                    </div>
                </div>
                ))}
                {loading&& <div className='flex justify-start mt-2' >
                    <div className='max-w-lg bg-gray-200 text-gray-900 px-4 py-2 rounded-lg'>
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