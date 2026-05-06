import { Typography } from "@mui/material";

function normalizeDate(value) {
    if (!value) {
        return "-";
    }

    if (typeof value === "string" && value.includes("/")) {
        return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function DateText({
                                     value,
                                     variant = "body2",
                                     component = "span",
                                     color,
                                 }) {
    return (
        <Typography variant={variant} component={component} color={color}>
            {normalizeDate(value)}
        </Typography>
    );
}
