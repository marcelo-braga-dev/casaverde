export const ROLES = {
    ADMIN: 1,
    CONSULTOR: 2,
    PRODUTOR: 3,
    CLIENTE: 4,
};

export function hasRole(user, roles = []) {
    if (!user) return false;

    return roles.includes(Number(user.role_id));
}

export function isAdmin(user) {
    return hasRole(user, [ROLES.ADMIN]);
}

export function isConsultor(user) {
    return hasRole(user, [ROLES.CONSULTOR]);
}

export function isProdutor(user) {
    return hasRole(user, [ROLES.PRODUTOR]);
}

export function isCliente(user) {
    return hasRole(user, [ROLES.CLIENTE]);
}

export function canAccess(user, allowedRoles = []) {
    if (!allowedRoles.length) return true;

    return hasRole(user, allowedRoles);
}
