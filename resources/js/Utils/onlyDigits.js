const onlyDigits = (value, maxLength = 12) => {
    return String(value ?? "").replace(/\D/g, "").slice(0, maxLength);
};

export default onlyDigits;
