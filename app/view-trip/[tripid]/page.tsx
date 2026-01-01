"use client"
import Iternary from '@/app/create-new-trip/_components/Iternary';
import { Trip } from '@/app/my-trips/page';
import { useTripDetail, useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function ViewTrip() {
    const {tripid} = useParams();
    const {userDetail, setUserDetail} = useUserDetail();

    const convex = useConvex();
    const [tripData, setTripData] = useState<Trip>()
    const [loading, setLoading] = useState(true);
    const tripDetailContext = useTripDetail();
    const tripDetailInfo = tripDetailContext?.tripDetailInfo;
    const setTripDetailInfo = tripDetailContext?.setTripDetailInfo;
    useEffect (() => {
        if (userDetail && tripid) {
            GetTrip();
        }
    }, [userDetail, tripid])

    const GetTrip = async() => {
        if (!userDetail) {
            console.log('No user detail available');
            return;
        }
        
        setLoading(true);
        try {
            const result = await convex.query(api.tripDetail.GetTripById,{
                uid : userDetail, // userDetail is already the user ID string
                tripid : tripid as string
            });
            console.log(result);
            setTripData(result);
            if (setTripDetailInfo) {
                setTripDetailInfo(result?.tripDetail);
            }
        } catch (error) {
            console.error('Error fetching trip:', error);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div>
      {loading && <div className="p-10 text-center">Loading trip details...</div>}
      {!loading && !tripData && <div className="p-10 text-center">Trip not found.</div>}
      {!loading && tripData && <Iternary />}
    </div>
  )
}

export default ViewTrip