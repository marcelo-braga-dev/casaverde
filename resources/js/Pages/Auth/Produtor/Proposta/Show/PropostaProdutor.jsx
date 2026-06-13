import {Button, Paper} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconDownload} from "@tabler/icons-react";
import {useEffect, useRef, useState} from "react";
import PropostaClientePage from "./DadosProposta.jsx";

const PropostaProdutor = ({proposal, investmentSummary}) => {
    const [layout, setLayout] = useState([])
    const [urlPdf, setUrlPdf] = useState(null)
    const [pdfError, setPdfError] = useState(false)
    const proposalRef = useRef(null);

    useEffect(() => {
        fethcLayout()
    }, []);

    useEffect(() => {
        if (layout.capa) {
            gerarPdf()
        }
    }, [layout]);

    const fethcLayout = async () => {
        const response = await axios.get(route('auth.produtor.proposta.api.layout-pdf'))
        setLayout(response.data)
    }

    const gerarPdf = async () => {
        const htmlContent = proposalRef.current.innerHTML;

        try {
            const response = await axios.post(route('auth.produtor.proposta.api.gerar-pdf'), {html: htmlContent})
            setUrlPdf(response.data.urlPdf)
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            setPdfError(true)
        }
    };

    const baixarPdf = () => {
        const link = document.createElement('a');
        link.href = urlPdf;
        link.setAttribute('download', 'proposta_comercial.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <>
            <Paper variant="outlined" sx={{padding: 2, marginBottom: 4}}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid size={{xs: 6}}>
                        <Button color="error" onClick={baixarPdf} disabled={!urlPdf} startIcon={<IconDownload/>}>Baixar PDF</Button>
                    </Grid>
                </Grid>
            </Paper>
            {layout.capa && (
                <div style={{display: 'none'}}>
                    <div ref={proposalRef}>
                        <PropostaClientePage proposal={proposal} investmentSummary={investmentSummary}/>
                    </div>
                </div>
            )}

            <div style={{width: '100%', height: '70vh', border: '1px solid #ccc', marginTop: 16}}>
                {urlPdf
                    ? <iframe src={urlPdf} width="100%" height="100%" style={{border: 'none'}} title="Visualizador PDF"/>
                    : <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                        {pdfError ? 'Não foi possível gerar o PDF. Tente novamente mais tarde.' : 'Gerando PDF...'}
                    </div>}
            </div>
        </>)
}
export default PropostaProdutor
