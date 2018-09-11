var env = process.env.NODE_ENV || 'development';

//this fetches the values from a json file that would not be committed to a public facing repo (it would be
//in .gitignore)
if(env === 'development' || env === 'test'){
    var config = require('./config.json');
    var envConfig = config[env];

    //returns the array of values for config['env']
    Object.keys(envConfig).forEach((key)=> {
        process.env[key] = envConfig[key];
    });

}

//this was moved to config.json so in a real application it wouldn't be included in a production environment
// if(env ==='development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if(env ==='test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_UI = 'mongodb://localhost:27017/TodoAppTest'
// }