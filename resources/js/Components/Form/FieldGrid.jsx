import { Grid } from '@mui/material';

export default function FieldGrid({ children }) {
    return (
        <Grid container spacing={2}>
            {children}
        </Grid>
    );
}
