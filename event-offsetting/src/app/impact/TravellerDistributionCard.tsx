import {
    AspectRatio,
    Card,
    HStack,
    Icon,
    Text,
    useBreakpointValue,
    VStack
} from '@chakra-ui/react';

import dynamic from 'next/dynamic';
import React from 'react';
import { MdLocationPin } from 'react-icons/md';

import { UserLocation } from './models';

const Map = dynamic(async () => (await import('./Map')).Map, {
    ssr: false
});
const Marker = dynamic(async () => (await import('react-leaflet')).Marker, {
    ssr: false
});
const Popup = dynamic(async () => (await import('react-leaflet')).Popup, {
    ssr: false
});

export function TravellerDistributionCard({
    userLocations
}: {
    userLocations: UserLocation[];
}) {
    const zoomLevel = useBreakpointValue({
        base: 0,
        sm: 1,
        md: 2
    });
    return (
        <Card w="full" rounded="3xl" boxShadow="lg" overflow="hidden">
            <AspectRatio ratio={16 / 9}>
                <Map
                    width="100%"
                    zoom={zoomLevel}
                    center={[22, -10]}
                    minZoom={zoomLevel}
                    scrollWheelZoom={false}
                >
                    {userLocations.map((user) => (
                        <Marker
                            key={`${user.id}`}
                            position={[
                                user.origin_latitude,
                                user.origin_longitude
                            ]}
                        >
                            <Popup>
                                <VStack align="flex-start">
                                    <Text as="span" fontWeight="semibold">
                                        {user.first_name}
                                    </Text>
                                    <HStack color="gray.500">
                                        <Icon as={MdLocationPin} />
                                        <Text>
                                            {user.origin_city},{' '}
                                            {user.origin_state}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Popup>
                        </Marker>
                    ))}
                </Map>
            </AspectRatio>
        </Card>
    );
}
