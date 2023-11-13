'use client';

import { Center, ChakraProvider, Heading, Text, VStack } from '@chakra-ui/react';
import { LinkButton, cnaughtTheme } from '@/calculator';

import { useSearchParams } from 'next/navigation';
import { MdOpenInNew } from 'react-icons/md';

const eventName = process.env.NEXT_PUBLIC_EVENT_NAME as string;

export default function Confirmation() {
    const searchParams = useSearchParams();
    const alreadyOffset = searchParams.get('alreadyOffset');

    return (
        <ChakraProvider theme={cnaughtTheme}>
            <Center minH="100vh" alignItems={{ base: 'stretch', lg: 'flex-start' }}>
                <VStack
                    maxWidth={{ base: 'none', lg: 'xl' }}
                    w="full"
                    spacing={10}
                    bgColor="brand.cream"
                    borderRadius={{ base: 0, lg: 20 }}
                    boxShadow={{ base: 'none', lg: 'xl' }}
                    p={10}
                    marginY={{ base: 0, lg: 10 }}
                    align="flex-start"
                >
                    <Heading fontSize="5xl" fontWeight="thin" textAlign="left" w="full">
                        {alreadyOffset
                            ? `You’ve already offset your travel to ${eventName}`
                            : 'Thanks for taking climate action!'}
                    </Heading>
                    <Text fontSize="lg" fontWeight="light">
                        {alreadyOffset
                            ? 'While we applaud your efforts to be more sustainable, we can only allow you to offset your travel once per event.'
                            : `You’ve just offset emissions from your travel to ${eventName}. We'll send you an
                        email with more details about your carbon credits.`}
                    </Text>
                    <LinkButton href="/impact" variant="primary" rightIcon={<MdOpenInNew />} isExternal>
                        See your impact
                    </LinkButton>
                </VStack>
            </Center>
        </ChakraProvider>
    );
}
