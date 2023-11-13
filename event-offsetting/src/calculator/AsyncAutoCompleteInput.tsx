import { FormErrorMessage, FormLabel, FormControl } from '@chakra-ui/react';

import { GroupBase, AsyncSelect, OptionsOrGroups } from 'chakra-react-select';
import { useId } from 'react';
import {
    FieldValues,
    FieldPath,
    Controller,
    useFormContext
} from 'react-hook-form';

export interface AsyncAutoCompleteInputProps<
    TFieldValues extends FieldValues = FieldValues,
    Option = unknown,
    Group extends GroupBase<Option> = GroupBase<Option>
> {
    name: FieldPath<TFieldValues>;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    loadOptions: (
        inputValue: string,
        callback: (options: OptionsOrGroups<Option, Group>) => void
    ) => Promise<OptionsOrGroups<Option, Group>> | void;
}

export function AsyncAutoCompleteInput<
    TFieldValues extends FieldValues = FieldValues,
    Option = unknown,
    Group extends GroupBase<Option> = GroupBase<Option>
>({
    name,
    label,
    isRequired = false,
    placeholder,
    loadOptions
}: AsyncAutoCompleteInputProps<TFieldValues, Option, Group>) {
    const { control } = useFormContext();
    const id = useId();

    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { error }
            }) => (
                <FormControl isRequired={isRequired} isInvalid={!!error}>
                    <FormLabel>{label}</FormLabel>
                    <AsyncSelect<Option, false, Group>
                        id={id}
                        instanceId={id}
                        name={name}
                        ref={ref}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        defaultOptions
                        loadOptions={loadOptions}
                        placeholder={placeholder}
                        closeMenuOnSelect={true}
                        isClearable={true}
                        openMenuOnFocus={false}
                        openMenuOnClick={false}
                    />
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                </FormControl>
            )}
        />
    );
}
