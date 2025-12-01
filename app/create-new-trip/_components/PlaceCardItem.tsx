import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Activity } from "./ChatBox";
export default function PlaceCardItem({ activity }: { activity: Activity}) {
    return (
        <div>
                                <Image src={activity?.place_image_url || '/placeholder.jpg'} alt={activity.place_name} width={400} height={200}
                                className="object-cover rounded-xl"/>
                                <h2 className="font-semibold text-lg">{activity?.place_name}</h2>
                                <p className="text-gray-500 line-clamp-2">{activity?.place_details}</p>
                                <h2 className="flex gap-2 text-blue-500 line-clamp-1"><Ticket/>{activity?.ticket_pricing}</h2>
                                <p className="flex text-orange-400 gap-2 line-clamp-1"><Clock/>{activity?.best_time_to_visit}</p>
                                <Link href={`https://www.google.com/maps/search/?api=1&query=`+activity?.place_name} target="_blank">
                                <Button size={'sm'} variant={"outline"} className="mt-2 w-full">View<ExternalLink/></Button>
                                </Link>
                            </div>
    );
}