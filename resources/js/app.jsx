import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import ThemeCustomization from './Layouts/UserLayout/Theme/index.jsx';
import { DrawerProvider } from '@/Contexts/Drawer/DrawerContext.jsx';
import InertiaProgressOverlay from '@/Components/Feedback/InertiaProgressOverlay';
import DemoBar from '@/Components/Demo/DemoBar';
import { installDemoGuard } from '@/Demo/demoGuard';

const defaultAppName = import.meta.env.VITE_APP_NAME || 'Casa Verde';

createInertiaApp({
    title: (title) => {
        const appName = window.__brandName || defaultAppName;
        return title ? `${title} - ${appName}` : appName;
    },

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);
        const brand = props.initialPage?.props?.brand ?? {};
        const demo = props.initialPage?.props?.demo;
        window.__brandName = brand.name || defaultAppName;

        // Modo demonstração (DEMO_MODE): somente leitura e barra de troca de perfil.
        if (demo?.enabled) {
            installDemoGuard(demo);
        }

        root.render(
            <ThemeCustomization brand={brand}>
                <DrawerProvider>
                    <InertiaProgressOverlay />
                    <App {...props}>
                        {({ Component, props: pageProps, key }) => (
                            <>
                                <Component key={key} {...pageProps} />
                                {demo?.enabled && <DemoBar />}
                            </>
                        )}
                    </App>
                </DrawerProvider>
            </ThemeCustomization>,
        );
    },

    progress: {
        color: 'var(--cv-primary)',
        showSpinner: false,
    },
});
