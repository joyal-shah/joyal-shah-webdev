module.exports = function (app, model) {

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
    };
    passport.use('facebook', new FacebookStrategy(facebookConfig, facebookStrategy));

    /*
     var users = [
     {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
     {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
     {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
     {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
     ];*/

    app.post("/api/register", register);
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', loggedInAndSelf, updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.post('/api/login', passport.authenticate('local'), login);
    app.post("/api/checkLogin", checkLogin);
    app.post("/api/logout", logout);
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/assignment/#/user',
        failureRedirect: '/assignment/#/login'
    }));

    app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook',
        {successRedirect: '/assignment/#/user', failureRedirect: '/assignment/#/login'}));

    function loggedInAndSelf(req, res, next) {
        var loggedIn = req.isAuthenticated();
        var userId = req.params.userId;

        var self = userId == req.user._id;

        if (self && loggedIn) {
            next();
        } else {
            res.sendStatus(400).send("You are not the same person");
        }
    }

    function googleStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username: emailParts[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: email,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newGoogleUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done){
        model
            .userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            username:  names[0],
                            lastName:  names[1],
                            firstName: names[0],
                            email:     profile.emails ? profile.emails[0].value:"",
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return model.userModel.createUser(newFacebookUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            )
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function checkLogin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                });
    }

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (users) {
                    if (users.length > 0) {
                        var user = users[0];
                        if(user && bcrypt.compareSync(password,user.password))
                        {
                            return done(null, user);
                        }
                        else{
                            return done(null, false);
                        }
                    }
                    else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err, null);
                    }
                }
            );
    }

    function login(req, res) {
        res.json(req.user);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    if (newUser) {
                        req.login(newUser, function (err) {
                            if (err) {
                                res.sendStatus(400).send(error);
                            } else {
                                res.json(newUser);
                            }
                        });
                    }
                }, function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function createUser(req, res) {
        var user = req.body;
        model
            .userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.send(newUser);
                }, function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function deleteUser(req, res) {
        var uid = req.params.userId;

        model
            .userModel
            .deleteUser(uid)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function updateUser(req, res) {
        var user = req.body;
        var uid = req.params.userId;

        model
            .userModel
            .updateUser(uid, user)
            .then(
                function (status) {
                    res.sendStatus(200);
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        } else {
            res.json(req.user);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (users) {
                    if (users.length > 0) {
                        res.json(users[0]);
                    }
                    else {
                        //res.sendStatus(400).send("Cannot find any user by username: " + username);
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err.message);
                });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        model
            .userModel
            .findUserByCredentials(username, password)
            .then(
                function (users) {
                    if (users.length > 0) {
                        res.json(users[0]);
                    }
                    else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;

        userFound = '0';

        model
            .userModel
            .findUserById(userId)
            .then(
                function (user) {
                    if (user) {
                        res.send(user);
                    }
                    else {
                        res.send('0');
                    }
                },
                function (error) {
                    res.sendStatus(400).send(error);
                });
    }
};