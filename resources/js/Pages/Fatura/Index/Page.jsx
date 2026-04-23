<Stack spacing={1}>
    <Chip
        label={bill.review_status}
        color={statusColor(bill.review_status)}
    />
    <Chip
        label={bill.parser_status}
        color={parserColor(bill.parser_status)}
    />
    <Chip
        label={bill.import_source}
        variant="outlined"
    />
    {bill.open_issues?.length > 0 && (
        <Chip
            label={`${bill.open_issues.length} divergência(s)`}
            color="error"
        />
    )}
</Stack>