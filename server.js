const http = require('http');
const dotenv = require('dotenv') 
const app = require('./app');

dotenv.config();
const PORT = process.env.PORT || 3000;
const mode = process.env.NODE_ENV;


const server = http.createServer(app);
server.listen(PORT, ()=>{
    console.log(`you are listenning to PORT: ${PORT}, in ${mode} environment`)
});