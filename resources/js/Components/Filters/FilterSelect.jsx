import SearchableSelect from '@/Components/Form/SearchableSelect.jsx';

export default function FilterSelect({
                                         label,
                                         value,
                                         onChange,
                                         options = [],
                                         name,
                                     }) {
    return (
        <SearchableSelect
            name={name}
            label={label}
            value={value ?? ''}
            onChange={onChange}
            options={[{ value: '', label: 'Todos' }, ...options]}
            size="small"
            sx={{
                minWidth: {
                    xs: '100%',
                    md: 190,
                },
            }}
        />
    );
}
