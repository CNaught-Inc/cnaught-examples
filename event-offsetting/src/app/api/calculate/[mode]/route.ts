import { GoogleApi } from '@/app/GoogleApi';
import { TransportMode } from '@/calculator';
import { TravelMode } from '@googlemaps/google-maps-services-js';

import _ from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import wretch from 'wretch';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const eventPlace = JSON.parse(process.env.EVENT_LOCATION as string) as {
    name: string;
    place_id: string;
};

export async function GET(
    request: NextRequest,
    { params: { mode } }: { params: { mode: TransportMode } }
) {
    const searchParams = request.nextUrl.searchParams;
    const originPlaceId = searchParams.get('originPlaceId');
    const destinationPlaceId = searchParams.get('destinationPlaceId');

    if (!originPlaceId || (mode === 'flight' && !destinationPlaceId))
        return NextResponse.json(
            { message: 'Invalid address provided' },
            { status: 400 }
        );

    const oneWayEmissionsKg =
        mode === 'flight'
            ? (await computeFlightEmissionsKg(
                  originPlaceId,
                  destinationPlaceId as string
              )) +
              (await computeDrivingEmissionsKg(
                  destinationPlaceId as string,
                  eventPlace.place_id
              ))
            : await computeDrivingEmissionsKg(
                  originPlaceId,
                  eventPlace.place_id
              );

    return NextResponse.json({ emissionsKg: _.ceil(oneWayEmissionsKg * 2) });
}

async function computeDrivingEmissionsKg(
    originPlaceId: string,
    destinationPlaceId: string
) {
    const distanceMeters = await computeDrivingDistanceMeters(
        originPlaceId,
        destinationPlaceId
    );
    return calculateDrivingEmissionsKg(distanceMeters * 0.000621371);
}

async function computeFlightEmissionsKg(
    originPlaceId: string,
    destinationPlaceId: string
) {
    const distanceMeters = await computeFlightDistanceMeters(
        originPlaceId,
        destinationPlaceId
    );
    return calculateFlightEmissionsKg(distanceMeters * 0.000621371);
}

async function computeDrivingDistanceMeters(
    originPlaceId: string,
    destinationPlaceId: string
) {
    const searchParams = new URLSearchParams({
        origin: `place_id:${originPlaceId}`,
        destination: `place_id:${destinationPlaceId}`,
        mode: TravelMode.driving,
        key: apiKey
    });

    const directionsRes = await wretch(
        `https://maps.googleapis.com/maps/api/directions/json?${searchParams}`
    )
        .get()
        .json<any>();

    return directionsRes.routes[0].legs.reduce(
        (prev: number, curr: { distance: { value: number } }) => {
            return prev + curr.distance.value;
        },
        0
    );
}

async function computeFlightDistanceMeters(
    originPlaceId: string,
    destinationPlaceId: string
) {
    const origin = await getLatLngForPlaceId(originPlaceId);
    const destination = await getLatLngForPlaceId(destinationPlaceId);
    return gCircleDistance(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
    );
}

function gCircleDistance(
    lat1: number,
    long1: number,
    lat2: number,
    long2: number
) {
    const answer =
        2 *
        6371000 *
        Math.asin(
            Math.sqrt(
                Math.pow(
                    Math.sin(
                        (lat2 * (3.14159 / 180) - lat1 * (3.14159 / 180)) / 2
                    ),
                    2
                ) +
                    Math.cos(lat2 * (3.14159 / 180)) *
                        Math.cos(lat1 * (3.14159 / 180)) *
                        Math.pow(
                            Math.sin(
                                (long2 * (3.14159 / 180) -
                                    long1 * (3.14159 / 180)) /
                                    2
                            ),
                            2
                        )
            )
        );
    return answer;
}

async function getLatLngForPlaceId(placeId: string) {
    const originGeocodeRes = await GoogleApi.geocode(apiKey, placeId);
    return originGeocodeRes.geometry.location;
}

const milesToKm = (miles: number) => miles / 0.6214;
const gramsToKg = (grams: number) => grams / 1000;

const milesPerGallon = 22.9;
const emissionsCoefficientKgCo2PerGallon = 8.887;

function calculateDrivingEmissionsKg(distanceMiles: number) {
    return (
        (distanceMiles / milesPerGallon) * emissionsCoefficientKgCo2PerGallon
    );
}

const flightCarbonIntensityGCO2PerRPK = 95;

function calculateFlightEmissionsKg(distanceMiles: number) {
    const flightKm = milesToKm(distanceMiles);
    return gramsToKg(flightCarbonIntensityGCO2PerRPK * flightKm);
}

export const runtime = 'edge';
