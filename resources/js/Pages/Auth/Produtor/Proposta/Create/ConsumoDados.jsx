import Grid from "@mui/material/Grid2";
import { Card, CardContent, CardHeader, InputAdornment, MenuItem, TextField } from "@mui/material";
import { IconFileInvoice } from "@tabler/icons-react";
import { useEffect } from "react";
import useInputMask from "@/Utils/Masks/InputsMask.js";

const ConsumoDados = ({ data, setData }) => {
    useEffect(() => {
        useInputMask();
    }, []);

    const updateDados = (field, value) => {
        setData("dados", {
            ...data.dados,
            [field]: value,
        });
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Informações da Usina" avatar={<IconFileInvoice />} disableTypography />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Potência da Usina"
                            value={data?.dados?.potencia ?? ""}
                            onChange={(e) => updateDados("potencia", e.target.value)}
                            type="number"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="start">kWp</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Média Geração Mensal"
                            value={data?.dados?.geracao_media ?? ""}
                            onChange={(e) => updateDados("geracao_media", e.target.value)}
                            type="number"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="start">kWh/mês</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Valor do Investimento"
                            value={data?.dados?.valor_investimento ?? ""}
                            onChange={(e) => updateDados("valor_investimento", e.target.value)}
                            className="money"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Prazo Contrato"
                            value={data?.dados?.prazo_locacao ?? ""}
                            onChange={(e) => updateDados("prazo_locacao", e.target.value)}
                            select
                            required
                            fullWidth
                        >
                            <MenuItem value={12}>12 meses (1 ano)</MenuItem>
                            <MenuItem value={24}>24 meses (2 anos)</MenuItem>
                            <MenuItem value={36}>36 meses (3 anos)</MenuItem>
                            <MenuItem value={48}>48 meses (4 anos)</MenuItem>
                            <MenuItem value={60}>60 meses (5 anos)</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ConsumoDados;