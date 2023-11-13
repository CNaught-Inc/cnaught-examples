import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputProps
} from '@chakra-ui/react';

import { ReactNode } from 'react';
import { FieldValues, FieldPath, useFormContext } from 'react-hook-form';

type TextInputProps<TFieldValues extends FieldValues = FieldValues> = {
    label?: string;
    name: FieldPath<TFieldValues>;
    helperText?: ReactNode;
    showErrors?: boolean;
} & InputProps;

export function TextInput<TFieldValues extends FieldValues = FieldValues>({
    label,
    name,
    helperText,
    showErrors = true,
    ...inputProps
}: TextInputProps<TFieldValues>) {
    const id = inputProps.id ?? name;
    const {
        register,
        formState: { errors }
    } = useFormContext();
    const error = errors[name];

    return (
        <FormControl isInvalid={!!error} isRequired={inputProps.isRequired}>
            {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
            <Input
                id={id}
                {...register(name)}
                {...inputProps}
                type="text"
                errorBorderColor={showErrors ? 'crimson' : 'none'}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
            {showErrors && error && (
                <FormErrorMessage>{error.message as string}</FormErrorMessage>
            )}
        </FormControl>
    );
}
