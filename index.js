var express = require('express');
var path = require('path');
const get_q = require('./public/worker/scrape.js');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index');
})

app.get('/get_quotes/', async function(req, res){
    var qarr = [];
    await get_q.get_quotes(qarr);
    await res.render('quotes', {qarrobj:qarr});
})

app.get('/get_speakers/', async function(req, res){
    var auth = [];
    await get_q.get_authors(auth);
    await get_q.get_description(auth);
    await res.render('authors', {arrobj:auth});
})

app.get('/get_speaker_data/', async function(req, res){
    var name = req.query.name;
    var quotes = [];
    await get_q.get_quotes_author(quotes, name);
    await res.render('allquotesofauthor', {arrobj:quotes, name:name});
})

app.get('/get_tag_data/', async function(req, res){
    var name = req.query.name;
    var tags = {};
    await get_q.get_tags_author(tags, name);
    await res.render('alltagsofauthor', {arrobj:tags, name:name});
})

app.listen(3000, () => console.log('Listening on port 3000......'))