import { TransportMode } from '@/calculator';
import {
    CNaughtApiClient,
    CNaughtError,
    invalidParametersProblemType
} from '@cnaught/cnaught-node-sdk';

import _ from 'lodash';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { GoogleApi } from '../../GoogleApi';
import { OffsetStatus } from '../../OffsetStatus';
import { db } from '../../db';

interface OffsetTravelParams {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    originPlaceId: string;
    destinationPlaceId: string | undefined;
    transportMode: TransportMode;
    amountKg: number;
}

const eventName = process.env.NEXT_PUBLIC_EVENT_NAME as string;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string;
const apiBaseUrl = new URL(process.env.CNAUGHT_API_URL as string);
const cnaughtApiKey = process.env.CNAUGHT_API_KEY as string;
const cnaughtApiWebhookUrl = process.env.CNAUGHT_API_WEBHOOK_URL as
    | string
    | null
    | undefined;
const vercelUrl = process.env.VERCEL_URL as string | null | undefined;
const cnaughtApiClient = new CNaughtApiClient(cnaughtApiKey, {
    hostname: apiBaseUrl.hostname,
    port: apiBaseUrl.port,
    fetch
});

export async function POST(request: NextRequest) {
    const {
        firstName,
        lastName,
        email,
        company,
        originPlaceId,
        transportMode,
        amountKg
    } = (await request.json()) as OffsetTravelParams;
    const roundedAmountKg = _.round(amountKg);

    const existingUser = await db
        .selectFrom('users')
        .where('email', '=', email)
        .executeTakeFirst();

    if (existingUser)
        return NextResponse.json({ offsetStatus: OffsetStatus.AlreadyOffset });

    const { address_components, geometry } = await GoogleApi.geocode(
        googleApiKey,
        originPlaceId
    );
    const originLatLng = geometry.location;
    const originCity =
        address_components.find((c: any) => c.types.includes('locality'))
            ?.long_name ?? 'Unknown';
    const originState =
        address_components.find((c: any) =>
            c.types.includes('administrative_area_level_1')
        )?.short_name ?? 'Unknown';
    const originCountry =
        address_components.find((c: any) => c.types.includes('country'))
            ?.long_name ?? 'Unknown';

    return await db.transaction().execute(async () => {
        try {
            const subaccountRes = await cnaughtApiClient.createSubaccount({
                name: `${firstName} ${lastName}`
            });

            if (!subaccountRes)
                return NextResponse.json(
                    { message: 'Failed to create subaccount' },
                    { status: 500 }
                );

            const subaccountId = subaccountRes.id;

            await db
                .insertInto('users')
                .values({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    company,
                    cnaught_subaccount_id: subaccountId,
                    origin_latitude: originLatLng.lat,
                    origin_longitude: originLatLng.lng,
                    origin_city: originCity,
                    origin_state:
                        originCountry === 'United States'
                            ? originState
                            : originCountry,
                    travel_method: transportMode,
                    amount_kg: amountKg
                })
                .returning(['id'])
                .executeTakeFirstOrThrow();

            console.log(`Placing order for subaccount ${subaccountId}`);

            const orderRes = await cnaughtApiClient.placeGenericOrder(
                {
                    amount_kg: roundedAmountKg,
                    description: `Offsetting travel to ${eventName}`,
                    notification_config: {
                        url: `${
                            cnaughtApiWebhookUrl ??
                            `https://${vercelUrl}` ??
                            request.nextUrl.origin
                        }/api/webhook`
                    }
                },
                {
                    subaccountId
                }
            );

            console.log('Placed order', orderRes);

            revalidateTag('impact');

            return NextResponse.json({ offsetStatus: OffsetStatus.Success });
        } catch (err) {
            let errorMessage = 'Something went server wrong. Please try again.';
            if (err instanceof CNaughtError) {
                errorMessage = `An error occurred: ${err.problemDetails.title}. Please try again`;
                switch (err.problemDetails.type) {
                    case invalidParametersProblemType:
                        console.log(
                            err.problemDetails.title,
                            err.problemDetails.errors
                        );
                        break;
                    default:
                        console.log(err.problemDetails.title);
                        break;
                }
            } else {
                console.log('An error occurred', err);
            }

            return NextResponse.json(
                { message: errorMessage },
                {
                    status: 400
                }
            );
        }
    });
}

export const runtime = 'edge';
