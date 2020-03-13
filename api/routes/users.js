const express = require('express');
const router = express.Router();

//Returns all users
router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: 'GET request'
    })
});

//insert a user
router.post('/', (req, res, next) =>{
    res.status(200).json({
        message: 'POST request'
    })
});

//Returns a specific user 
router.get('/:id', (req, res, next) =>{
    const userID = req.params.id;

    res.status(200).json({
        message: 'GET ' + userID
    })
});

module.exports = router;