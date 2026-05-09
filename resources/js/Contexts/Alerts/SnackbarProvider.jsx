import { createContext, useContext, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import GlobalSnackbar from '@/Components/Alerts/GlobalSnackbar.jsx';
import { normalizeAlertMessage } from '@/Utils/Alerts/alertUtils.js';

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
    const { alert, errors } = usePage().props;

    const [snackbar, setSnackbar] = useState({
        open: false,
        type: 'info',
        message: '',
    });

    const showSnackbar = (message, type = 'info') => {
        const normalizedMessage = normalizeAlertMessage(message);

        if (!normalizedMessage) return;

        setSnackbar({
            open: true,
            type,
            message: normalizedMessage,
        });
    };

    const closeSnackbar = () => {
        setSnackbar((current) => ({
            ...current,
            open: false,
        }));
    };

    useEffect(() => {
        if (!alert) return;

        if (alert.success) {
            showSnackbar(alert.success, 'success');
            return;
        }

        if (alert.error) {
            showSnackbar(alert.error, 'error');
            return;
        }

        if (alert.warning) {
            showSnackbar(alert.warning, 'warning');
            return;
        }

        if (alert.info) {
            showSnackbar(alert.info, 'info');
        }
    }, [alert?.success, alert?.error, alert?.warning, alert?.info]);

    useEffect(() => {
        const message = normalizeAlertMessage(errors);

        if (message) {
            showSnackbar(message, 'error');
        }
    }, [JSON.stringify(errors)]);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <GlobalSnackbar
                open={snackbar.open}
                type={snackbar.type}
                message={snackbar.message}
                onClose={closeSnackbar}
            />
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);

    if (!context) {
        throw new Error('useSnackbar precisa estar dentro do SnackbarProvider.');
    }

    return context;
};
