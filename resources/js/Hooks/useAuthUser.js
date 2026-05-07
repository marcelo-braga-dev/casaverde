import { usePage } from '@inertiajs/react';

export default function useAuthUser() {
    return usePage().props.auth?.user || null;
}
