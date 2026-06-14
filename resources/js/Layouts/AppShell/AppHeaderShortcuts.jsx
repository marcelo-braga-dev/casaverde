import { Badge, IconButton, Stack, Tooltip } from '@mui/material';
import { Link, usePage } from '@inertiajs/react';
import { IconFileInvoice, IconHeadset } from '@tabler/icons-react';

function safeRoute(name) {
    try {
        if (typeof route === 'function' && route().has(name)) {
            return route(name);
        }

        return null;
    } catch {
        return null;
    }
}

const iconButtonSx = {
    bgcolor: 'grey.100',
    borderRadius: 2,
    width: 36,
    height: 36,
};

export default function AppHeaderShortcuts() {
    const { auth, navBadges } = usePage().props;
    const roleName = auth?.user?.role_name;

    if (roleName !== 'admin' && roleName !== 'consultor') {
        return null;
    }

    const faturasHref = safeRoute('admin.relatorios.faturas');
    const suporteHref = safeRoute('support.tickets.index');

    return (
        <Stack direction="row" alignItems="center" gap={0.5}>
            {faturasHref && (
                <Tooltip title="Faturas de Concessionárias">
                    <IconButton component={Link} href={faturasHref} size="small" sx={iconButtonSx}>
                        <Badge badgeContent={navBadges?.pendingReviewBills ?? 0} color="warning" max={99}>
                            <IconFileInvoice size={20} />
                        </Badge>
                    </IconButton>
                </Tooltip>
            )}

            {suporteHref && (
                <Tooltip title="Suporte - Todos os Chamados">
                    <IconButton component={Link} href={suporteHref} size="small" sx={iconButtonSx}>
                        <Badge badgeContent={navBadges?.newSupportTickets ?? 0} color="error" max={99}>
                            <IconHeadset size={20} />
                        </Badge>
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );
}
