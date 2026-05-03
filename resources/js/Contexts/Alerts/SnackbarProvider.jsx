import { createContext, useContext, useEffect, useState } from "react";
import GlobalSnackbar from "@/Components/Alerts/GlobalSnackbar.jsx";
import { normalizeAlertMessage } from "@/Utils/Alerts/alertUtils.js";

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children, initialAlert = null, errors = null }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        type: "info",
        message: "",
    });

    const showSnackbar = (message, type = "info") => {
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
        if (!initialAlert) return;

        if (initialAlert.success) {
            showSnackbar(initialAlert.success, "success");
            return;
        }

        if (initialAlert.error) {
            showSnackbar(initialAlert.error, "error");
            return;
        }

        if (initialAlert.warning) {
            showSnackbar(initialAlert.warning, "warning");
            return;
        }

        if (initialAlert.info) {
            showSnackbar(initialAlert.info, "info");
        }
    }, [initialAlert]);

    useEffect(() => {
        const message = normalizeAlertMessage(errors);

        if (message) {
            showSnackbar(message, "error");
        }
    }, [errors]);

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
        throw new Error("useSnackbar precisa estar dentro do SnackbarProvider.");
    }

    return context;
};
