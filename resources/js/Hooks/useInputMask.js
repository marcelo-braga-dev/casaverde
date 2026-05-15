import { useEffect } from 'react';
import $ from 'jquery';
import 'jquery-mask-plugin';

export default function useInputMask() {
    useEffect(() => {
        const applyMasks = () => {
            $('.mask-date input').mask('00/00/0000');

            $('.mask-time input').mask('00:00');

            $('.mask-datetime input').mask('00/00/0000 00:00');

            $('.mask-cep input').mask('00000-000');

            $('.mask-phone input').mask('(00) 0000-0000');

            $('.mask-mobile input').mask('(00) 00000-0000');

            //$('.mask-cpf').mask('000.000.000-00');
            $('.mask-cpf input').mask('000.000.000-00');

            //$('.mask-cnpj').mask('00.000.000/0000-00');
            $('.mask-cnpj input').mask('00.000.000/0000-00');

            $('.mask-money input').mask(
                '000.000.000.000.000,00',
                {
                    reverse: true,
                }
            );

            $('.mask-percent input').mask(
                '##0,00%',
                {
                    reverse: true,
                }
            );

            $('.mask-rg input').mask(
                '00.000.000-0',
                {
                    translation: {
                        0: {
                            pattern: /[0-9Xx]/,
                        },
                    },
                }
            );

            $('.mask-plate input').mask('AAA-0A00', {
                translation: {
                    A: {
                        pattern: /[A-Za-z]/,
                    },
                },
            });

            $('.mask-kwh input').mask(
                '000000000',
                {
                    reverse: true,
                }
            );
        };

        applyMasks();

        const interval = setInterval(() => {
            applyMasks();
        }, 800);

        return () => {
            clearInterval(interval);
        };
    }, []);
}
