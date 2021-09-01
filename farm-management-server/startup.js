const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config({ path: `./env-/${process.env.NODE_ENV}.env` })

const environmentVariables = process.env

if (environmentVariables) {
    //database connectivity
    const dbConnection = environmentVariables.databaseconnection;
    mongoose.connect(`${dbConnection}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: environmentVariables.databaseName
    }).then(() => {
        console.log(`${environmentVariables.dbConnectionGreeting}`);
    }).catch(e => {
        console.log(e);
    })

    let server = app.listen(
        process.env.PORT || environmentVariables.port, process.env.HOST || environmentVariables.host, function () {
            let port = server.address().port;
            console.log(`${environmentVariables.applicationServerUpGreeting} ${port}`);
        })
} else {
    console.log('Failed to load application.....');
}

