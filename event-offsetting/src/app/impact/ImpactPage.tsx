'use client';

import {
    Box,
    Center,
    ChakraProvider,
    Heading,
    HStack,
    Image,
    LinkBox,
    LinkOverlay,
    Stack,
    StackDivider,
    Text,
    VStack
} from '@chakra-ui/react';
import { ImpactData } from '@cnaught/cnaught-node-sdk';
import { cnaughtTheme } from '@/calculator';

import _ from 'lodash';
import React from 'react';
import useSWR from 'swr';

import { ImpactEquivalentsGrid } from './ImpactEquivalentsGrid';
import { TravellerDistributionCard } from './TravellerDistributionCard';
import { formatCO2 } from './formatUtils';
import { RecentUser, UserLocation } from './models';

const eventName = process.env.NEXT_PUBLIC_EVENT_NAME as string;

export interface ImpactPageData {
    impactData: ImpactData;
    userLocations: UserLocation[];
    recentUsers: RecentUser[];
}

export interface ImpactPageProps {
    data: ImpactPageData;
}

export const ImpactPage = ({ data: initialData }: ImpactPageProps) => {
    const impactPageDataRes = useSWR<ImpactPageData>(
        `/api/impact-page-data`,
        (url) => fetch(url).then((r) => r.json()),
        {
            fallbackData: initialData,
            refreshInterval: 5000
        }
    );

    if (!impactPageDataRes.data) {
        if (impactPageDataRes.isLoading) return <div>Loading</div>;

        if (impactPageDataRes.error) console.log('error loading impact data', impactPageDataRes.error);

        return <div>Could not load data</div>;
    }

    const {
        impactData: { total_offset_kgs, equivalents },
        recentUsers,
        userLocations
    } = impactPageDataRes.data;

    const co2Components = formatCO2(total_offset_kgs);

    return (
        <ChakraProvider theme={cnaughtTheme}>
            <Box w="full" bg="#FDF6E8">
                <Box
                    bgImage={{
                        base: "linear-gradient(315deg, rgba(253, 246, 232, 0), rgba(253, 246, 232, 0.9) 40%, rgba(253, 246, 232, 0.9) 70%, rgba(253, 246, 232, 0) 100%), url('/impact-bg-abstract.jpg')",
                        md: "linear-gradient(345deg, rgba(253, 246, 232, 0), rgba(253, 246, 232, 0.9) 40%, rgba(253, 246, 232, 0.9) 60%, rgba(253, 246, 232, 0) 100%), url('/impact-bg-abstract.jpg')"
                    }}
                    bgPosition={{ base: 'right, right', lg: 'right' }}
                    bgSize={{ base: 'contain, cover', lg: 'contain' }}
                    bgRepeat={{ base: 'no-repeat, no-repeat', lg: 'no-repeat' }}
                >
                    <Center w="full">
                        <VStack pt={4} pb={10} px={{ base: 3, md: 12 }} align="flex-start" w="full" maxW="7xl">
                            <Stack
                                direction={{ base: 'column', lg: 'row' }}
                                align={{ base: 'center', lg: 'stretch' }}
                                justify={{ base: 'flex-start', lg: 'space-around' }}
                                w="full"
                                spacing={{ base: 6, lg: 2 }}
                            >
                                <Box>
                                    <Heading
                                        mt={3}
                                        fontWeight="medium"
                                        fontSize={{ base: '4xl', sm: '6xl', md: '7xl' }}
                                        textAlign={{ base: 'center', md: 'left' }}
                                    >
                                        <Text>Offsetting the impact</Text>
                                        <Text>of travel to {eventName}</Text>
                                    </Heading>
                                </Box>
                                <Box mt={5}>
                                    <VStack
                                        rounded="xl"
                                        boxShadow="lg"
                                        bg="brand.cream"
                                        px={{ base: 5, sm: 10 }}
                                        py={6}
                                        divider={<StackDivider borderColor="text.gray" />}
                                        spacing={4}
                                        h="full"
                                        justify="center"
                                    >
                                        <Text fontSize={{ base: 'md', sm: 'lg' }} fontWeight="light" textAlign="center">
                                            So far{' '}
                                            <Text as="span" fontWeight="bold">
                                                {userLocations.length}
                                            </Text>{' '}
                                            {eventName} attendees have offset
                                        </Text>
                                        <Box
                                            fontSize="7xl"
                                            fontWeight="light"
                                            lineHeight="normal"
                                            w="full"
                                            textAlign="center"
                                        >
                                            {co2Components.amount}
                                        </Box>
                                        <Box
                                            fontSize={{ base: 'md', sm: 'lg' }}
                                            fontWeight="light"
                                            w="full"
                                            textAlign="center"
                                        >
                                            {co2Components.unit} of CO<sub>2</sub>e
                                        </Box>
                                    </VStack>
                                </Box>
                            </Stack>
                        </VStack>
                    </Center>
                </Box>
                <Center bg="brand.beige">
                    <VStack spacing={7} w="full" maxW="7xl" px={12} py={7}>
                        <Box w="full" fontSize="xl">
                            That&rsquo;s the same climate impact as:
                        </Box>
                        <ImpactEquivalentsGrid equivalents={equivalents} />
                    </VStack>
                </Center>
                <Center bg="brand.green">
                    <VStack spacing={8} py={10} px={{ base: 5, sm: 8 }} w="full" maxW="7xl">
                        <Heading fontSize="4xl">Recent travelers</Heading>
                        <Stack w="full" direction={{ base: 'column', lg: 'row' }} spacing={5}>
                            {recentUsers.map((u) => (
                                <Box
                                    key={u.id}
                                    rounded="xl"
                                    boxShadow="lg"
                                    bg="brand.cream"
                                    px={{ base: 5, sm: 10 }}
                                    py={6}
                                    mx="auto"
                                    minW={{ base: 0, md: 'xl', lg: 0 }}
                                >
                                    <Text fontSize="md" fontWeight="bold">
                                        {u.first_name} {u.last_name.substring(0, 1).toUpperCase()}.
                                    </Text>{' '}
                                    <Text fontSize="sm">
                                        {_.round(u.amount_kg, 0)} kg for {u.travel_method} from {u.origin_city},{' '}
                                        {u.origin_state}
                                    </Text>
                                </Box>
                            ))}
                        </Stack>
                    </VStack>
                </Center>
                <Center bg="white" w="full" pt={10} pb={5} px={{ base: 5, sm: 8 }}>
                    <VStack w="full" maxW="5xl" spacing={6}>
                        <Heading fontSize="4xl">Where {eventName} attendees are coming from</Heading>
                        <TravellerDistributionCard userLocations={userLocations} />
                    </VStack>
                </Center>
                <Center bg="brand.cream" w="full" px={8} py={4}>
                    <HStack w="full" justify="flex-end" maxW="7xl" spacing={4}>
                        <LinkBox w="30px">
                            <Image src="/cnaught_logo_mark.svg" alt="cnaught-logo" style={{ objectFit: "cover" }}/>
                            <LinkOverlay href="https://www.cnaught.com" isExternal />
                        </LinkBox>
                        <Text fontWeight="light">Powered by CNaught</Text>
                    </HStack>
                </Center>
            </Box>
        </ChakraProvider>
    );
};
