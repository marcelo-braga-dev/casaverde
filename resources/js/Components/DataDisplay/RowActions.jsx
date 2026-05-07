import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { IconDotsVertical } from '@tabler/icons-react';
import { useState } from 'react';

export default function RowActions({ actions = [] }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    if (!actions.length) {
        return null;
    }

    return (
        <>
            <Tooltip title="Ações">
                <IconButton
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    size="small"
                    sx={{
                        bgcolor: 'grey.100',
                        '&:hover': {
                            bgcolor: 'grey.200',
                        },
                    }}
                >
                    <IconDotsVertical size={18} />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    sx: {
                        minWidth: 190,
                        borderRadius: 3,
                    },
                }}
            >
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <MenuItem
                            key={action.label}
                            onClick={() => {
                                setAnchorEl(null);
                                action.onClick?.();
                            }}
                            component={action.component}
                            href={action.href}
                            sx={{
                                gap: 1,
                                color: action.danger ? 'error.main' : 'text.primary',
                                fontWeight: 700,
                            }}
                        >
                            {Icon && <Icon size={18} />}
                            {action.label}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
