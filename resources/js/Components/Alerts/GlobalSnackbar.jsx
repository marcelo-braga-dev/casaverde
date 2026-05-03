import { Alert, Snackbar } from "@mui/material";
import { getAlertColor } from "@/Utils/Alerts/alertUtils.js";

const GlobalSnackbar = ({ open, message, type = "info", onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Alert
                onClose={onClose}
                severity={getAlertColor(type)}
                variant="filled"
                sx={{
                    width: "100%",
                    whiteSpace: "pre-line",
                    borderRadius: 2,
                    boxShadow: 4,
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default GlobalSnackbar;
