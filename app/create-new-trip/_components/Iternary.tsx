"use client"
import React, { useState, useEffect } from "react";
import { Timeline } from "@/components/ui/timeline";
import type { TripInfo } from "./ChatBox";
import { Clock, ExternalLink, Hotel, Star, Ticket, Timer, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";

//

function Iternary() {
    
        const tripContext = useTripDetail();
        const tripDetailInfo = tripContext?.tripDetailInfo;
        const setTripDetailInfo = tripContext?.setTripDetailInfo;
        const [tripData, setTripData] = useState<TripInfo | null>(null);
        useEffect(()=>{
            tripDetailInfo && setTripData(tripDetailInfo);
        },[tripDetailInfo])
    const data = tripData?[
    {
      title: "Recommended Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tripData.hotels.map((hotel, index) => (
            <HotelCardItem hotel={hotel} />
        ))}
        </div>
      ),
    },
    ...[tripData.itinerary].map((dayData) => ({
        title: `Day ${dayData?.day}`,
        content: (
            <div>
                <p>Best time: {dayData.best_time_to_visit_day}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dayData.activities.map((activity, index) => (
                    <PlaceCardItem activity={activity} />
                ))}
                </div>
            </div>
        )
    }))
  ]:[];
  const [isMounted, setIsMounted] = useState(true);

  return (
    <div className="relative w-full min-h-screen h-[83vh] overflow-auto" suppressHydrationWarning>
      {isMounted && tripData && <Timeline data={data} tripData={tripData} />}
    </div>
  );
}
export default Iternary;