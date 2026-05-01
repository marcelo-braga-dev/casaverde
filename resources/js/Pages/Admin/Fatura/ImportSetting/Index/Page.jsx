import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {router} from "@inertiajs/react";

const Page = () => {
    const submit = (e) => {
        e.preventDefault()
        router.post(route('admin.user.admin.store'), {...data})
    }

    return (
        <Layout titlePage="Cadastro de Administrador" menu="admin" subMenu="admin-cadastrar" backPage>
            <form onSubmit={submit}>
            </form>
        </Layout>
    )
}
export default Page
