import { GroupBase } from 'chakra-react-select';
import { FieldValues } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import wretch from 'wretch';

import { AsyncAutoCompleteInput, AsyncAutoCompleteInputProps } from './AsyncAutoCompleteInput';
import { TransportMode } from './TransportMode';

export const AddressAutoComplete = <
    TFieldValues extends FieldValues = FieldValues,
    Option = unknown,
    Group extends GroupBase<Option> = GroupBase<Option>
>({
    mode,
    ...autoCompleteProps
}: Omit<AsyncAutoCompleteInputProps<TFieldValues, Option, Group>, 'loadOptions'> & { mode: TransportMode }) => {
    const loadOptions = useDebouncedCallback(async (searchText: string) => searchAddress(searchText, mode), 300, {
        leading: true,
        trailing: true
    });

    return (
        <AsyncAutoCompleteInput<TFieldValues>
            {...autoCompleteProps}
            loadOptions={loadOptions}
            placeholder="Start typing to search..."
        />
    );
};

async function searchAddress(searchText: string, mode: TransportMode) {
    if (!searchText?.length) return [];

    const resData = await wretch(`/api/search/address?${new URLSearchParams({ searchText, mode })}`)
        .get()
        .json<{ predictions: { description: string; placeId: string }[] }>();

    return resData.predictions.map((p) => ({ label: p.description, value: p.placeId }));
}
