const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 4000;

// connectin to DB
const db = require('./config/mongoose');




// //include static files
app.use(express.static(__dirname + '/assets'));

//route for CSV path
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);

// extract styles and script from sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//set view engine to ejs
app.set('view engine', 'ejs');

//set views to views folder
app.set('views', './views');

//to read through req use urlEncoder
app.use(express.urlencoded());

//set routes 
app.use('/', require('./routes'));



app.listen(port, function(err){
    if(err){
        console.log('Error', err);
        return;
    }

    console.log(`Connected To Server on port: ${port}`);
})