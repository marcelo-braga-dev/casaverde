import { Typography } from "@mui/material";

function formatMoney(value) {
    const number = Number(value || 0);

    return number.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export default function MoneyText({
                                      value,
                                      bold = false,
                                      color,
                                      variant = "body2",
                                      component = "span",
                                  }) {
    return (
        <Typography
            variant={variant}
            component={component}
            color={color}
            fontWeight={bold ? 700 : 400}
        >
            {formatMoney(value)}
        </Typography>
    );
}
