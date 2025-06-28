import fs from 'fs';

// ! Mengecek dan membuat jika tidak ada folder data maka buatkan, mencegar error karena direktori tidak ada.
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// ! mengecek dan membuat jika tidak ada file data, mencegah error karena file  tidak ada.
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

export const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);

    return contacts;
};

export const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((elm) => {
        return elm.nama.toLowerCase() === nama.toLowerCase();
    });

    return contact;
};

// Menyimpan perubahan data contacts dengan minimpa data json.
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// Menambah Contact
export const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
};
