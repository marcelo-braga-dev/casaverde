import React from 'react';

const VisualizadorPDF = ({pdfUrl}) => {
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

    return (
        <div style={{width: '100%', height: '70vh', border: '1px solid #ccc'}}>
            <iframe
                src={viewerUrl}
                width="100%"
                height="100%"
                style={{border: 'none'}}
                title="Visualizador PDF"
            />
        </div>
    );
};

export default VisualizadorPDF;
