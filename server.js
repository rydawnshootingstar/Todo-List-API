const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const url = 'mongodb://localhost:27017/TodoApp';


var app = express();
//set up our app with the body parser json middleware
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

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







