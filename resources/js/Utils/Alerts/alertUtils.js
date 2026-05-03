export const normalizeAlertMessage = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value.filter(Boolean).join("\n");
    }

    if (typeof value === "object") {
        return Object.values(value)
            .flat()
            .filter(Boolean)
            .join("\n");
    }

    return String(value);
};

export const getAlertColor = (type) => {
    const colors = {
        success: "success",
        error: "error",
        warning: "warning",
        info: "info",
    };

    return colors[type] ?? "info";
};
