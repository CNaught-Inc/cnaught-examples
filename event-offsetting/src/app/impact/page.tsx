import { CNaughtApiClient } from '@cnaught/cnaught-node-sdk';

import { Metadata } from 'next';

import { db } from '../db';
import { ImpactPage } from './ImpactPage';
import { formatCO2 } from './formatUtils';
import { recentUserColumns, userLocationColumns } from './models';

const apiBaseUrl = new URL(process.env.CNAUGHT_API_URL as string);
const cnaughtApiKey = process.env.CNAUGHT_API_KEY as string;
const eventName = process.env.NEXT_PUBLIC_EVENT_NAME as string;
const cnaughtApiClient = new CNaughtApiClient(cnaughtApiKey, {
    hostname: apiBaseUrl.hostname,
    port: apiBaseUrl.port,
    fetch
});

export default async function Index() {
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

    console.log('retrieving data');
    const impactData = await cnaughtApiClient.getImpactData({
        extraRequestOptions: {
            next: {
                tags: ['impact'],
                revalidate: 10000
            }
        }
    });

    return (
        <div>
            <ImpactPage data={{ impactData, recentUsers, userLocations }} />
        </div>
    );
}

// export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
    const impactData = await cnaughtApiClient.getImpactData({
        extraRequestOptions: {
            next: {
                tags: ['impact'],
                revalidate: 10000
            }
        }
    });

    const co2Components = formatCO2(impactData.total_offset_kgs);
    const title = `Offsetting the impact of travel to ${eventName}`;
    return {
        title,
        openGraph: {
            title,
            description: `${eventName} attendees have offset ${co2Components.amount} ${co2Components.unit} of CO2e using the CNaught platform.`,
            images: [
                {
                    url: '/isometric-trees.jpg',
                    alt: 'Trees'
                }
            ],
            type: 'website',
            siteName: `CNaught at ${eventName}`
        }
    };
}
