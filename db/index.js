const MongoClient = require("mongodb").MongoClient;
const ObjectID = require('mongodb').ObjectID;
const log = require('./logger');

const uri = "mongodb+srv://Recipes-API-User:58pP2X0Lm8RjWxrR@cluster0-sooyn.gcp.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbClient;
let collectionUsers;
let collectionRecipes;

log.setLevel('debug');

module.exports = {
    // Connect and close db
    connect,
    close,

    // Users
    addUser,
    getUser,
    getUsers,
    getUserById,
    updateUser,
    updateUserById,
    deleteUser

    // Recipes

};

function connect() {
    log.info('connecting to db...');

    mongoClient.connect(function (err, client) {
        if (err) return log.err(err);

        const database = client.db('apidb');
        const dbCollectionUsers = database.collection('users');
        const dbCollectionRecipes = database.collection('recipes');

        dbClient = client;
        collectionUsers = dbCollectionUsers;
        collectionRecipes = dbCollectionRecipes;

        log.debug('dbClient initialized');
        log.debug('collectionUsers initialized');
        log.debug('collectionRecipes initialized');
        log.info('connecting is successful');
    })
}

function close() {
    if(dbClient) {
        log.info('closing dbClient');
        return dbClient.close();
    }
    log.err('db is not connecting')
}


function addUser(user, fn) {
    log.info('called method addUser');
    collectionUsers.insertOne(user, function (err, result) {
        log.debug(`err:${err} result:${result}`);
        fn(err, result.ops[0]);
    });
}

function getUser(params, fn) {
    log.info('called method getUser');
    collectionUsers.findOne(params, fn);
}

function getUserById(id, fn) {
    log.info('called method getUserById');
    collectionUsers.findOne(
        ObjectID(id),
        fn
    );
}

function getUsers(params, fn) {
    log.info('called method getUsers');
    collectionUsers.find(params).toArray(fn);
}

function updateUser(params, update_values, fn) {
    log.info('called method updateUser');
    collectionUsers.findOneAndUpdate(
        params,
        {$set: update_values},
        fn
    )
}

function updateUserById(id, update_values, fn) {
    log.info('called method updateUserById');
    collectionUsers.findOneAndUpdate(
        {_id: ObjectID(id)},
        { $set: update_values},
        fn
    );
}

function deleteUser(params, fn) {
    log.info('called method deleteUser');
    collectionUsers.deleteOne(params, fn)
}