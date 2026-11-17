// DescontosGrafico.jsx
import React, {useEffect, useRef} from 'react';
import {BarController, BarElement, CategoryScale, Chart as ChartJS, LinearScale} from 'chart.js';

ChartJS.register(BarController, CategoryScale, LinearScale, BarElement);

const DescontosGrafico = ({onExport, dados}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!dados || !canvasRef.current) return;

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

    }, [dados]);

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
