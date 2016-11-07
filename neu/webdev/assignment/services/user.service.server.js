module.exports = function (app) {

    var users = [
        {_id: "123", username: "alice", password: "alice", firstName: "Alice", lastName: "Wonder"},
        {_id: "234", username: "bob", password: "bob", firstName: "Bob", lastName: "Marley"},
        {_id: "345", username: "charly", password: "charly", firstName: "Charly", lastName: "Garcia"},
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose", lastName: "Annunzi"}
    ];

    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

    function createUser(req, res) {
        var user = req.body;
        users.push(user);
        res.send(user);
    }

    function deleteUser(req, res) {
        var uid = req.params.userId;
        for (var u in users) {
            if (users[u]._id == uid) {
                users.splice(u, 1);
                res.sendStatus(200);
            }
        }
        res.sendStatus(400);
    }

    function updateUser(req, res) {
        var user = req.body;
        var uid = req.params.userId;
        for (var u in users) {
            if (users[u]._id == uid) {
                users[u] = user;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(400);
    }

    function findUser(req, res) {
        var params = req.params;
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res){
        var username = req.query.username;

        userFound = 400;

        for (var u in users) {
            user = users[u];
            if (user.username === username) {
                userFound = user;
                break;
            }
        }
        res.send(userFound);
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        for (var u in users) {
            user = users[u];
            if (user.username === username && user.password === password) {
                res.send(user);
                return;
            }
        }
        res.send('0');
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userFound = '0';

        for (var u in users) {
            user = users[u];
            if (user._id === userId) {
                userFound = user;
                break;
            }
        }
        res.send(userFound);
    }
}