const express = require('express');
const router = express.Router();

router.get('/:name', function (req, res) {
    res.render('users.ejs', {
        name: req.params.name,
        content: '<h1>H1 Content<h1>'
    });
});

module.exports = router;