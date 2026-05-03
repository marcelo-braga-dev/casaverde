// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
    const colors = {
        primary: {
            main: '#111827',
            hover: '#1f2937',
            light: '#374151',
            contrast: '#ffffff',
        },
        success: {
            main: '#16a34a',
            hover: '#15803d',
            light: '#dcfce7',
            contrast: '#ffffff',
        },
        error: {
            main: '#dc2626',
            hover: '#b91c1c',
            light: '#fee2e2',
            contrast: '#ffffff',
        },
        warning: {
            main: '#f97316',
            hover: '#ea580c',
            light: '#ffedd5',
            contrast: '#ffffff',
        },
        info: {
            main: '#0284c7',
            hover: '#0369a1',
            light: '#e0f2fe',
            contrast: '#ffffff',
        },
        secondary: {
            main: '#4f46e5',
            hover: '#4338ca',
            light: '#eef2ff',
            contrast: '#ffffff',
        },
    };

    const disabledStyle = {
        '&.Mui-disabled': {
            color: theme.palette.grey[500],
            backgroundColor: theme.palette.grey[200],
            borderColor: theme.palette.grey[300],
            boxShadow: 'none',
            cursor: 'not-allowed',
        },
    };

    const containedColorStyle = (color) => ({
        [`&.MuiButton-contained${color}`]: {
            color: colors[color].contrast,
            backgroundColor: colors[color].main,
            borderColor: colors[color].main,

            '&:hover': {
                color: colors[color].contrast,
                backgroundColor: colors[color].hover,
                borderColor: colors[color].hover,
                boxShadow: `0 8px 18px ${colors[color].main}33`,
            },

            '&:active': {
                transform: 'translateY(1px)',
                boxShadow: `0 4px 10px ${colors[color].main}26`,
            },
        },
    });

    const outlinedColorStyle = (color) => ({
        [`&.MuiButton-outlined${color}`]: {
            color: colors[color].main,
            backgroundColor: '#ffffff',
            borderColor: colors[color].main,

            '&:hover': {
                color: colors[color].hover,
                backgroundColor: colors[color].light,
                borderColor: colors[color].hover,
            },

            '&:active': {
                transform: 'translateY(1px)',
            },
        },
    });

    const textColorStyle = (color) => ({
        [`&.MuiButton-text${color}`]: {
            color: colors[color].main,
            backgroundColor: 'transparent',

            '&:hover': {
                color: colors[color].hover,
                backgroundColor: colors[color].light,
            },

            '&:active': {
                transform: 'translateY(1px)',
            },
        },
    });

    const allColors = ['primary', 'secondary', 'success', 'error', 'warning', 'info'];

    const containedStyles = allColors.reduce((acc, color) => {
        return {
            ...acc,
            ...containedColorStyle(color),
        };
    }, {});

    const outlinedStyles = allColors.reduce((acc, color) => {
        return {
            ...acc,
            ...outlinedColorStyle(color),
        };
    }, {});

    const textStyles = allColors.reduce((acc, color) => {
        return {
            ...acc,
            ...textColorStyle(color),
        };
    }, {});

    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
                variant: 'contained',
                color: 'primary',
            },

            styleOverrides: {
                root: {
                    minHeight: 38,
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    letterSpacing: '0.01em',
                    paddingBlock: 8,
                    paddingInline: 20,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    transition:
                        'background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease',

                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },

                    '&:active': {
                        transform: 'translateY(0)',
                    },

                    '&:focus-visible': {
                        outline: `3px solid ${theme.palette.primary.main}33`,
                        outlineOffset: 2,
                    },
                },

                contained: {
                    borderColor: 'transparent',
                    boxShadow: '0 6px 14px rgba(15, 23, 42, 0.14)',
                    ...containedStyles,
                    ...disabledStyle,
                },

                outlined: {
                    boxShadow: 'none',
                    ...outlinedStyles,
                    ...disabledStyle,
                },

                text: {
                    borderColor: 'transparent',
                    boxShadow: 'none',
                    paddingInline: 14,
                    ...textStyles,
                    ...disabledStyle,
                },

                sizeSmall: {
                    minHeight: 32,
                    fontSize: '0.78rem',
                    paddingBlock: 5,
                    paddingInline: 14,
                    borderRadius: 8,
                    fontWeight: 700,
                },

                sizeMedium: {
                    minHeight: 38,
                    fontSize: '0.875rem',
                    paddingBlock: 8,
                    paddingInline: 20,
                    borderRadius: 10,
                },

                sizeLarge: {
                    minHeight: 46,
                    fontSize: '0.95rem',
                    paddingBlock: 11,
                    paddingInline: 26,
                    borderRadius: 12,
                },
            },
        },
    };
}
