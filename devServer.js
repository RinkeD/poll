/**
 * Globals
 */

// Find out what enviroment to run
var ARGV = process.argv,
    ENV = ARGV[2];

var PORT = 80;


process.DIR = __dirname;


process.POLL_COL = require('./lib/poll_col');
process.POLL_TIMEOUT = 80000;


/**
 * Dependencies
 */

// Native modules
var http = require('http'),
    fs = require('fs');

// Get and init express
var express = require('express'),
    app = express();

// Pretty logging
var cls = require('opensoars_cls');

var Ezlog = require('ezlog'),
    log = new Ezlog({ p: {t: '[devServer]', c: 'green'} });

// Request handlers
var handlers = require('./lib/handlers'),
    Poll = require('./lib/Poll');


/**
 * Midleware stack
 */

// Body parser, will be more secure later on
app.use(function (req, res, next){
  var body = '';
  req.on('data', function (c){ body += c; });
  req.on('end', function (){ req.body = body; next(); });
});

app.use(express.static(__dirname + '/public'));


// Log requests if ENV === dev
app.use(function (req, res, next){
  log( cls(req.method, 'magenta') + ' ' + req.url); return next();
});



process.POLL_COL.add( new Poll({ 
  title: 'Sample poll, multi', options: ['I like it', 'I love it'],
  multi: true, ip: true
}) );

process.POLL_COL.add( new Poll({ 
  title: 'Sample poll, single', options: ['I like it', 'I love it'],
  multi: false, ip: true
}) );

process.POLL_COL.add( new Poll({ 
  title: 'Sample poll, ip: false', options: ['I like it', 'I love it'],
  multi: false, ip: false
}) );

process.POLL_COL.add( new Poll({ 
  title: 'Sample poll, percentages', options: 'abcdef'.split(''),
  multi: false, ip: true
}) );


/**
 * Request handlers
 */

// Serves list of polls
app.get('/rest/polls', handlers.get_polls)

// Serves an existing poll
app.get('/rest/polls/:id', handlers.get_polls_by_id);

// Gets poll results
app.get('/rest/results/:id', handlers.get_results_by_id);

// Creates new poll
app.post('/rest/polls', handlers.post_polls);

// Votes for a poll by id
app.post('/rest/vote/:id', handlers.post_vote_by_id);


// Start listening
app.listen(PORT);
log('Listening at port: ' + PORT);


module.exports = {
  status: 'succes',
  port: PORT
};