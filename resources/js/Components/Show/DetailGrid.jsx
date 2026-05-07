import { Grid } from '@mui/material';

export default function DetailGrid({ children }) {
    return (
        <Grid container spacing={2}>
            {children}
        </Grid>
    );
}
