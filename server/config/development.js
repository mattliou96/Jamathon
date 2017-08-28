'use strict';

var domain_name = "https://jamathon-mattliou.herokuapp.com/";

module.exports = {
    PORT: 8080,
    DATABASE_URI: process.env.NODE_DB_URI || process.env.CLEARDB_DATABASE_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/jamathon",
    // COLL_MAIN: "products",
    COLL_MAIN: "projects",
    // COLL_USER: "users",
    LIMIT: 50,
    // MongoDB Variables
    // MONGO_URI: 'mongodb://admin01:ims123@ds119370.mlab.com:19370',
    // MONGO_URI: 'mongodb://admin01:ims123@ds119370.mlab.com:19370/heroku_2rcb9ngt',
    // MONGO_URI: 'mongodb://localhost:27017/products',
    // MONGO_DB: 'heroku_2rcb9ngt',
    // MONGO_HOSTNAME: 'ds119370.mlab.com',
    // MONGO_PORT: 19370,
    // MONGO_USERNAME: 'admin01',
    // MONGO_PASSWORD: 'ims123'

    // MYSQL variables

    // PORT: 3000,
    // MYSQL_DB: 'employees_sample',
    // MYSQL_USERNAME: 'root',
    // MYSQL_PASSWORD: 'ims123!@#',
    // MYSQL_HOSTNAME: 'localhost',
    // MYSQL_PORT: 3306,
    // MYSQL_LOGGING: console.log,
    // version: '1.0.0'
    // linkedin_key: "81xv9l7ppiocvz",
    // Linkedin_secret: "LIhcEze930Dx5RmZ",
    // Linkedin_callback_url: domain_name + "/oauth/linkedin/callback",
    GooglePlus_key: "552301539640-morchf1e4ig6q7gtfje4fl7l35i99uiv.apps.googleusercontent.com",
    GooglePlus_secret: "JbU_KW4qhXGv8eS7_j8p7f-t",
    GooglePlus_callback_url: domain_name + "/oauth/google/callback",
    Facebook_key: "249345335553667",
    Facebook_secret: "5a3550f7aac09e34c8e02f3c4e8d9046",
    Facebook_callback_url: domain_name + "/oauth/facebook/callback",
    // Twitter_key: "IsK3ZwAeez0hMD2Eo7GVjz8sm",
    // Twitter_secret: "fiB5McI42sQxb6Q8aOYnlW2n2xSt5cgnLiVNcAlYyT7xCRhZXd",
    // Twitter_callback_url: domain_name + "/oauth/twitter/callback",
    // Wechat_AppId: "1",
    // Wechat_Name: "1",
    // Wechat_AppSecret: "1",
    // Wechat_Callback_Url: domain_name + "/oauth/wechat/callback"
    AWS_S3_REGION: 'ap-southeast-1',
    AWS_S3_BUCKET: 'jamathon',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
};