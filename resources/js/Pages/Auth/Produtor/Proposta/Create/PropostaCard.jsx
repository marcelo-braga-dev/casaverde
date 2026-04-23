import { Card, CardContent, CardHeader } from "@mui/material";
import { IconFileInvoice } from "@tabler/icons-react";
import Grid from "@mui/material/Grid2";
import TextInfo from "@/Components/DataDisplay/TextInfo.jsx";
import { useEffect, useState } from "react";

const PropostaCard = ({ data, setData }) => {
    const [taxaReducao, setTaxaReducao] = useState("");

    const getTaxaReducao = async () => {
        const response = await axios.get(route("auth.config.api.get-taxa-reducao-conta"));
        const value = response.data;

        setTaxaReducao(value);
        setData("taxa_reducao", value);
    };

    useEffect(() => {
        getTaxaReducao();
    }, []);

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Proposta" avatar={<IconFileInvoice />} disableTypography />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextInfo
                            title="Taxa Redução da Conta de Energia"
                            text={`${taxaReducao ?? data?.taxa_reducao ?? 0}%`}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PropostaCard;