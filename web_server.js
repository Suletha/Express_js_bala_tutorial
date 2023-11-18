const { json } = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500;
const cors = require('cors');

app.use(logger);


//Cross Origin Resource Sharing(CRS policy)what are the website you can give access in your app
const whitelist =['https://www.suletha.com', 'http://127.0.0.1:5500', 'http://localhost:3500']
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

//built_in Middleware(To handle the form data in the backend when user clicks the button)
app.use(express.urlencoded({extended: false}));
app.use(express.json());//To handle the json files in backend
//To handle the static file like css files and images(create 'public' folder and put all the needed files)
app.use(express.static(path.join(__dirname,'./public')));
app.use('/subdir', require('./routes/subdir'))

app.use('/employees', require('./routes/api/employees'))

// app.get('/',(req,res) => {
//     res.send('Hi Express');
// })


//REGULAR EXPRESSION
app.get('^/$|/index(.html)?',(req,res)=> {
    res.sendFile(path.join(__dirname,'views','index.html'));
})

app.get('/new_page(.html)?',(req,res)=> {
    res.sendFile(path.join(__dirname,'views','new_page.html'));
})

//To redirect to new_page from old_page
app.get('/old_page(.html)?',(req,res)=> {
    res.redirect(301,'new_page.html');
})

//Chaining
app.get('/hello(.html)?', (req, res, next) => {
    console.log('hello.html page load panna try pannom')
    next()
}, (req, res) =>{
    res.send('Hi hello makkalae')
})
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res) => {
    console.log('three')
    res.send('Finished!')
}
app.get('/chain(.html)?',[one, two, three])


//if u give any wrong url
// app.get('/*',(req,res)=> {
//     res.status(404).sendFile(path.join(__dirname,'views','404.html'));
// })

//Any kind of error
app.all('/*',(req,res)=> {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if (req.accepts.apply('json')){
        res.json({"error":"404 not Found"})
    }else {
        res.type('txt').send("404 Not Found")
    }
    
})

app.use(errorHandler);




app.listen(PORT, () => console.log(`server Running on port ${PORT}`));