var express = require('express');
var router = express.Router();
var users = require('./users');
const User = require('../models/User')
function routes(app, db) {
    router.get('/', function (req, res, next) {
                 res.render('index', {title:'Express'})

    });
    router.get('/user', function (req, res, next) {
        const user = new User({
            name: 'hyc195',
            pass: '7200'
        });
        user.save(function (err) {
            console.log(err)
            if (err) {
                next(err)
            } else {
                res.render('/index', JSON.stringify(user))
            }
        })

    });

    app.use('/', router)
    app.use('/users', users)
}


module.exports = routes;
