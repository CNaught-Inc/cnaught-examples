import { FormErrorMessage, FormLabel, FormControl, PropsOf } from '@chakra-ui/react';

import { useChakraSelectProps } from 'chakra-react-select';
import React from 'react';
import { useId } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { AutocompletionRequest } from 'react-google-places-autocomplete/build/types';
import { FieldValues, FieldPath, Controller, useFormContext } from 'react-hook-form';

const apiKey = (process.env as any).NEXT_PUBLIC_GOOGLE_API_KEY as string;

export interface GooglePlacesAutoCompleteInputProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    autocompletionRequest?: AutocompletionRequest;
    showMainTextOnly?: boolean;
}

export function GooglePlacesAutoCompleteInput<TFieldValues extends FieldValues>({
    name,
    autocompletionRequest,
    showMainTextOnly = false,
    ...selectProps
}: GooglePlacesAutoCompleteInputProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller<TFieldValues>
            control={control}
            name={name}
            render={(fieldProps) => (
                <GooglePlacesAutoCompleteComponent<TFieldValues>
                    {...fieldProps}
                    {...selectProps}
                    autocompletionRequest={autocompletionRequest ?? {}}
                    showMainTextOnly={showMainTextOnly}
                />
            )}
        />
    );
}

type GooglePlacesAutoCompleteComponentProps<TFieldValues extends FieldValues> = Omit<
    Parameters<PropsOf<typeof Controller<TFieldValues>>['render']>[0] &
        GooglePlacesAutoCompleteInputProps<TFieldValues>,
    'name'
> & { autocompletionRequest: AutocompletionRequest; showMainTextOnly: boolean };

const GooglePlacesAutoCompleteComponent = <TFieldValues extends FieldValues>({
    field,
    fieldState: { error },
    label,
    autocompletionRequest,
    placeholder,
    isRequired = false,
    showMainTextOnly
}: GooglePlacesAutoCompleteComponentProps<TFieldValues>) => {
    const id = useId();
    const chakraSelectProps = useChakraSelectProps<TFieldValues>({
        ...field,
        components: {
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null
        }
    }) as any;

    return (
        <FormControl isRequired={isRequired} isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            <GooglePlacesAutocomplete
                apiKey={apiKey}
                autocompletionRequest={autocompletionRequest}
                selectProps={{
                    ...chakraSelectProps,
                    ...(showMainTextOnly && { getOptionLabel: (o) => o.value.structured_formatting.main_text }),
                    id,
                    instanceId: id,
                    isClearable: true,
                    placeholder,
                    noOptionsMessage: (v) => (v.inputValue?.length ? 'No results found' : 'Start typing to search...'),
                    useBasicStyles: true
                }}
                withSessionToken
            />
            <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
    );
};
