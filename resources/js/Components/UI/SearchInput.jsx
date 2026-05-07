import { Box, InputBase } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';

export default function SearchInput({ placeholder = 'Buscar no sistema...' }) {
    return (
        <Box
            sx={{
                width: {
                    md: 260,
                    lg: 340,
                },
                height: 42,
                px: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'grey.100',
                borderRadius: 999,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <IconSearch size={18} color="#64748B" />

            <InputBase
                placeholder={placeholder}
                sx={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: 500,
                }}
            />
        </Box>
    );
}
