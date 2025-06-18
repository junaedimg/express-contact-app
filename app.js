import express from 'express';
import currentModulePaths from 'current-module-paths';
import expressEjsLayouts from 'express-ejs-layouts';
import { loadContact } from './utils/contacts.js';

const app = express();
const port = 3000;

const { __filename, __dirname } = currentModulePaths(import.meta.url);

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(express.static('assets'));

app.get('/', (req, res) => {
    let dataMahasiswa = [];
    res.render('index', {
        dataMahasiswa,
        layout: 'layouts/main-layout',
        title: 'Halaman index',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'Halaman about',
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman contact',
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
