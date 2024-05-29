// Core Module
// File System
const fs = require('fs');

// Membuat folder data
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

// Membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// Ambil semua data di contact.json
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(file);
    return contacts;
};

// Cari contact berdasarkan nama
const findContact = (name) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase())
    return contact;
}

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

// menambahkan data contact baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

// cek nama yang duplikat
const cekDuplikat = (name) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.name === name);
}

// hapus contact
const deleteContact = (name) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter((contact) => contact.name !== name)
    saveContacts(filteredContacts);
}

// update contacts
const updateContacts = (contactBaru) => {
    const contacts = loadContact();
    // hilangkan contact lama yang namanya sama dengan oldName
    const filteredContacts = contacts.filter((contact) => contact.name !== contactBaru.oldName)
    delete contactBaru.oldName;
    filteredContacts.push(contactBaru);
    saveContacts(filteredContacts)
}


module.exports = {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts}