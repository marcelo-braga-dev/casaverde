import { Button } from "@mui/material";

export default function ConfirmActionButton({
                                                children,
                                                message = "Deseja realmente executar esta ação?",
                                                onConfirm,
                                                disabled = false,
                                                variant = "contained",
                                                color = "primary",
                                                size = "medium",
                                                fullWidth = false,
                                            }) {
    const handleClick = () => {
        if (disabled) {
            return;
        }

        if (window.confirm(message)) {
            onConfirm?.();
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            color={color}
            size={size}
            disabled={disabled}
            fullWidth={fullWidth}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
}
