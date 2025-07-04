import express from 'express';
import currentModulePaths from 'current-module-paths';
import expressEjsLayouts from 'express-ejs-layouts';
import { body, validationResult } from 'express-validator';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import {
    cekDuplikasi,
    loadContact,
    findContact,
    addContact,
    deleteContact,
    updateContacts,
} from './utils/contacts.js';

console.log('============= script di eksekusi =============');

const app = express();
const port = 3000;

const { __filename, __dirname } = currentModulePaths(import.meta.url);

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
app.use(express.static('assets'));
app.use(express.urlencoded());
app.use(cookieParser('rahasia')); // Optional secret kalau mau signed cookie
app.use(
    session({
        secret: 'rahasia',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 10000, // 15 menit dalam milidetik
        },
    }),
);
app.use(flash());

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
    console.log(req.params);
    const contacts = loadContact();
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman contact',
        contacts,
        msg: req.flash('msg'),
    });
});

app.post(
    '/contact',
    [
        body('nama').custom((val) => {
            const duplikat = cekDuplikasi(val);
            if (duplikat) {
                throw new Error('nama sudah di gunakan');
            }
            return true;
        }),
        body('email').isEmail().withMessage('format email tidak valid'),
        body('noHP').isMobilePhone('id-ID').withMessage('Nomor HP tidak valid'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ err: errors.array() });
            // console.log('==================');
            // console.log(errors);
            res.render('add-contact', {
                title: 'Halaman Tambah Contact',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                data: req.body || {},
            });
        } else {
            req.flash('msg', 'Data kontak berhasil ditambahkan !');
            addContact(req.body);
            res.redirect('/contact');
        }
    },
);

app.post(
    '/contact/update',
    [
        body('nama').custom((val, { req }) => {
            const duplikat = cekDuplikasi(val);
            if (val != req.body.oldNama && duplikat) {
                throw new Error('nama sudah di gunakan');
            }
            return true;
        }),
        body('email').isEmail().withMessage('format email tidak valid'),
        body('noHP').isMobilePhone('id-ID').withMessage('Nomor HP tidak valid'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                title: 'Halaman Edit Contact',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                contact: req.body
            });
        } else {
            updateContacts(req.body);
            req.flash('msg', 'Data kontak berhasil diubah !');
            res.redirect('/contact');
        }
    },
);

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Halaman Tambah Contact',
        layout: 'layouts/main-layout',
        data: {},
    });
});

app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('edit-contact', {
        title: 'Halaman Edit Contact',
        layout: 'layouts/main-layout',
        contact,
    });
});

app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    if (!contact) {
        res.status(404);
        res.send('<h1>Status = 404</h1>');
    } else {
        deleteContact(req.params.nama);
        req.flash('msg', 'Data kontak berhasil dihapus !');
        res.redirect('/contact');
    }
});

app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    // console.log(contact);
    res.render('detail', {
        title: 'Halaman Detail',
        layout: 'layouts/main-layout',
        contact,
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
