// Handles API routes

const HOME_PAGE = "/#!/loadout";
const SIGNIN_PAGE = "/#!/login";

// var Mailgun = require('mailgun-js');

// var api_key = 'api:key-1bcf117a1ecbe7246c753bb90ad2017b';
// var domain = 'sandboxb3d6a888fe4949eca744ae09d4ed02de.mailgun.org';
// var from_who = 'merrynus@hotmail.com';


var fs = require("fs"),
    path = require("path"),
    multer = require("multer"),
    storage = multer.diskStorage({
        // Storage configuration for multer - where to save and under what name
        // destination: './uploads_tmp/',
        destination: __dirname + './../client/uploads',
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    upload = multer({
        // Actual upload function using previously defined configuration
        storage: storage
    });

//S3 SET UP
//IMPORT S3 PACKAGES
var config = require("./config");
var AWS = require("aws-sdk");
var multerS3 = require("multer-s3");

//configure aws and multer-s3
AWS.config.region = "ap-southeast-1";
var s3Bucket = new AWS.S3(); //creating an s3

var uploadS3 = multer({
    storage: multerS3({
        s3: s3Bucket,
        bucket: 'jamathon',
        metadata: function (req, file, cb) {
            console.log("----");
            console.log(file);
            console.log("----");
            cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
            cb(null, Date.now()
                + '-'
                + file.originalname);
        }
    })
})

module.exports = function (app, passport) {

    // POST request handler for /upload route 
    app.post("/upload", upload.single("aud-file"), function (req, res) {
        // Use fs to read the uploaded file to verfiy success
        fs.readFile(req.file.path, function (err, data) {
            // Error handler for reading file
            if (err) {
                console.info("ERR >> " + err);
                res.status(501).json({
                    msg: "error saving"
                });
            }
            // Sends a HTTP 202 status code for Accepted to browser and a json containing the image file size to be displayed in the flash message
            res.status(202).json({
                size: req.file.size,
                path: req.file.path
            });
        });
    });

    app.post("/uploadS3",
        uploadS3.single("aud-file"),
        function (req, res) {
            app.locals.db.collection('projects')
            .insertOne({
                description: req.body.comment,
                project_id: req.file.location,
                user_id: req.user,
                projectName: req.body.projectName,
            })
            .then(function (result) {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            });
            console.log(req.body);
            console.log("Upload to S3...");
            console.log(req.file);
            //sneds a HTTP 202 status code
            res.status(202).json({
                path: req.file.location
            })
        })

    var Project = require('./api/projects.controller');

    var User = require('./api/users.controller');

    // Get the whole product list (based on filter criteria)
    app.get("/api/users/projects", Project.retrieveAll);

    // Get a single product
    app.get("/api/users/:user_id/projects/:project_id", Project.retrieveOne);

    // Insert a new product
    app.post("/api/users/:user_id/projects", Project.insertOne);

    // Update a single product
    // app.put("/api/products/:id", Product.updateOne);

    // Delete a single product
    app.delete("/api/users/user_id/:project_id", Project.deleteOne);

    app.get("/api/users", User.retrieveAll);

    // Get a single product
    app.get("/api/users/:user_id", User.retrieveOne);

    // Insert a new product
    app.post("/api/users", User.insertOne);

    // Delete a single product
    app.delete("/api/users/:user_id", User.deleteOne);

    // app.get("/oauth/google", passport.authenticate("google", {
    //     scope: ["email", "profile"]
    // }));

    // app.get("/oauth/google/callback", passport.authenticate("google", {
    //     successRedirect: HOME_PAGE,
    //     failureRedirect: SIGNIN_PAGE
    // }));

    app.get("/oauth/facebook", passport.authenticate("facebook", {
        scope: ["email", "public_profile"]
    }));

    app.get("/oauth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: HOME_PAGE,
        failureRedirect: SIGNIN_PAGE,
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local'), function (req, res) {
        res.status(200).json({ user: req.user });
    });

    app.get('/user/auth', function (req, res) {
        if (req.user) {
            res.status(200).json({ user: req.user });
        }
        else {
            res.sendStatus(401);
        }
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};