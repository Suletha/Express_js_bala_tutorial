const { json } = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

//built_in Middleware(To handle the form data in the backend when user clicks the button)
app.use(express.urlencoded({extended: false}));
app.use(express.json());//To handle the json files in backend
//To handle the static file like css files and images(create 'public' folder and put all the needed files)
app.use(express.static(path.join(__dirname,'./public')));

// app.get('/',(req,res) => {
//     res.send('Hi Express');
// })

//REGULAR EXPRESSION
app.get('^/$ | /index(.html)?',(req,res)=> {
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
app.get('/*',(req,res)=> {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})




app.listen(PORT, () => console.log(`server Running on port ${PORT}`));