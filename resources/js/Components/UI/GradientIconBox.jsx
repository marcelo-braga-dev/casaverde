import { Box } from '@mui/material';

export default function GradientIconBox({ icon: Icon, color = 'primary', size = 46 }) {
    const gradients = {
        primary: 'linear-gradient(135deg, #0B7A53 0%, #16A34A 100%)',
        secondary: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
        warning: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        error: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
        dark: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
    };

    return (
        <Box
            sx={{
                width: size,
                height: size,
                minWidth: size,
                borderRadius: 3,
                background: gradients[color] || gradients.primary,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 14px 30px rgba(15,23,42,0.16)',
            }}
        >
            {Icon && <Icon size={Math.round(size * 0.46)} />}
        </Box>
    );
}
