import { TextField } from '@mui/material';

export default function FilterTextField({
                                            label,
                                            value,
                                            onChange,
                                            placeholder,
                                            name,
                                        }) {
    return (
        <TextField
            name={name}
            label={label}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(event) => onChange?.(event.target.value)}
            size="small"
            sx={{
                minWidth: {
                    xs: '100%',
                    md: 220,
                },
            }}
        />
    );
}
