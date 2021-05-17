const express  = require( 'express' );

const app = express();

app.use(express.json())

app.get('/', (req, res)=>{
    console.log('hi there,you got to / route');
    res.status(200).send('you got to / route');
});

module.exports = app