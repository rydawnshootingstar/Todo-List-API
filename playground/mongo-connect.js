//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';

var obj = new ObjectID();

//gotta pass newurlparser for some reason. you get an error if it exists, client if it doesn't
MongoClient.connect(url,{useNewUrlParser: true},(error, client) => {
    if(error){
        //use return so that it doesn't continue to line below
      return console.log('unable to connect to mongodb');
    };
    console.log('connection successful');

    const db = client.db('TodoApp');
    const collection = db.collection('Todos');
/*
    collection.insertOne({text: 'some text', completed: false}, (error, result) => {
        if(error){
            return console.log('unable to insert document', error);
        }
        //what we inserted is stored in ops
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    */
//insert new doc into Users collection. Give it name, age, location string
    db.collection('Users').insertOne({name: 'Mitch', age: 29, location: 'yo mamsa house'}, (error, result) => {
        if(error){
            console.log('error: ', error)
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        var id = new ObjectID(result.ops[0]._id);


    });

    client.close();
});