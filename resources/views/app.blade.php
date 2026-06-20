<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $brandSettings = app(\App\Services\Config\SystemSettingService::class);
            $brandName = $brandSettings->get('brand_name', config('app.name', 'Laravel'));
            $brandFaviconPath = $brandSettings->get('brand_favicon_path');
            $brandFaviconUrl = $brandFaviconPath && \Illuminate\Support\Facades\Storage::disk('public')->exists($brandFaviconPath)
                ? \Illuminate\Support\Facades\Storage::disk('public')->url($brandFaviconPath)
                : '/storage/app/favicon.ico';
        @endphp

        <title inertia>{{ $brandName }}</title>
        <!--suppress HtmlUnknownTarget -->
        <link rel="icon" href="{{ $brandFaviconUrl }}" type="image/x-icon">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
