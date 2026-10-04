import { useEffect, useMemo } from 'react';
import { CssBaseline, GlobalStyles, StyledEngineProvider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';
import { SIDEBAR_VARIABLES, sidebarThemeVars } from '@/Utils/Theme/sidebarTheme';
import { BRAND_VARIABLES, brandThemeVars } from '@/Utils/Theme/brandTheme';

export default function ThemeCustomization({ children, brand = {} }) {
    const mode = 'light';

    const paletteTheme = useMemo(
        () => Palette(mode, { primary: brand.color_primary, secondary: brand.color_secondary }),
        [mode, brand.color_primary, brand.color_secondary],
    );

    // Telas e menu lateral leem as cores de marca de variáveis CSS; sem nada configurado
    // em Identidade Visual vale o padrão verde do casa-verde-theme.css.
    useEffect(() => {
        const root = document.documentElement.style;
        const vars = {
            ...brandThemeVars(brand.color_primary),
            ...sidebarThemeVars({
                background: brand.color_sidebar,
                text: brand.color_sidebar_text,
                accent: brand.color_sidebar_accent,
                secondary: brand.color_secondary,
            }),
        };

        [...BRAND_VARIABLES, ...SIDEBAR_VARIABLES].forEach((name) => {
            if (vars[name]) {
                root.setProperty(name, vars[name]);
            } else {
                root.removeProperty(name);
            }
        });
    }, [brand.color_primary, brand.color_secondary, brand.color_sidebar, brand.color_sidebar_text, brand.color_sidebar_accent]);

    const themeTypography = useMemo(
        () =>
            Typography(
                'Inter, Roboto, "Segoe UI", Arial, sans-serif',
            ),
        [],
    );

    const themeCustomShadows = useMemo(
        () => CustomShadows(paletteTheme),
        [paletteTheme],
    );

    const themeOptions = useMemo(
        () => ({
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 768,
                    md: 1024,
                    lg: 1266,
                    xl: 1536,
                },
            },
            direction: 'ltr',
            shape: {
                borderRadius: 14,
            },
            mixins: {
                toolbar: {
                    minHeight: 64,
                    paddingTop: 8,
                    paddingBottom: 8,
                },
            },
            palette: paletteTheme.palette,
            customShadows: themeCustomShadows,
            typography: themeTypography,
        }),
        [paletteTheme.palette, themeCustomShadows, themeTypography],
    );

    const theme = useMemo(() => {
        const createdTheme = createTheme(themeOptions);
        createdTheme.components = componentsOverride(createdTheme);
        return createdTheme;
    }, [themeOptions]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <GlobalStyles
                    styles={{
                        '*': {
                            boxSizing: 'border-box',
                        },
                        html: {
                            width: '100%',
                            minHeight: '100%',
                            scrollBehavior: 'smooth',
                        },
                        body: {
                            width: '100%',
                            minHeight: '100%',
                            margin: 0,
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                        },
                        '#app': {
                            minHeight: '100vh',
                        },
                        a: {
                            color: 'inherit',
                            textDecoration: 'none',
                        },
                        '::-webkit-scrollbar': {
                            width: 8,
                            height: 8,
                        },
                        '::-webkit-scrollbar-track': {
                            background: 'transparent',
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: 'rgba(100, 116, 139, 0.35)',
                            borderRadius: 999,
                        },
                        '::-webkit-scrollbar-thumb:hover': {
                            background: 'rgba(100, 116, 139, 0.55)',
                        },
                    }}
                />

                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
