import React, {useEffect, useState} from 'react';
import PropostaPdf from './PropostaModelo.jsx';
import {Button} from "@mui/material";
import {pdf} from '@react-pdf/renderer';

import VisualizadorPDF from './VisualizadorPDF';
import {IconDownload, IconEdit} from "@tabler/icons-react";
import DescontosGrafico from "./Graficos/DescontosGrafico.jsx";
import {Link, usePage} from "@inertiajs/react";
import useBrandName from '@/Hooks/useBrandName';

function PropostaBaixar({idProposta, dadosProposta}) {
    const brandName = useBrandName();
    const [urlPdf, setUrlPdf] = useState()
    const [imagemGrafico, setImagemGrafico] = useState(null);
    // Na demonstração a prévia é o PDF do servidor (modelo novo), não o modelo antigo gerado no navegador.
    const isDemo = Boolean(usePage().props.demo?.enabled)

    useEffect(() => {
        if (isDemo) {
            setUrlPdf(route('consultor.propostas.cliente.pdf', idProposta))
            return
        }
        gerarPdfEEnviar()
    }, [imagemGrafico, isDemo]);

    // O PDF é montado no navegador; o upload só existe porque o visualizador do celular
    // (Google Viewer) precisa de uma URL pública.
    const gerarPdfEEnviar = async () => {
        const blob = await pdf(<PropostaPdf dados={dadosProposta} idProposta={idProposta} imagemGrafico={imagemGrafico} brandName={brandName} />).toBlob();

        const formData = new FormData();
        formData.append('file', blob, 'proposta.pdf');

        try {
            const response = await axios.post(route('consultor.propostas.pdf.cliente-upload'), formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            setUrlPdf(response.data.url)
        } catch (error) {
            console.error('Erro ao enviar PDF:', error);
        }
    };

    const [isWebView, setIsWebView] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        const isAndroidWebView = /wv/.test(userAgent) || /\bVersion\/[\d.]+.*Chrome/.test(userAgent);
        const isIosWebView = /iPhone|iPod|iPad/.test(userAgent) && !/Safari/.test(userAgent);

        setIsWebView(isAndroidWebView || isIosWebView);
    }, []);

    return (
        <div style={{padding: 20}}>
            <div className="flex gap-2 mb-3">
                <Link href={route("consultor.propostas.cliente.edit", idProposta)}>
                    <Button startIcon={<IconEdit />} color="warning">
                        Editar
                    </Button>
                </Link>

                <a href={route("consultor.propostas.cliente.pdf", idProposta)} target="_blank" rel="noreferrer">
                    <Button color="error" startIcon={<IconDownload/>}>Baixar PDF</Button>
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

            {!isDemo && (
                <div style={{marginTop: 50}}>
                    <DescontosGrafico onExport={setImagemGrafico} dados={dadosProposta}/>
                </div>
            )}
        </div>
    );
}

export default PropostaBaixar;
