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

    //delete many returns a result with ok status and n
    // collection.deleteMany({completed: true}).then((result) => {
    //     console.log(result);
    // });

    //delete one returns a result with ok status and n
    // collection.deleteOne({text: "eat lunch"}).then((result) => {
    //     console.log(result);
    // });

    //find one and delete returns a document as a result
    collection.findOneAndDelete({completed: false}).then((result) => {
       console.log(result);
    });

    client.close();
});