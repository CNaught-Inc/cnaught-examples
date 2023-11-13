import { VStack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import wretch from 'wretch';
import * as yup from 'yup';

import { GooglePlacesAutoCompleteInput } from './GooglePlacesAutoCompleteInput';
import { SelectInput } from './SelectInput';
import { TransportMode } from './TransportMode';

interface DestinationOption {
    name: string;
    place_id: string;
}

interface EmissionsCalculatorProps {
    destinationAirportOptions: DestinationOption[];
    transportMode: TransportMode;
    onCalculatingEmissions: () => unknown;
    onCalculateEmissions: (
        originPlaceId: string | undefined,
        transportMode: TransportMode,
        emissionsKg: number
    ) => unknown;
    calculateEmissionsUrl: string;
}

export const EmissionsCalculator = ({
    destinationAirportOptions,
    transportMode,
    onCalculatingEmissions,
    onCalculateEmissions,
    calculateEmissionsUrl
}: EmissionsCalculatorProps) => {
    const calculatorForm = useForm<CalculatorSchema>({
        mode: 'onSubmit',
        resolver: yupResolver(calculatorSchema)
    });

    const calculateEmissions = useDebouncedCallback(async (originPlaceId: string, destinationPlaceId?: string) => {
        const searchParams = new URLSearchParams({ originPlaceId, destinationPlaceId: destinationPlaceId ?? '' });
        const resData = await wretch(`${calculateEmissionsUrl}?${searchParams}`).get().json<{ emissionsKg: number }>();

        onCalculateEmissions(originPlaceId, transportMode, resData.emissionsKg);
    }, 300);

    useEffect(() => {
        calculatorForm.reset({
            originAddress: null,
            destinationAddress: null
        });
    }, [calculatorForm, transportMode]);

    const origin = calculatorForm.watch('originAddress')?.value;
    const destination = calculatorForm.watch('destinationAddress')?.value;

    useEffect(() => {
        if (!origin || (transportMode === 'flight' && !destination)) {
            console.log('No address provided');
            onCalculateEmissions(undefined, transportMode, 0);
            return;
        }

        onCalculatingEmissions();
        calculateEmissions(origin.place_id, destination?.place_id);
    }, [origin, destination, calculateEmissions, onCalculatingEmissions, transportMode, onCalculateEmissions]);

    const destAirportOpts = destinationAirportOptions.map(({ name, place_id }) => ({
        label: name,
        value: { place_id }
    }));

    return (
        <FormProvider {...calculatorForm}>
            <form style={{ width: '100%' }}>
                <VStack w="full" spacing={5}>
                    <GooglePlacesAutoCompleteInput<CalculatorSchema>
                        name="originAddress"
                        label={`Origin${transportMode === 'flight' ? ' airport' : ''}`}
                        autocompletionRequest={transportMode === 'flight' ? { types: ['airport'] } : undefined}
                        showMainTextOnly={transportMode === 'flight'}
                        placeholder={transportMode === 'driving' ? 'Start typing to search...' : undefined}
                    />
                    {transportMode === 'flight' && (
                        <SelectInput<CalculatorSchema>
                            name="destinationAddress"
                            label={`Destination${transportMode === 'flight' ? ' airport' : ''}`}
                            options={destAirportOpts}
                            useBasicStyles
                        />
                    )}
                </VStack>
            </form>
        </FormProvider>
    );
};

const googlePlaceSchema = yup.object().shape({
    description: yup.string(),
    place_id: yup.string().required(),
    structured_formatting: yup.object().shape({ main_text: yup.string().required() })
});

const addressOptionSchema = yup
    .object()
    .shape({
        label: yup.string().required(),
        value: googlePlaceSchema
    })
    .nullable();

const calculatorSchema = yup.object().shape({
    originAddress: addressOptionSchema,
    destinationAddress: addressOptionSchema
});

export type CalculatorSchema = yup.InferType<typeof calculatorSchema>;
