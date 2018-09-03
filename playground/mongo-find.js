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

    //find() looks for everything in the database. we have to convert it to an array which will return a docs object with the results
    collection.find({
        completed: false
    }).count().then((docs)=>{
        console.log("todos");
      console.log(JSON.stringify(docs,undefined,2));
    }, (err)=> {
        console.log('unable to find shit');
    });


    client.close();
});