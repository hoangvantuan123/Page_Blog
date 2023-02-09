const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Article = require('../models/article');



router.get('/', async(req, res, next) => {

    const articles = await Article
        .find()
        .sort({createdAt: 'desc'})
    res.render('index', {articles: articles})
});



router.get('/register', (req, res, next) => {
    return res.render('acc/index');
});

router.post('/register', (req, res, next) => {
    let personInfo = req.body;

    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
        res.send();
    } else {
        if (personInfo.password == personInfo.passwordConf) {

            User.findOne({
                email: personInfo.email
            }, (err, data) => {
                if (!data) {
                    let c;
                    User.findOne({}, (err, data) => {

                        if (data) {
                            c = data.unique_id + 1;
                        } else {
                            c = 1;
                        }

                        let newPerson = new User({unique_id: c, email: personInfo.email, username: personInfo.username, password: personInfo.password, passwordConf: personInfo.passwordConf});

                        newPerson.save((err, Person) => {
                            if (err) 
                                console.log(err);
                            else 
                                console.log('Success');
                            }
                        );

                    })
                        .sort({_id: -1})
                        .limit(1);
                    res.send({"Success": "Bạn đã được đăng ký lại, Bạn có thể đăng nhập ngay bây giờ."});
                } else {
                    res.send({"Success": "Email đã được sử dụng."});
                }

            });
        } else {
            res.send({"Success": "Mật khẩu không khớp"});
        }
    }
});

router.get('/login', (req, res, next) => {
    return res.render('acc/login');
});

router.post('/login', (req, res, next) => {
    User.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {

            if (data.password == req.body.password) {
                req.session.userId = data.unique_id;
                res.send({"Success": "Success!"});
            } else {
                res.send({"Success": "Sai mật khẩu!"});
            }
        } else {
            res.send({"Success": "Email này chưa được đăng ký!"});
        }
    });
});

router.get('/posts', async(req, res, next) => {

    const articles = await Article
        .find()
        .sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles})
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        // delete session object
        req
            .session
            .destroy((err) => {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
    }
});

router.get('/forgetpass', (req, res, next) => {
    res.render("acc/forget");
});

router.post('/forgetpass', (req, res, next) => {
    User.findOne({
        email: req.body.email
    }, (err, data) => {
        if (!data) {
            res.send({"Success": "Email này chưa được đăng ký!"});
        } else {
            if (req.body.password == req.body.passwordConf) {
                data.password = req.body.password;
                data.passwordConf = req.body.passwordConf;

                data.save((err, Person) => {
                    if (err) 
                        console.log(err);
                    else 
                        console.log('Success');
                    res.send({"Success": "Mật khẩu đã được thay đổi!"});
                });
            } else {
                res.send({"Success": "Mật khẩu không khớp! Cả hai mật khẩu phải giống nhau."});
            }
        }
    });

});

module.exports = router;