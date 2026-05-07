import Button from './Button';
import Card from './Card';
import Chip from './Chip';
import TextField from './TextField';
import Table from './Table';
import Drawer from './Drawer';
import Paper from './Paper';

export default function componentsOverride(theme) {
    return Object.assign(
        Button(theme),
        Card(theme),
        Chip(theme),
        TextField(theme),
        Table(theme),
        Drawer(theme),
        Paper(theme),
    );
}
