const express = require('express')
const bodyParser = require('body-parser');

const app = express()

const ticketsRoutes = require('./routes/routes');

const PORT = process.env.PORT || 3000

app.use('/tickets', ticketsRoutes);

app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.listen(PORT,()=>{
    console.log('Server start')
})
