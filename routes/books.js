const express = require('express')
const router = express.Router()
const Joi = require('joi')
const authMiddleware = require('../middleware/auth')
const Books = require('../model/Books')

const books = [
    { name: 'Atomic habits', year: 2000, id: 1 },
    { name: 'Harry potter', year: 2008, id: 2 },
    { name: 'Rich dad and poor dad', year: 2010, id: 3 },
]

// View all books
router.get('/', async (req, res) => {
    const books = await Books.getAll()
    res.render('books', {
        title: 'Products',
        books,
        isBooks: true
    })
})

router.get('/add', (req, res) => {
    res.render('formBooks', {
        title: 'Add new product',
        isBooks: true
    })
})

// Get request with query
router.get('/sort', (req, res) => {
    const book = books.find((book) => req.query.name === book.name)
    if (book) {
        // Clientga chiqariladi
        res.status(200).send(book)
    } else {
        res.status(400).send('Bu ismli kitob mavjud emas...')
    }
})

// Get request with params
// router.get('/:id/:polka', (req, res) => {
//     const id = +req.params.id
//     const book = books.find((book) => book.id === id)
//     if (book) {
//         // Clientga chiqariladi
//         res.status(200).send(book)
//     } else {
//         res.status(400).send('Bu parametrli kitob mavjud emas...')
//     }

// })

router.get('/update/:id/add', (req,res) => {
    res.render('booksFormUpdate', {
        title: 'Update',
        usersid: req.params.id
    })
})

router.post('/update/:id/add', (req,res) => {
    const book = new Books(req.body.name, req.body.password, req.body.img)

    book.updateById(req.params.id)

    res.redirect('/product')
})

// POST request
router.post('/add', authMiddleware, async (req, res) => {
    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        price: Joi.number().integer().min(1900).max(200001).required(),
        img: Joi.string()
    })
    const result = bookSchema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
    const book = new Books(
        req.body.name,
        req.body.year,
        req.body.img
    )
    await book.save()
    res.status(201).redirect('/product')


    // Obyektni yaratamiz yangi kitobni
    // let book = {
    //     id: books.length + 1,
    //     name: req.body.name,
    //     year: req.body.year,
    //     img: req.body.img
    // }

    // bazaga qo'shamiz
    // allBooks.push(book)

    // kitoblarni klientga qaytaramiz
    res.status(201).send(allBooks)
    res.status(201).send(book)
    res.status(201).redirect('/product')
})

// PUT request
router.put('/update/:id', authMiddleware, (req, res) => {
    let allBooks = books
    const idx = allBooks.findIndex(book => book.id === +req.params.id)
    // Validatsiya // hiyalaymiz
    let bookSchema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        year: Joi.number().integer().min(1900).max(2022).required(),
    })

    validateBody(req.body, bookSchema, res)

    let updatedBook = {
        name: req.body.name,
        year: req.body.year,
        id: +req.params.id,
    }

    allBooks[idx] = updatedBook

    res.status(200).send(updatedBook)
})

// Delete request
router.get('/delete/:id', async (req, res) => {
    console.log('ish');
    await Books.removeById(req.params.id)
    res.status(200).redirect('/product')
})

function validateBody(body, bookSchema, res) {
    const result = bookSchema.validate(body)
    if (result.error) {
        res.status(400).send(result.error.message);
        return
    }
}

module.exports = router