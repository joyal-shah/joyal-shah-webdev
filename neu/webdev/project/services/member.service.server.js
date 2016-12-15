

module.exports = function(app, models) {

    var memberModel = models.memberModel;

    var passportProj = require('passport');
    var LocalStrat = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth20').Strategy;
    var bcryptProj = require("bcrypt-nodejs");

    var cookieParser = require('cookie-parser');
    var session = require('express-session');

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    }));
    app.use(cookieParser());
    app.use(passportProj.initialize());
    app.use(passportProj.session());

    app.get('/auth/google', passportProj.authenticate('google', { scope: ['profile'] }));
    app.get('/auth/google/callback', passportProj.authenticate('google', {
        failureRedirect: '/project/#/',
        successRedirect: '/project/#/user'}
    ));
    app.get("/project/api/user", getUsers);
    app.post("/project/api/user", createUser);
    app.post("/project/api/logout", logout);
    app.get("/project/api/loggedIn", loggedIn);
    app.post("/project/api/register", register);
    app.post("/project/api/login", passportProj.authenticate('local'), login);
    app.get("/project/api/user?username=username", findUserByUsername);
    app.get("/project/api/user?username=username&password=password", findUserByCredentials);
    app.get("/project/api/user/:userId", findUserById);
    app.put("/project/api/user/:userId",  updateUser);
    app.delete("/project/api/user/:userId", deleteUser);
    app.get("/project/api/user/:userId/comments", findAllCommentsForEvent);
    app.get("/project/api/user/:userId/comment/:commentId", addCommentToUser);
    app.delete("/project/api/user/:userId/comment/:commentId", removeCommentFromUser);
    app.get("/project/api/users", getUsers);

    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    };

    passportProj.use(new LocalStrat(localStrategy));
    passportProj.use('google', new GoogleStrategy(googleConfig, googleLogin));
    passportProj.serializeUser(serializeProjectUser);
    passportProj.deserializeUser(deserializeProjectUser);


    function localStrategy(username, password, done) {
        memberModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcryptProj.compareSync(password,user.password)) {
                        done(null, user);
                    } else {
                        // in case of error intercept from passport will abort and return with failure
                        done(null, false);
                    }
                },
                function(err) {
                    done(err);
                }
            );
    }

    function serializeProjectUser(user, done) {
        done(null, user);
    }

    function deserializeProjectUser(user, done) {
        memberModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function getUsers(req, res){
        var username = req.query.username;
        var password = req.query.password;

        if(username && password) {
            findUserByCredentials(username, password, req, res);
        }
        else if(username) {
            findUserByUsername(username, res);
        }
        else {
            memberModel
                .getUsers()
                .then(
                    function(users) {
                        res.json(users);
                    },
                    function(err){
                        res.statusCode(400).send(err);
                    }
                );
        }
    }

    function register(req, res) {

        var username = req.body.username;
        var password = req.body.password;

        memberModel
            .findUserByUsername(username)
            .then(
                function(user){
                    if(user){
                        res.status(400).send("Username in use");
                        return;
                    }
                    else {
                        req.body.password = bcryptProj.hashSync(req.body.password);
                        return memberModel
                            .createUser(req.body);
                    }
                },
                function(err) {
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user) {
                        // passport logs in the user and sets a new session for them
                        req.login(user, function(err){
                            if(err){
                                res.status(400).send(err);
                            }
                            else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function createUser(req, res) {
        var user = req.body;
        memberModel
            .createUser(user)
            .then(
                function(user) {
                    res.json(user);
                },
                function(err){
                    res.statusCode(400).send(err);
                }
            );
    }

    function findUserByUsername (username, res) {

        memberModel
            .findUserByUsername(username)
            .then(
                function(user){
                    res.json(user);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function loggedIn(req, res) {
        if(req.isAuthenticated()){
            res.json(req.user);
        }
        else {
            res.send('0');
        }
    }

    function login(req, res) {
        // passport authenticates user by the time it reaches this code.
        // passport also stores the user in the request. So all that's left to do is return it.
        var user = req.user;
        res.json(user);
    }

    function findUserByCredentials(username, password, req, res) {

        memberModel
            .findUserByCredentials(username, password)
            .then(
                function(user){

                    //console.log(req.session);
                    req.session.currentUser = user;
                    res.json(user);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }

    function findUserById (req, res) {
        var id = req.params.userId;
        memberModel
            .findUserById(id)
            .then(
                function(user){
                    res.json(user);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        memberModel
            .updateUser(id,newUser)
            .then(
                function(stats){
                    res.sendStatus(200);
                },
                function(err){
                    res.statusCode(404).send(err);
                }
            );
    }

    function deleteUser (req, res) {

        var id = req.params.userId;

        memberModel
            .deleteUser(id)
            .then(
                function (stats) {
                    res.sendStatus(200);
                },
                function (err) {
                    res.statusCode(404).send(err);
                }

            );
    }

    function googleLogin(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        memberModel
            .findGoogleUser(profile.id)
            .then(
                function(GoogleUser) {
                    if(GoogleUser) {
                        return cb(null, GoogleUser);
                    } else {
                        GoogleUser = {
                            username: profile.displayName.replace(/ /g,''),
                            google: {
                                token: accessToken,
                                id: profile.id,
                                displayName: profile.displayName
                            }
                        };
                        memberModel
                            .createUser(GoogleUser)
                            .then(
                                function(user) {
                                    cb(null, user);
                                },
                                function(err){
                                    cb(null, err);
                                }
                            );
                    }
                },
                function(err){
                    cb(null, err);
                }
            );
    }

    function findAllCommentsForEvent(req, res){
        var userId = req.params.userId;
        memberModel
            .findAllCommentsForEvent(userId)
            .then(function(comments){
                    res.json(comments);
                },
                function(err){
                    cb(null, err);
                });
    }

    function addCommentToUser(req, res){
        var userId = req.params.userId;
        var commentId = req.params.commentId;
        memberModel
            .addCommentToUser(userId, commentId)
            .then(function(user){
                res.send(200);
            });
    }

    function removeCommentFromUser(req, res){
        var userId = req.params.userId;
        var commentId = req.params.commentId;
        memberModel
            .removeCommentFromUser(userId, commentId)
            .then(function(user){
                    res.send(200);
                },
                function (err) {
                    res.statusCode(404).send(err);
                }
            );
    }

    function getUsers(req, res){

        memberModel
            .getUsers()
            .then(function(users){
                    res.json(users);
                },
                function (err) {
                    res.statusCode(404).send(err);
                }
            );
    }
};