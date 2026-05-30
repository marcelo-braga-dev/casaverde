import { Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {IconEye, IconFileText} from "@tabler/icons-react";

const ProducerUsinaList = ({ profile, usinaLinks = [] }) => {
    const sortedLinks = [...usinaLinks].sort((a, b) => {
        return new Date(b.started_at ?? b.created_at ?? 0) - new Date(a.started_at ?? a.created_at ?? 0);
    });

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Usinas" avatar={<IconFileText />}
                        action={<Button
                            component={Link}
                            variant="outlined"
                            href={route('consultor.producer.usinas.create', {producer_profile_id: profile.id})}
                            size="small"
                        >
                            Cadastrar Usina
                        </Button>}/>

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome da Usina</TableCell>
                                <TableCell align="center">Qtd. Clientes</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedLinks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>Nenhuma usina vinculada.</TableCell>
                                </TableRow>
                            )}

                            {sortedLinks.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{`${item?.usina_nome}`}</TableCell>
                                    <TableCell align="center">{item?.active_client_links.length}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={item?.status}
                                            color={item?.is_active ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link href={route("consultor.producer.usinas.show", item.id)}>
                                            <Button
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                startIcon={<IconEye />}
                                            >
                                                Ver
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default ProducerUsinaList;
