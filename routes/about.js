const express = require('express')
const router = express.Router() 

// GET method // Read
router.get('/', (req, res, next) => {
    res.render('about',
        {
            title: 'About us',
            isAbout: true
        })
})

module.exports = router
