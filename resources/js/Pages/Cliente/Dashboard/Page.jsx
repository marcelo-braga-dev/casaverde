import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head } from "@inertiajs/react";

export default function Page() {

    return (
        <Layout titlePage="Dashboard" menu="clientes">
            <Head title="Dashboard" />
        </Layout>
    );
}
