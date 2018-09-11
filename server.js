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
//authenticate and the inclusion of the _creator param makes it private
app.post('/todos', authenticate, (req, res)=> {
    var todo = new Todo({text: req.body.text, _creator: req.user._id});
    todo.save().then((doc)=> {
        console.log('saved ',doc);
        res.status(200).send({"added": "true"});
    }, (error)=> {
        console.log('error: ',error);
        res.status(400).send(error);
    });
});

//get list of all todos make by the logged in user
app.get('/todos', authenticate, (req, res)=> {
   Todo.find({_creator: req.user._id}).then((todos)=> {
       res.send({
           todos
       });
   },(error)=> {
       console.log('error', error);
       res.status(400).send(error);
   })
});

//get a todo
//URL variable and how to access it ***IMPORTANTE***
app.get('/todos/:id', authenticate,(req, res)=> {
    Todo.findOne({_id: req.params.id, _creator: req.user._id}).then((todo)=> {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }, (error)=> {
        console.log('error in requesting todo', error);
        res.status(404).send();
    })
});

//delete a todo
app.delete('/todos/:id',authenticate,(req, res)=> {
   Todo.findOneAndDelete({_id: req.params.id, _creator: req.user._id}).then((todo)=> {
      if(!todo){
          return res.status(404).send();
      }
      res.status(200).send({todo});
   }, (error)=> {
       console.log(error);
       res.status(404).send();
   });
});

//edit a todo
app.patch('/todos/:id', authenticate,(req, res)=> {
   var id = req.params.id.toString();
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
   Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body},{new: true}).then((todo)=> {
       if(!todo){
           return res.status(404).send();
       }
       res.status(200).send({todo});

   }).catch((error)=> {
       console.log(error);
       res.status(400).send();
   })
});

//creates a new user
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

//log in as a user with json body email and password
app.post('/users/login', (req,res)=> {
    var creds = _.pick(req.body, ['email', 'password']);

    //success case
    User.findByCredentials(creds.email, creds.password).then((user)=> {
        return user.generateAuthToken().then((token)=> {
            //set header just like when a new user was created
            res.header('x-auth', token).send(user);
        });
    })//fail case
        .catch((e)=> {
        console.log(e);
        res.status(400).send();
    });

});

//logs a user out by deleting the token it has
app.delete('/users/logout', authenticate,(req, res)=> {
    req.user.removeToken(req.token).then(()=> {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
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







