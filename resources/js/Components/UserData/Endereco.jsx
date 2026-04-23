import { Card, CardContent, CardHeader, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconMapPin } from "@tabler/icons-react";
import { useEffect } from "react";
import useInputMask from "@/Utils/Masks/InputsMask.js";
import { buscarCep } from "@/Utils/buscarCepUtil.js";

const Endereco = ({ title, endereco, setEndereco, required }) => {
    useEffect(() => {
        useInputMask();
    }, []);

    const handleBuscarCep = async () => {
        const cep = endereco?.cep ?? "";

        if (cep.length === 9) {
            try {
                const enderecoData = await buscarCep(cep);

                setEndereco({
                    ...endereco,
                    rua: enderecoData.logradouro,
                    bairro: enderecoData.bairro,
                    cidade: enderecoData.cidade,
                    estado: enderecoData.estado,
                });
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert("Digite um CEP válido com 8 dígitos.");
        }
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title={title ?? "Endereço"} avatar={<IconMapPin />} disableTypography />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 6, md: 3 }}>
                        <TextField
                            label="CEP"
                            className="cep"
                            value={endereco?.cep ?? ""}
                            onBlur={handleBuscarCep}
                            onChange={(e) => setEndereco({ ...endereco, cep: e.target.value })}
                            slotProps={{ inputLabel: { shrink: !!endereco?.cep } }}
                            required={required}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 9 }}>
                        <TextField
                            label="Rua/Av:"
                            value={endereco?.rua ?? ""}
                            onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                            slotProps={{ inputLabel: { shrink: !!endereco?.rua } }}
                            required={required}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                            label="Número:"
                            value={endereco?.numero ?? ""}
                            required={!!endereco?.rua || required}
                            onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                            slotProps={{ inputLabel: { shrink: !!endereco?.numero } }}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Complemento:"
                            value={endereco?.complemento ?? ""}
                            onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                            slotProps={{ inputLabel: { shrink: !!endereco?.complemento } }}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Bairro:"
                            value={endereco?.bairro ?? ""}
                            slotProps={{ inputLabel: { shrink: !!endereco?.bairro } }}
                            required={required}
                            onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Cidade:"
                            value={endereco?.cidade ?? ""}
                            slotProps={{ inputLabel: { shrink: !!endereco?.cidade } }}
                            required={required}
                            onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Estado:"
                            value={endereco?.estado ?? ""}
                            slotProps={{ inputLabel: { shrink: !!endereco?.estado } }}
                            required={required}
                            onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                            fullWidth
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            label="Ponto de Referência:"
                            value={endereco?.referencia ?? ""}
                            onChange={(e) => setEndereco({ ...endereco, referencia: e.target.value })}
                            slotProps={{ inputLabel: { shrink: !!endereco?.referencia } }}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Endereco;