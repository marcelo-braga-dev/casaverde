import { Autocomplete, TextField } from '@mui/material';

export default function SearchableSelect({
    label,
    value,
    onChange,
    options = [],
    error,
    helperText,
    placeholder,
    noOptionsText = 'Nenhuma opção encontrada',
    name,
    required,
    ...rest
}) {
    const selectedOption =
        options.find((option) => String(option.value) === String(value ?? '')) ?? null;

    return (
        <Autocomplete
            options={options}
            value={selectedOption}
            onChange={(_event, option) => onChange?.(option?.value ?? '')}
            getOptionLabel={(option) => option?.label ?? ''}
            isOptionEqualToValue={(option, current) => String(option.value) === String(current?.value)}
            noOptionsText={noOptionsText}
            getOptionDisabled={(option) => Boolean(option?.disabled)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    error={error}
                    helperText={helperText}
                    required={required}
                />
            )}
            {...rest}
        />
    );
}
