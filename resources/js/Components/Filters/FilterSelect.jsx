import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';

export default function FilterSelect({
                                         label,
                                         value,
                                         onChange,
                                         options = [],
                                         name,
                                     }) {
    return (
        <FormControl
            size="small"
            sx={{
                minWidth: {
                    xs: '100%',
                    md: 190,
                },
            }}
        >
            <InputLabel>{label}</InputLabel>

            <Select
                name={name}
                label={label}
                value={value ?? ''}
                onChange={(event) => onChange?.(event.target.value)}
            >
                <MenuItem value="">Todos</MenuItem>

                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
