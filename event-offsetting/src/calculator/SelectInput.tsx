import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    PropsOf
} from '@chakra-ui/react';

import { Select, GroupBase } from 'chakra-react-select';
import React, { useId } from 'react';
import {
    FieldValues,
    FieldPath,
    Controller,
    useFormContext
} from 'react-hook-form';

type SelectInputProps<
    TFieldValues extends FieldValues = FieldValues,
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
> = {
    name: FieldPath<TFieldValues>;
    label?: string;
    isRequired?: boolean;
} & PropsOf<typeof Select<Option, IsMulti, Group>>;

export function SelectInput<
    TFieldValues extends FieldValues = FieldValues,
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>
>({
    name,
    label,
    isRequired = false,
    ...selectProps
}: SelectInputProps<TFieldValues, Option, IsMulti, Group>) {
    const { control } = useFormContext<TFieldValues>();
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
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select<Option, IsMulti, Group>
                        id={id}
                        instanceId={id}
                        name={name}
                        ref={ref}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        {...selectProps}
                    />
                    <FormErrorMessage>{error?.message}</FormErrorMessage>
                </FormControl>
            )}
        />
    );
}
