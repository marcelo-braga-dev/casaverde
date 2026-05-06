import { useState } from "react";
import { Button } from "@mui/material";

export default function CopyButton({
                                       value,
                                       label = "Copiar",
                                       copiedLabel = "Copiado",
                                       disabled,
                                       size = "small",
                                       variant = "outlined",
                                   }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        if (!value || disabled) {
            return;
        }

        await navigator.clipboard.writeText(value);

        setCopied(true);

        window.setTimeout(() => {
            setCopied(false);
        }, 1800);
    };

    return (
        <Button
            type="button"
            size={size}
            variant={variant}
            disabled={!value || disabled}
            onClick={copy}
        >
            {copied ? copiedLabel : label}
        </Button>
    );
}
