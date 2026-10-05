import { usePage } from '@inertiajs/react';

// Nome da Identidade Visual: nenhuma tela deve fixar o nome da empresa no código.
export default function useBrandName() {
    return usePage().props.brand?.name || import.meta.env.VITE_APP_NAME || 'Casa Verde';
}
