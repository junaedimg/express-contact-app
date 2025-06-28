import express from 'express';
import currentModulePaths from 'current-module-paths';
import expressEjsLayouts from 'express-ejs-layouts';
import { body, validationResult } from 'express-validator';
import { loadContact, findContact, addContact } from './utils/contacts.js';

// setInterval(() => {
//     console.clear();
//     console.log(' === Console dibersihkan otomatis === ');
// }, 20000);

const app = express();
const port = 3000;

const { __filename, __dirname } = currentModulePaths(import.meta.url);

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(express.static('assets'));
app.use(express.urlencoded());

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
    const contacts = loadContact();
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman contact',
        contacts,
    });
});

app.post('/contact', (req, res) => {
    addContact(req.body);
    res.redirect('/contact');
});

app.get('/addcontact', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Tambah Contact',
    });
});

app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    // console.log(contact);
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail',
        contact,
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
