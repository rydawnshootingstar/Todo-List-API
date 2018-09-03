const {ObjectID}= require('mongodb');

const {mongoose} = require('../mongoose');
const {Todo}= require('../models/todo');
const {User}= require('../models/user');


var id = '5b8d4eefc49b571cf4ac61f4';

//here's a way to query the validity of an object ID via passing in a string
if(!ObjectID.isValid('asdf')){
    console.log('id is not valid');
}

//mongoose allows you to query on strings so we don't need to convert this string into a proper ObjectId, as seen in mongo-connect.js
//find returns an array
Todo.find({
    _id: id
}).then((todos)=> {
    console.log('here they are ',todos);
});

//find one returns an object
Todo.findOne({
    _id: id
}).then((todo)=> {
    console.log('here it is ', todo);
});

//here's an even easier way to do this
Todo.findById(id).then((todo)=> {
    if(!todo){
        return console.log('todo not found');
    }
    console.log('here it is again wow', todo);
}).catch((error)=> {
    console.log(error);
});

User.findById('5b8ae844a765731fbcd59903').then((user)=> {
    if(!user){
        return console.log('user not found');
    }
    console.log('USER EXISTS!!!', user);
}).catch((error)=> {
    console.log(error);
})
