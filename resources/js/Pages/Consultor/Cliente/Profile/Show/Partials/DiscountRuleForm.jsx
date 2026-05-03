import { useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconDiscount2 } from "@tabler/icons-react";

const DiscountRuleForm = ({ profile }) => {
    const form = useForm({
        discount_percent: "",
        starts_on: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();

        form.post(route("consultor.user.cliente.discount-rule.store", profile.id), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset("discount_percent", "starts_on", "notes");
            },
        });
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Cadastrar Regra de Desconto" avatar={<IconDiscount2 />} />

            <CardContent>
                <form onSubmit={submit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Desconto (%)"
                                value={form.data.discount_percent}
                                onChange={(e) => form.setData("discount_percent", e.target.value)}
                                error={!!form.errors.discount_percent}
                                helperText={form.errors.discount_percent}
                                type="number"
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Início"
                                value={form.data.starts_on}
                                onChange={(e) => form.setData("starts_on", e.target.value)}
                                error={!!form.errors.starts_on}
                                helperText={form.errors.starts_on}
                                type="datetime-local"
                                slotProps={{ inputLabel: { shrink: true } }}
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Observações"
                                value={form.data.notes}
                                onChange={(e) => form.setData("notes", e.target.value)}
                                error={!!form.errors.notes}
                                helperText={form.errors.notes}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={12}>
                            <Button type="submit" color="success" disabled={form.processing}>
                                Registrar Desconto
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default DiscountRuleForm;
