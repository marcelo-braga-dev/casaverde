// DescontosGrafico.jsx
import React, {useEffect, useRef, useState} from 'react';
import {BarController, BarElement, CategoryScale, Chart as ChartJS, LinearScale} from 'chart.js';
import axios from 'axios';

ChartJS.register(BarController, CategoryScale, LinearScale, BarElement);

const DescontosGrafico = ({onExport, idProposta, dados}) => {
    const canvasRef = useRef(null);
    const [proposta, setProposta] = useState(null);

    useEffect(() => {
        fetchDadosProposta();
    }, []);

    const fetchDadosProposta = async () => {
        try {
            const response = await axios.get(route('auth.propostas.pdf.cliente.get-dados', idProposta));
            setProposta(response.data);
        } catch (error) {
            console.error('Erro ao buscar dados da proposta:', error);
        }
    };

    useEffect(() => {
        if (!proposta || !canvasRef.current) return;

        // const aporteMensal = proposta?.valor_medio * (proposta?.taxa_reducao / 100);
        const aporteMensal = dados?.valor_medio * (dados?.discount_percent / 100);
        const taxa = 0.01; // 1% ao mês
        const meses = dados?.prazo_locacao;

        let acumulado = 0;
        const acumuladoComRendimento = [];

        for (let i = 1; i <= meses; i++) {
            acumulado = (acumulado + aporteMensal) * (1 + taxa);
            acumuladoComRendimento.push(acumulado.toFixed(2));
        }

        const labels = Array.from({length: meses}, (_, i) => `Mês ${i + 1}`);
        const datas = acumuladoComRendimento.map(Number);

        const ctx = canvasRef.current.getContext('2d');

        const chart = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Desconto Acumulado (R$)',
                        data: datas,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: false,
                animation: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        });

        // Espera a renderização e envia a imagem para o callback
        setTimeout(() => {
            const base64Image = canvasRef.current.toDataURL('image/png');
            onExport(base64Image);
            chart.destroy(); // importante para evitar vazamento de memória
        }, 500);

    }, [proposta]);

    return (
        <canvas
            ref={canvasRef}
            width="1200"
            height="400"
            style={{display: 'none'}}
        />
    );
};

export default DescontosGrafico;
