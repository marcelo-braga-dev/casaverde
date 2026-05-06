import { Button, Stack } from "@mui/material";
import { router } from "@inertiajs/react";

function label(value) {
    if (!value) {
        return "";
    }

    return value
        .replace("&laquo;", "«")
        .replace("&raquo;", "»")
        .replace(/<[^>]*>/g, "");
}

export default function PaginationButtons({ links = [] }) {
    if (!links?.length) {
        return null;
    }

    return (
        <Stack direction="row" spacing={1} marginTop={3} flexWrap="wrap">
            {links.map((link, index) => (
                <Button
                    key={index}
                    size="small"
                    variant={link.active ? "contained" : "outlined"}
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url)}
                >
                    {label(link.label)}
                </Button>
            ))}
        </Stack>
    );
}
