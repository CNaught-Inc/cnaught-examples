import { Box, Card, Text } from '@chakra-ui/react';

import _ from 'lodash';
import Image from 'next/image';

interface StatCardProps {
    img: string;
    value: number;
    description: string;
}

const statFormatter = new Intl.NumberFormat('us-US', {
    maximumFractionDigits: 1
});

export const StatCard = ({ img, value, description }: StatCardProps) => {
    return (
        <Card
            w="full"
            rounded="3xl"
            boxShadow="lg"
            p={0}
            overflow="hidden"
            bg="brand.cream"
        >
            <Box w="full" h="196px" overflow="hidden" position="relative">
                <Image
                    src={img}
                    alt={description}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                />
            </Box>
            <Box pt={7} pb={7}>
                <Text fontSize="5xl" textAlign="center">
                    {statFormatter.format(_.round(value, value >= 100 ? 0 : 1))}
                </Text>
                <Text mt={3} textAlign="center" px={3}>
                    {description}
                </Text>
            </Box>
        </Card>
    );
};
