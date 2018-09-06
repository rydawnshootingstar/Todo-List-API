const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

require('./config/config');
var {mongoose} = require('./mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

//const url = 'mongodb://localhost:27017/TodoApp';


var app = express();
//set up our app with the body parser json middleware
app.use(bodyParser.json());

const port = process.env.PORT; // || 3000;

//route for resource creation. this is for a new document of todo type
app.post('/todos', (req, res)=> {
    var todo = new Todo({text: req.body.text});
    todo.save().then((doc)=> {
        console.log('saved ',doc);
        res.status(200).send({"added": "true"});
    }, (error)=> {
        console.log('error: ',error);
        res.status(400).send(error);
    });
});

app.get('/todos', (req, res)=> {
   Todo.find().then((todos)=> {
       res.send({
           todos
       });
   },(error)=> {
       console.log('error', error);
       res.status(400).send(error);
   })
});

//URL variable and how to access it ***IMPORTANTE***
app.get('/todos/:id', (req, res)=> {
    Todo.find({_id: req.params.id}).then((todo)=> {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }, (error)=> {
        console.log('error in requesting todo', error);
        res.status(404).send();
    })
});

//delete route
app.delete('/todos/:id', (req, res)=> {
   Todo.findByIdAndDelete(req.params.id).then((todo)=> {
      if(!todo){
          return res.status(404).send();
      }
      res.status(200).send({todo});
   }, (error)=> {
       console.log(error);
       res.status(404).send();
   });
});

app.patch('/todos/:id', (req, res)=> {
   var id = req.params.id;
   //pulls off things from an object
   var body = _.pick(req.body, ['text', 'completed']);

   if(!ObjectID.isValid(id)){
       return res.status(400).send();
   }

   if(body.completed === 'true'){
       body.completedAt = new Date().getTime();
   }else {
       body.completed = false;
       body.completedAt = null;
   }
   //we have to use mongo db operators as our set object
   Todo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo)=> {
       if(!todo){
           return res.status(404).send();
       }
       res.status(200).send({todo});

   }).catch((error)=> {
       console.log(error);
       res.status(400).send();
   })
});

app.post('/users', (req, res)=> {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(()=> {
        return user.generateAuthToken();
    }).then((token)=> {
        //x headers are "custom" headers
        res.header('x-auth', token).send(user);
    }).catch ((error)=> {
        console.log('error: ',error.message);
        // if(error.message.contains('password')){
        //     res.status(400).send('password must be 6 or more characters long')
        // }
        res.status(400).send(error.message);
    });
});

//private route with middleware
app.get('/users/me', authenticate, (req, res)=> {
    //remember not to send token
    res.send(req.user);
});


app.listen(port, () => {
    console.log('started on '+ port);
});

module.exports = {app};







//tell mongoose we're using promises
// mongoose.Promise = global.Promise;
// //mongoose doesn't require the same callback function as mongo's default connect
// mongoose.connect(url);

//add multiple documents
// var adds = [
// new Todo({text: 'fffff'}),
// new User({email: 'ass@damn.com'}),
// new User({email: "fuck@shit.com"})
// ];

//saves your document to the database
//mongoose will automatically lowercase and pluralize your documents so Todo will become todos
// adds.forEach((add)=> {
//     add.save().then((doc)=> {
//         console.log('saved ',doc);
//     }, (error)=> {
//         console.log('error: ',error);
//     });
// });







