"use client"
import React, { useContext, useEffect, useState } from 'react'
import Header from './_components/Header';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/UserDetailContext';
import { TripContextType, TripDetailContext } from '@/context/TripDetailContext';
import { TripInfo } from './create-new-trip/_components/ChatBox';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const CreateUser = useMutation(api.user.CreateNewUser)
  const [userDetail, setUserDetail]= useState<any>();
  const [isMounted, setIsMounted] = useState(false);
  const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo  | null>(null);
  const {user} = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user && isMounted) {
      CreateNewUser();
    }
  }, [user, isMounted])

  type CreateUserResult = string | { _id: string };

  const CreateNewUser = async() => {
    if (user) {
    // save new user if not exist
      const result = await CreateUser({
          email:user?.primaryEmailAddress?.emailAddress ?? ' ',
          imageUrl:user?.imageUrl,
          name:user?.fullName ?? ' '
      }) as CreateUserResult;
      // Store only the _id
      const userId = typeof result === 'string' ? result : result?._id;
      setUserDetail(userId);
    }
  }

  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      <TripDetailContext.Provider value={{tripDetailInfo, setTripDetailInfo}}>
      <div suppressHydrationWarning>
        <Header />
        <div suppressHydrationWarning>
          {isMounted ? children : null}
        </div>
      </div>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}
export const useTripDetail = ():TripContextType | undefined => {
  return useContext(TripDetailContext);
}