import React, {useEffect, useState} from 'react';
import PropostaPdf from './PropostaModelo.jsx';
import {Button} from "@mui/material";
import {pdf} from '@react-pdf/renderer';

import VisualizadorPDF from './VisualizadorPDF';
import {IconDownload, IconEdit} from "@tabler/icons-react";
import DescontosGrafico from "@/Pages/Auth/Cliente/Proposta/Show/Graficos/DescontosGrafico.jsx";
import {Link} from "@inertiajs/react";

function PropostaBaixar({idProposta, dadosProposta}) {
    const [urlPdf, setUrlPdf] = useState()
    const [imagemGrafico, setImagemGrafico] = useState(null);
    const [dados, setDados] = useState([])

    useEffect(() => {
        fethcDadosProposta()
    }, [imagemGrafico]);

    const gerarPdfEEnviar = async (info) => {
        const blob = await pdf(<PropostaPdf dados={dadosProposta} idProposta={idProposta} imagemGrafico={imagemGrafico} />).toBlob();

        const formData = new FormData();
        formData.append('file', blob, 'proposta.pdf');

        try {
            const response = await axios.post(route('auth.propostas.pdf.cliente.gerar-pdf'), formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            const url = response.data.url;
            setUrlPdf(url)

        } catch (error) {
            console.error('Erro ao enviar PDF:', error);
        }
    };

    const abrirPdf = () => {
        window.open(urlPdf, '_blank');
    }

    const [isWebView, setIsWebView] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        const isAndroidWebView = /wv/.test(userAgent) || /\bVersion\/[\d.]+.*Chrome/.test(userAgent);
        const isIosWebView = /iPhone|iPod|iPad/.test(userAgent) && !/Safari/.test(userAgent);

        setIsWebView(isAndroidWebView || isIosWebView);
    }, []);

    const fethcDadosProposta = async () => {
        const response = await axios.get(route('auth.propostas.pdf.cliente.get-dados', idProposta))
        setDados(response.data)
        gerarPdfEEnviar(response.data)
    }

    return (
        <div style={{padding: 20}}>
            <div className="flex gap-2 mb-3">
                <Link href={route("consultor.propostas.cliente.edit", idProposta)}>
                    <Button startIcon={<IconEdit />} color="warning">
                        Editar
                    </Button>
                </Link>

                <a href={route("consultor.propostas.cliente.pdf", idProposta)} target="_blank" rel="noreferrer">
                    <Button color="error" startIcon={<IconDownload/>} onClick={abrirPdf}>Baixar PDF</Button>
                </a>
            </div>

            {!urlPdf ? (
                <div style={{width: '100%', height: '70vh', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Gerando PDF...
                </div>
            ) : isWebView ? (
                <VisualizadorPDF pdfUrl={urlPdf}/>
            ) : (
                <div style={{width: '100%', height: '70vh', border: '1px solid #ccc'}}>
                    <iframe src={urlPdf} width="100%" height="100%" style={{border: 'none'}} title="Visualizador PDF"/>
                </div>
            )}

            <div style={{marginTop: 50}}>
                <DescontosGrafico onExport={setImagemGrafico} idProposta={idProposta} dados={dadosProposta}/>
            </div>
        </div>
    );
}

export default PropostaBaixar;
