const bodyParser = require('body-parser');
const express= require('express');
const db= require('./models/index');
const app= express();

const {PORT} = require('./config/serverConfig');
const apiRoutes= require('./routes/index');
const setupAndStartServer=(req,res)=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/api',apiRoutes);
     app.listen(PORT,()=>{
        console.log("Server started on port ",3003);
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});
        }
        //console.log(FLIGHT_SERVICE_PATH);
     });
}

setupAndStartServer();