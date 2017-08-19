/**
 * Created by matt on 10/11/16.
 */
var LocalStrategy = require("passport-local").Strategy;
// var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var FacebookStrategy = require("passport-facebook").Strategy
// var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
// var WechatStrategy = require("passport-wechat").Strategy
// var TwitterStrategy  = require('passport-twitter').Strategy;
var bcrypt = require('bcryptjs');

// var User = require("./database").User;
// var AuthProvider = require("./database").AuthProvider;
var config = require("./config");

//Setup local strategy
module.exports = function (app, passport) {

    function authenticateUser(username, password, done) {

        const db = app.locals.db;
        try {
            db.collection('users', function (err, collection) {
                // Hanlde collection err
                if (err) {
                    //res.status(500).send(err);
                    return done(null, false);
                };
                // Prepare password
                // app.set('salt', "random_salt")
                var my_salt = '$2a$10$OYYjUvRSmxiEiQvr3vO07e'
                var hashPassword = bcrypt.hashSync(password, my_salt, null);
                console.log("hash_pwd", hashPassword)

                // bcrypt.compare(hashPassword, hash, function(err, res) {

                // });

                // Query Operator
                //"password": hashPassword
                var query = { "email": username , "password": hashPassword};
                console.log(query);
                // var options = {fields: {type: 1, title: 1, description: 1, pricing: 1}}
                var options = {};
                // Retrieve one product

                collection.findOne(query, options, function (err, result) {
                    console.log("Retrieve One: ");
                    console.log("Error if there any ?")
                    if (err){
                        console.log("Error if there any ?")
                        console.log(err)
                    }
                    console.log(result);
                    console.log(app.get('salt'))
                    if (result){

                        return done(null, username);
                    }

                    return done(null, false);
                });
            })
        } catch (err) {
            console.log("Runtime errors for retriev one: " + err);
            // res.status(500).send(err);
            return done(null, false);
        }


    }

    function verifyCallback(accessToken, refreshToken, profile, done) {
        console.log(profile);
        const db = app.locals.db;
        var Users = db.collection('users');
        var AuthProviders = db.collection('authproviders');

        //  User.findOrCreate({where: {email: email}, defaults: {username: email , email: email, password: null, name: displayName}})

        // Query Operator
        var username = profile.emails[0].value;
        var provider_type = profile.provider;
        var displayName = profile.displayName;

        // var options = {fields: {type: 1, title: 1, description: 1, pricing: 1}}
        // Retrieve one product
        console.log("Username: ", username)
        Users.findOne({ "username": username })
        .then(function(user) {
            console.log("Retrieve One:");
            //console.log(user);
            // if result found, findOne record in authProvider
            if (user) {
                //find record
                AuthProviders.findOne({ username: username, providerType: provider_type})
                .then(function(provider) {
                    if (provider) {
                        // all good
                        done(null, user);                        
                    }
                    else {
                        // Insert new record

                        // AuthProvider.findOrCreate({where: {userid: user.id, providerType: provider_type},
                        // defaults: {providerId: id, userId: user.id, providerType: provider_type, displayName: displayName}})
                        var doc = {providerId: profile.id, username: username, providerType: provider_type, displayName: profile.displayName};

                        AuthProviders.insertOne(doc)
                        .then(function(provider) {
                            console.log("Insert: ");
                            //console.log(provider);
                            done(null, user);
                        })
                        .catch(function(err) {
                            console.log("Error inserting: " + err);
                            done(null, false);
                        })
                    }
                })
                .catch(function(err) {
                    console.log("Error inserting: " + err);
                    done(null, false);
                })
            }
            else { // insert user
                var doc = {username: username, password: null, name: displayName};

                Users.insertOne(doc)
                .then(function(user) {
                    console.log("Insert: ");
                    //console.log(user);

                    //find record
                    AuthProviders.findOne({ username: username, providerType: provider_type})
                    .then(function(provider) {
                        if (provider) {
                            // all good
                            done(null, user);
                        }
                        else {
                            // Insert new record
                            // AuthProvider.findOrCreate({where: {userid: user.id, providerType: provider_type},
                            // defaults: {providerId: id, userId: user.id, providerType: provider_type, displayName: displayName}})
                            var doc = {providerId: profile.id, username: username, providerType: provider_type, displayName: profile.displayName};

                            AuthProviders.insertOne(doc)
                            .then(function(provider) {
                                console.log("Insert: ");
                                //console.log(provider);
                                done(null, user);
                            })
                            .catch(function(err) {
                                console.log("Error inserting: " + err);
                                done(null, false);
                            })
                        }
                    })
                    .catch(function(err) {
                        console.log("Error inserting: " + err);
                        done(null, false);
                    })
                })
                .catch(function(err) {
                    console.log("Error inserting: " + err);
                    done(null, false);
                })
            }
        })            
        .catch(function (err) {
            console.log("Error retrieving: " + err);
            done(null, false);
        });

        // if(profile.provider === 'google' || profile.provider === 'facebook'|| profile.provider === 'linkedin'){
        //     id = profile.id;
        //     email = profile.emails[0].value;
        //     displayName = profile.displayName;
        //     provider_type = profile.provider;
        //     User.findOrCreate({where: {email: email}, defaults: {username: email , email: email, password: null, name: displayName}})
        //         .spread(function(user, created) {
        //             console.log(user.get({
        //                 plain: true
        //             }));
        //             console.log(created);
        //             AuthProvider.findOrCreate({where: {userid: user.id, providerType: provider_type},
        //                 defaults: {providerId: id, userId: user.id, providerType: provider_type, displayName: displayName}})
        //                 .spread(function(provider, created) {
        //                     console.log(provider.get({
        //                         plain: true
        //                     }));
        //                     console.log(created);
        //                 });
        //             done(null, user);
        //         });
        // }else if(profile.provider === 'twitter'){
    //         id = profile.id;
    //     twitterUsername = profile.username;
    //     displayName = profile.displayName;
    //     provider_type = profile.provider;
    //     User.findOrCreate({ where: { email: twitterUsername }, defaults: { username: twitterUsername, email: twitterUsername, password: null, name: displayName } })
    //         .spread(function (user, created) {
    //             console.log(user.get({
    //                 plain: true
    //             }));
    //             console.log(created);
    //             AuthProvider.findOrCreate({
    //                 where: { userid: user.id, providerType: provider_type },
    //                 defaults: { providerId: id, userId: user.id, providerType: provider_type, displayName: displayName }
    //             })
    //                 .spread(function (provider, created) {
    //                     console.log(provider.get({
    //                         plain: true
    //                     }));
    //                     console.log(created);
    //                 });
    //             done(null, user);
    //         });
    // } else{
    //     done(null, false);
    // }
}


function localAuthenticate(username, password, done) {
    console.log("In authenticate function(): username=%s, password=%s", username, password);

    authenticateUser(username, password, done);
    // console.log("valid = "+valid);
    // if (valid) return done(null, username);
    // return done(null, false);
};

passport.use(new LocalStrategy(
    { // redefine the field names the stratgey (passport-local) expects
        usernameField: 'username',
        passwordField: 'password',
    },

    localAuthenticate // the strategy's "verify" callback
));

passport.serializeUser(function (user, done) {
    console.info("serial to session");
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);

    // User.findOne({
    //     where: {
    //         email: user.email
    //     }
    // }).then(function (result) {
    //     if (result) {
    //         done(null, user);
    //     }
    // }).catch(function (err) {
    //     done(err, user);
    // });
});

// passport.use(new GoogleStrategy({
//     clientID: config.GooglePlus_key,
//     clientSecret: config.GooglePlus_secret,
//     callbackURL: config.GooglePlus_callback_url
// }, verifyCallback))

passport.use(new FacebookStrategy({
    clientID: config.Facebook_key,
    clientSecret: config.Facebook_secret,
    callbackURL: config.Facebook_callback_url,
    profileFields: ['id', 'displayName', 'photos', 'email']
}, verifyCallback))

    // passport.use(new LocalStrategy({
    //     usernameField: "email",
    //     passwordField: "password"
    // }, authenticate));




};
