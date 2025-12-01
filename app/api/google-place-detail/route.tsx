import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    const {placename}=await req.json();
    const BASE_URL = "https://maps.googleapis.com/maps/api/place/details/json";
    const config = {
        headers:{
            'Content-Type':'application/json',
            'X-Goog-Api-Key':process?.env?.GOOGLE_PLACE_API_KEY,
            'X-goog-FieldMask': [
                'places.photos',
                'places.displayName',
                'places.id'
            ]
        }
    };
    try {
    const result=await axios.post(BASE_URL,{
        textQuery:placename
    },
        config);
        const placeRefName=result?.data?.places[0]?.photos[0]?.name;
    return NextResponse.json(result?.data);
}
catch(e) {
    return NextResponse.json({error:e})
}
}