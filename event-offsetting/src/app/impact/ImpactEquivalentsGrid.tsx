'use client';

import { Box, Grid } from '@chakra-ui/react';
import { ImpactEquivalents } from '@cnaught/cnaught-node-sdk';

import { StatCard } from './StatCard';

interface ImpactEquivalentsGridProps {
    equivalents: ImpactEquivalents;
}

export const ImpactEquivalentsGrid = ({ equivalents }: ImpactEquivalentsGridProps) => {
    return (
        <>
            <Grid
                templateColumns={{
                    base: 'repeat(auto-fit, minmax(0, 300px))',
                    sm: 'repeat(auto-fit, minmax(180px, calc(100% / 2.5)))',
                    lg: 'repeat(auto-fit, minmax(180px, 1fr))'
                }}
                rowGap={{ base: 10, sm: 5, md: 6, xl: 10 }}
                columnGap={{ base: 4, sm: 5, md: 6, xl: 10 }}
                justifyContent={{ base: 'center', lg: 'space-around' }}
                w="full"
            >
                <StatCard
                    img="/isometric-trees.jpg"
                    value={equivalents.trees_planted}
                    description="new trees planted"
                />
                <StatCard
                    img="/isometric-car.jpg"
                    value={equivalents.cars_off_the_road}
                    description="cars off the road for a year"
                />
                <StatCard
                    img="/isometric-house.jpg"
                    value={equivalents.homes_annual_energy_usage}
                    description="homes&rsquo; annual energy usage"
                />
                <StatCard
                    img="/isometric-plane.jpg"
                    value={equivalents.flights_lax_to_nyc}
                    description="flights from LA to New York"
                />
            </Grid>
            <Box fontSize="xs" w="full">
                * calculations based on U.S. EPA and ICAO formulas
            </Box>
        </>
    );
};
