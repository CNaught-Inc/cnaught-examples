import { CNaughtApiClient } from '@cnaught/cnaught-node-sdk';

import { NextResponse } from 'next/server';

import { db } from '../../db';
import { recentUserColumns, userLocationColumns } from '../../impact/models';

const apiBaseUrl = new URL(process.env.CNAUGHT_API_URL as string);
const cnaughtApiKey = process.env.CNAUGHT_API_KEY as string;
const cnaughtApiClient = new CNaughtApiClient(cnaughtApiKey, {
    hostname: apiBaseUrl.hostname,
    port: apiBaseUrl.port,
    fetch
});

export async function GET() {
    console.log('using host and port', apiBaseUrl.host, apiBaseUrl.port);

    const userLocations = await db
        .selectFrom('users')
        .select(userLocationColumns)
        .orderBy('created_on', 'desc')
        .execute();

    const recentUsers = await db
        .selectFrom('users')
        .select(recentUserColumns)
        .orderBy('created_on', 'desc')
        .limit(3)
        .execute();

    const impactData = await cnaughtApiClient.getImpactData({
        extraRequestOptions: {
            next: {
                tags: ['impact'],
                revalidate: 10000
            }
        }
    });

    return NextResponse.json({
        impactData,
        recentUsers,
        userLocations
    });
}

export const runtime = 'edge';
