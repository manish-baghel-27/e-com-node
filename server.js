const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const port = process.env.PORT || 8000;

dotenv.config({path: './config.env'});

process.on('uncaughtException',(err)=>{
    // console.log(err.name, err.message);
    process.exit(1);
})

mongoose.connect(process.env.CONN_STR,
    {useNewUrlParser:true}
).then((conn)=>{
    console.log('DB Connection Successfull.');
})

const server = app.listen(port,()=>{
    console.log('Server has started at port '+port+'...');
})

process.on('unhandledRejection',(err)=>{
    server.close(()=>{
        process.exit(1);
    })
})