var bcrypt = require('bcryptjs');

// DEPENDENCIES ------------------------------------------------------------------------------------------------------
// Loads express module and assigns it to a var called express
var express = require("express");

var bodyParser = require('body-parser');

// OTHER VARS ---------------------------------------------------------------------------------------------------------
// Creates an instance of express called app
var app = express();

// GLOBAL SALT
app.set('salt', bcrypt.genSaltSync(8) )
// var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

app.use(bodyParser.json());

var db = require("./db")(app);

// Loads path to access helper functions for working with files and directory paths
var path = require("path");

var session = require("express-session");
var passport = require("passport");

var config = require("./config");

// CONSTANTS ---------------------------------------------------------------------------------------------------------
// Defines server port.
// Value of NODE_PORT is taken from the user environment if defined; port 3000 is used otherwise.
const NODE_PORT = process.env.NODE_PORT || 8080;

// Defines paths
// __dirname is a global that holds the directory name of the current module
const CLIENT_FOLDER = path.join(__dirname + '/../client');  // CLIENT FOLDER is the public directory
const MSG_FOLDER = path.join(CLIENT_FOLDER + '/assets/messages');

app.use(session({
    secret: "jamathon-secret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./auth')(app, passport);
var routes = require("./routes")(app, passport);


// MIDDLEWARES --------------------------------------------------------------------------------------------------------

// Serves files from public directory (in this case CLIENT_FOLDER).
// __dirname is the absolute path of the application directory.
// if you have not defined a handler for "/" before this line, server will look for index.html in CLIENT_FOLDER
app.use(express.static(CLIENT_FOLDER));

// ERROR HANDLING ----------------------------------------------------------------------------------------------------
// Handles 404. In Express, 404 responses are not the result of an error,
// so the error-handler middleware will not capture them.
// To handle a 404 response, add a middleware function at the very bottom of the stack
// (below all other path handlers)
app.use(function (req, res) {
    res.status(404).sendFile(path.join(MSG_FOLDER + "/404.html"));
});

// Error handler: server error
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(501).sendFile(path.join(MSG_FOLDER + '/501.html'));
});


// SERVER / PORT SETUP ------------------------------------------------------------------------------------------------
// Server starts and listens on NODE_PORT
app.listen(NODE_PORT, function () {
    console.log("Server running at http://localhost:" + NODE_PORT);
});