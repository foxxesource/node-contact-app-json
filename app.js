const express = require('express');
const app = express();
const port = 3000;
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check} = require('express-validator')
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts')

// gunakan ejs
app.set('view engine', 'ejs');
// third-pary middleware
app.use(expressLayouts);

// built-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash());


app.get('/', (req, res) => {
    res.render('index', {  title: 'Home', layout: 'layouts/main-layout' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'about', layout: 'layouts/main-layout' });
});

app.get('/contact', (req, res) => {
    const contacts = loadContact();
    // console.log(contacts)
    res.render('contact', { title: 'contact', layout: 'layouts/main-layout', contacts, msg: req.flash('msg') });
});

// halaman form tambah data contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {title: 'form tambah data contact', layout:'layouts/main-layout'})
})

// proses tambah data contact
app.post('/contact', [
    body('name').custom((value) => {
        const duplikat = cekDuplikat(value);
        if(duplikat) {
            throw new Error('Name already exists!')
        }
        return true;
    }),
    check('email', 'Email is not valid!').isEmail(),
    check('phone_number', 'Phone Number is not valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
    //   return res.status(400).json({ errors: errors.array( )});  
    res.render('add-contact', {title: 'Form Tambah Data Contact', layout: 'layouts/main-layout', errors : errors.array()})
    } else {
        addContact(req.body);
        // kirimkan flash message
        req.flash('msg', 'New Contact Added!')
        res.redirect('/contact');
    }
})

// proses delete contact
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    // jika contact tidak ada
    if(!contact){
        res.status(404);
        res.send('<h1>404<h1>'); 
    } else {
        req.flash('msg', 'Contact deleted!')
        deleteContact(req.params.nama);
        res.redirect('/contact');
    }
})

// form ubah data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('edit-contact', {title: 'form ubah data contact', layout:'layouts/main-layout', contact})
})

// proses ubah data
app.post('/contact/update', [
    body('name').custom((value, {req}) => {
        const duplikat = cekDuplikat(value);
        if(value !== req.body.oldName && duplikat) {
            throw new Error('Name already exists!')
        }
        return true;
    }),
    check('email', 'Email is not valid!').isEmail(),
    check('phone_number', 'Phone Number is not valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
    //   return res.status(400).json({ errors: errors.array( )});  
    res.render('edit-contact', {title: 'Form Ubah Data Contact', layout: 'layouts/main-layout', errors : errors.array(), contact: req.body})
    } else {
        updateContacts(req.body);
        // kirimkan flash message
        req.flash('msg', 'Contact Updated!')
        res.redirect('/contact');
    }
})

// halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    // console.log(contacts)
    res.render('detail', { title: 'detail contact', layout: 'layouts/main-layout', contact });
});

app.use((req, res) => {
    res.status(404);
    res.send('<h1>ERROR 404</h1>');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});