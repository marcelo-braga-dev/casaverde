import {Button, Paper} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconDownload} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import PropostaClientePage from "./DadosProposta.jsx";
import TextInfo from "@/Components/DataDisplay/TextInfo.jsx";

const PropostaProdutor = ({proposal, idProposta}) => {
    const [layout, setLayout] = useState([])
    const [dados, setDados] = useState([])
    const proposalRef = useRef(null);
console.log(proposal)
    useEffect(() => {
        fethcDadosProposta()
        fethcLayout()
    }, []);

    const fethcDadosProposta = async () => {
        const response = await axios.get(route('auth.produtor.proposta.api.get-dados', {id: idProposta}))
        setDados(response.data)
    }

    const fethcLayout = async () => {
        const response = await axios.get(route('auth.produtor.proposta.api.layout-pdf'))
        setLayout(response.data)
    }

    const generatePdf = async () => {
        const htmlContent = proposalRef.current.innerHTML;
        try {
            const response = await axios.post(route('auth.produtor.proposta.api.gerar-pdf'), {html: htmlContent})

            const url = response.data.urlPdf
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'proposta_comercial.pdf');
            document.body.appendChild(link);
            link.click();
        } finally {
        }
    };

    return (
        <>
            <Paper variant="outlined" sx={{padding: 2, marginBottom: 4}}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid size={{xs: 6}}>
                        <Button color="error" onClick={generatePdf} startIcon={<IconDownload/>}>Baixar PDF</Button>
                    </Grid>
                </Grid>
            </Paper>
            {layout.capa && (
                <Grid container>
                    <Grid size={{xs: 12}} sx={{display: {xs: 'none', lg: 'block'}}}>
                        <Paper sx={{padding: 2}} variant="outlined">
                            <div style={{textAlign: 'center', pageBreakAfter: 'always'}}>
                                <img src={layout.capa} alt="Capa" loading="lazy"/>
                            </div>

                            <div ref={proposalRef}>
                                <PropostaClientePage proposal={proposal} dados={dados}/>
                            </div>

                            <div style={{textAlign: 'center', pageBreakAfter: 'always'}}>
                                <img src={layout.page_2} alt="Capa" loading="lazy"/>
                            </div>
                        </Paper>
                    </Grid>

                </Grid>
            )}
        </>)
}
export default PropostaProdutor
