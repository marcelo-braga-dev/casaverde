import { Box, LinearProgress } from '@mui/material';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function InertiaProgressOverlay() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const start = router.on('start', () => setLoading(true));
        const finish = router.on('finish', () => setLoading(false));

        return () => {
            start();
            finish();
        };
    }, []);

    if (!loading) {
        return null;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 2000,
            }}
        >
            <LinearProgress
                sx={{
                    height: 3,
                    '& .MuiLinearProgress-bar': {
                        background:
                            'linear-gradient(90deg, #0B7A53, #10B981, #0284C7)',
                    },
                }}
            />
        </Box>
    );
}
