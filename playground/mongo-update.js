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
    const collection = db.collection('Users');

    //findoneandupdate returns a promise if no callback is specified
    collection.findOneAndUpdate({
        //what to find
        _id: new ObjectID("5b8998379260760960af3aef")
    }, {
        //what to change
        $set: {
            name: 'FUCK',
        },$inc: {
                age: 1
    }
    }, {
        //we don't need to return what we found before updating
        returnOriginal: false
    }).then((result)=> {
        console.log(result);
    });


    client.close();
});