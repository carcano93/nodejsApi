const mongoose = require("mongoose");
require('./games');
require("./users");

const {
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;


const dbURI = `mongodb://${MONGO_HOSTNAME || "localhost"}:${MONGO_PORT || "27017"}/${MONGO_DB || "node1"}`;
mongoose.connect(dbURI, { useNewUrlParser: true })

mongoose.connection.on("connected", () => console.log("Mongose is connected"));
mongoose.connection.on("error", e => console.error(` Mongose err: ${e}`));






/* --------------------------------------------OPTIONAL--------------------------------------

//This is because mongoose does not close the connections automatically in case app crashed, manual exiting or another signals.

const graceFulSShutdown = (msg, callback) => {
    mongoose.connection.close(() => console.log(`Mongoose disconnected throught: ${msg}`));
}

process.on('SIGUSR2', () => graceFulSShutdown("Node restart", () => proccess.kill(process.pid, 'SIGUSR2')))
process.on('SIGINT', () => graceFulSShutdown("App terminator SIGINT", () => proccess.exit(0)))
process.on('SIGTERM', () => graceFulSShutdown("App terminator SIGTERM", () => proccess.exit(0))) 

*/