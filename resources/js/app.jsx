import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import ThemeCustomization from './Layouts/UserLayout/Theme/index.jsx';
import { DrawerProvider } from '@/Contexts/Drawer/DrawerContext.jsx';
import InertiaProgressOverlay from '@/Components/Feedback/InertiaProgressOverlay';

const appName = import.meta.env.VITE_APP_NAME || 'Casa Verde';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeCustomization>
                <DrawerProvider>
                    <InertiaProgressOverlay />
                    <App {...props} />
                </DrawerProvider>
            </ThemeCustomization>,
        );
    },

    progress: {
        color: '#0B7A53',
        showSpinner: false,
    },
});
