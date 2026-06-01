import { Divider, IconButton, Menu, MenuItem, Stack, Typography, Tooltip } from '@mui/material';
import { IconDotsVertical } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function RowActions({ actions = [] }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    if (!actions.length) return null;

    const close = () => setAnchorEl(null);

    return (
        <>
            <Tooltip title="Ações" placement="left">
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1.5,
                        border: '1.5px solid',
                        borderColor: 'grey.200',
                        bgcolor: '#FFFFFF',
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: 'grey.50',
                            borderColor: 'grey.300',
                            color: 'text.primary',
                        },
                    }}
                >
                    <IconDotsVertical size={15} />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={close}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { minWidth: 180, p: 0.5 } }}
            >
                {actions.map((action, i) => {
                    const Icon = action.icon;
                    const isDivider = action.divider;

                    if (isDivider) {
                        return <Divider key={`div-${i}`} sx={{ my: 0.5 }} />;
                    }

                    return (
                        <MenuItem
                            key={action.label}
                            component={action.href ? Link : 'li'}
                            href={action.href}
                            onClick={() => { close(); action.onClick?.(); }}
                            sx={{
                                color: action.danger ? 'error.main' : 'text.primary',
                                fontWeight: 650,
                                fontSize: '0.8125rem',
                                py: 0.8,
                            }}
                        >
                            {Icon && (
                                <Stack
                                    component="span"
                                    sx={{
                                        width: 20,
                                        alignItems: 'center',
                                        color: action.danger ? 'error.main' : 'text.secondary',
                                    }}
                                >
                                    <Icon size={15} />
                                </Stack>
                            )}
                            {action.label}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
