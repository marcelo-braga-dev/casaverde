import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconMapPin, IconSearch } from "@tabler/icons-react";

const emptyAddress = {
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    referencia: "",
    latitude: "",
    longitude: "",
};

const AddressCard = ({ address, setAddressData, errors = {} }) => {
    const [loadingCep, setLoadingCep] = useState(false);
    const [cepMessage, setCepMessage] = useState("");

    const safeAddress = address ?? emptyAddress;

    const onlyNumbers = (value) => String(value ?? "").replace(/\D/g, "");

    const searchCep = async () => {
        const cep = onlyNumbers(safeAddress.cep);

        if (cep.length !== 8) {
            setCepMessage("Informe um CEP com 8 dígitos.");
            return;
        }

        setLoadingCep(true);
        setCepMessage("");

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const result = await response.json();

            if (result?.erro) {
                setCepMessage("CEP não encontrado.");
                return;
            }

            setAddressData({
                cep,
                rua: result.logradouro ?? "",
                bairro: result.bairro ?? "",
                cidade: result.localidade ?? "",
                estado: result.uf ?? "",
            });

            setCepMessage("Endereço preenchido pelo CEP.");
        } catch {
            setCepMessage("Não foi possível consultar o CEP agora.");
        } finally {
            setLoadingCep(false);
        }
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Endereço da Unidade Consumidora" avatar={<IconMapPin />} />

            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="CEP"
                            value={safeAddress.cep}
                            onChange={(e) => setAddressData("cep", e.target.value)}
                            onBlur={searchCep}
                            error={!!errors["address.cep"]}
                            helperText={errors["address.cep"] || cepMessage}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <div>
                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={<IconSearch />}
                                onClick={searchCep}
                                disabled={loadingCep}
                                fullWidth
                                sx={{ height: "100%" }}
                            >
                                Buscar CEP
                            </Button>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                            label="Rua"
                            value={safeAddress.rua}
                            onChange={(e) => setAddressData("rua", e.target.value)}
                            error={!!errors["address.rua"]}
                            helperText={errors["address.rua"]}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="Número"
                            value={safeAddress.numero}
                            onChange={(e) => setAddressData("numero", e.target.value)}
                            error={!!errors["address.numero"]}
                            helperText={errors["address.numero"]}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Complemento"
                            value={safeAddress.complemento}
                            onChange={(e) => setAddressData("complemento", e.target.value)}
                            error={!!errors["address.complemento"]}
                            helperText={errors["address.complemento"]}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Bairro"
                            value={safeAddress.bairro}
                            onChange={(e) => setAddressData("bairro", e.target.value)}
                            error={!!errors["address.bairro"]}
                            helperText={errors["address.bairro"]}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="Cidade"
                            value={safeAddress.cidade}
                            onChange={(e) => setAddressData("cidade", e.target.value)}
                            error={!!errors["address.cidade"]}
                            helperText={errors["address.cidade"]}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="Estado"
                            value={safeAddress.estado}
                            onChange={(e) => setAddressData("estado", e.target.value.toUpperCase())}
                            error={!!errors["address.estado"]}
                            helperText={errors["address.estado"]}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Referência"
                            value={safeAddress.referencia}
                            onChange={(e) => setAddressData("referencia", e.target.value)}
                            error={!!errors["address.referencia"]}
                            helperText={errors["address.referencia"]}
                            fullWidth
                        />
                    </Grid>

                    {/*<Grid size={{ xs: 12, md: 3 }}>*/}
                    {/*    <TextField*/}
                    {/*        label="Latitude"*/}
                    {/*        value={safeAddress.latitude}*/}
                    {/*        onChange={(e) => setAddressData("latitude", e.target.value)}*/}
                    {/*        error={!!errors["address.latitude"]}*/}
                    {/*        helperText={errors["address.latitude"]}*/}
                    {/*        fullWidth*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/*<Grid size={{ xs: 12, md: 3 }}>*/}
                    {/*    <TextField*/}
                    {/*        label="Longitude"*/}
                    {/*        value={safeAddress.longitude}*/}
                    {/*        onChange={(e) => setAddressData("longitude", e.target.value)}*/}
                    {/*        error={!!errors["address.longitude"]}*/}
                    {/*        helperText={errors["address.longitude"]}*/}
                    {/*        fullWidth*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default AddressCard;
