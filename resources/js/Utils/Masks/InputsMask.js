import $ from 'jquery';
import 'jquery-mask-plugin/dist/jquery.mask.min';

const useInputMask = () => {
    $(() => {
        $('.data-mask').find('input').mask('00/00/0000');
        $('.time').find('input').mask('00:00:00');
        $('.date_time').find('input').mask('00/00/0000 00:00:00');
        $('.cep').find('input').mask('00000-000');
        $('.phone').find('input').mask('(00) 0000-0000');
        $('.mobile').find('input').mask('(00) 0 0000-0000');
        $('.cpf').find('input').mask('000.000.000-00');
        $('.cnpj').find('input').mask('00.000.000/0000-00');
        $('.rg').find('input').mask('000.000.000-X',
            {
                reverse: true,
                translation: {
                    X: {pattern: /[A-Za-z0-9]/},
                }
            });
    })
}
export default useInputMask
