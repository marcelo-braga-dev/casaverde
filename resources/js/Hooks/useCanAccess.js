import useAuthUser from './useAuthUser';
import { canAccess } from '@/Utils/permissions';

export default function useCanAccess(roles = []) {
    const user = useAuthUser();

    return canAccess(user, roles);
}
