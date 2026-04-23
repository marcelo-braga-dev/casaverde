import { Card, CardContent, CardHeader, IconButton, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { IconClipboardText, IconSearch } from "@tabler/icons-react";
import { useEffect } from "react";
import useInputMask from "@/Utils/Masks/InputsMask.js";
import axios from "axios";
import { useAlertMessage } from "@/Contexts/Alerts/SnackbarProvider.jsx";

const DadosPessoais = ({ data, setData, title, completo, verificarUsuarioExistente }) => {
    const { alertError } = useAlertMessage();

    useEffect(() => {
        useInputMask();
    }, [data.tipo_pessoa]);

    const handleFetch = async () => {
        const cnpj = data?.cnpj?.replace(/\D/g, "");

        if (!cnpj || cnpj.length !== 14) {
            return;
        }

        try {
            const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpj}`);
            const empresa = response.data;

            setData("razao_social", empresa?.razao_social ?? "");
            setData("nome_fantasia", empresa?.estabelecimento?.nome_fantasia ?? "");
            setData("tipo_empresa", empresa?.natureza_juridica?.descricao ?? "");
            setData("ramo_atividade", empresa?.estabelecimento?.atividade_principal?.descricao ?? "");
            setData("ie", empresa?.inscricoes_estaduais?.[0]?.inscricao_estadual ?? "");
            setData("data_fundacao", empresa?.estabelecimento?.data_inicio_atividade ?? "");
        } catch (err) {
            alertError(err?.response?.data?.detalhes || "Erro ao buscar informações do CNPJ.");
            console.log("Erro ao buscar informações do CNPJ.", err);
        }
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title={title ?? "Dados Cadastrais"} avatar={<IconClipboardText />} />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <FormControl>
                            <FormLabel>Tipo de Cadastro</FormLabel>
                            <RadioGroup
                                row
                                value={data.tipo_pessoa}
                                onChange={(e) => setData("tipo_pessoa", e.target.value)}
                            >
                                <FormControlLabel value="pj" control={<Radio />} label="Pessoa Jurídica" />
                                <FormControlLabel value="pf" control={<Radio />} label="Pessoa Física" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {data.tipo_pessoa === "pj" && (
                        <>
                            <Grid size={{ xs: 8, md: 4 }}>
                                <TextField
                                    label="CNPJ"
                                    className="cnpj"
                                    value={data?.cnpj ?? ""}
                                    onChange={(e) => setData("cnpj", e.target.value)}
                                    onBlur={(e) => verificarUsuarioExistente?.(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 4, md: 8 }} alignContent="center">
                                <IconButton color="info" onClick={handleFetch}>
                                    <IconSearch />
                                </IconButton>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Razão Social:"
                                    value={data.razao_social ?? ""}
                                    onChange={(e) => setData("razao_social", e.target.value)}
                                    required
                                    slotProps={{ inputLabel: { shrink: !!data.razao_social } }}
                                    fullWidth
                                />
                            </Grid>

                            {completo && (
                                <>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            label="Nome Fantasia:"
                                            value={data.nome_fantasia ?? ""}
                                            onChange={(e) => setData("nome_fantasia", e.target.value)}
                                            slotProps={{ inputLabel: { shrink: !!data.nome_fantasia } }}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Tipo de Empresa:"
                                            value={data.tipo_empresa ?? ""}
                                            onChange={(e) => setData("tipo_empresa", e.target.value)}
                                            select
                                            fullWidth
                                        >
                                            <MenuItem value="Microempreendedor Individual (MEI)">Microempreendedor Individual (MEI)</MenuItem>
                                            <MenuItem value="Sociedade Limitada (LTDA)">Sociedade Limitada (LTDA)</MenuItem>
                                            <MenuItem value="Empresa Individual (EI)">Empresa Individual (EI)</MenuItem>
                                            <MenuItem value="Associação">Associação</MenuItem>
                                            <MenuItem value="Sociedade Simples (SS)">Sociedade Simples (SS)</MenuItem>
                                            <MenuItem value="Sociedade Anônima (SA)">Sociedade Anônima (SA)</MenuItem>
                                            <MenuItem value="Sociedade Limitada Unipessoal (SLU)">Sociedade Limitada Unipessoal (SLU)</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Ramo Atividade:"
                                            value={data.ramo_atividade ?? ""}
                                            onChange={(e) => setData("ramo_atividade", e.target.value)}
                                            slotProps={{ inputLabel: { shrink: !!data.ramo_atividade } }}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Inscrição Estadual:"
                                            value={data.ie ?? ""}
                                            onChange={(e) => setData("ie", e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Inscrição Municipal:"
                                            value={data.im ?? ""}
                                            onChange={(e) => setData("im", e.target.value)}
                                            slotProps={{ inputLabel: { shrink: !!data.im } }}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Data Fundação:"
                                            value={data.data_fundacao ?? ""}
                                            onChange={(e) => setData("data_fundacao", e.target.value)}
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}
                        </>
                    )}

                    {data.tipo_pessoa === "pf" && (
                        <>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="CPF:"
                                    className="cpf"
                                    value={data.cpf ?? ""}
                                    onChange={(e) => setData("cpf", e.target.value)}
                                    onBlur={(e) => verificarUsuarioExistente?.(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <TextField
                                    label="Nome Completo:"
                                    value={data.nome ?? ""}
                                    onChange={(e) => setData("nome", e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            {completo && (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="RG:"
                                            className="rg"
                                            value={data.rg ?? ""}
                                            onChange={(e) => setData("rg", e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Data Nascimento:"
                                            value={data.data_nascimento ?? ""}
                                            onChange={(e) => setData("data_nascimento", e.target.value)}
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Gênero:"
                                            value={data.genero ?? ""}
                                            onChange={(e) => setData("genero", e.target.value)}
                                            select
                                            fullWidth
                                        >
                                            <MenuItem value="m">Masculino</MenuItem>
                                            <MenuItem value="f">Feminino</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Estado Civil:"
                                            value={data.estado_civil ?? ""}
                                            onChange={(e) => setData("estado_civil", e.target.value)}
                                            select
                                            fullWidth
                                        >
                                            <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                                            <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                                            <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                                            <MenuItem value="Viuvo(a)">Viuvo(a)</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <TextField
                                            label="Ocupação Profissional:"
                                            value={data.profissao ?? ""}
                                            onChange={(e) => setData("profissao", e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}
                        </>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default DadosPessoais;