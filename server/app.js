var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser= require( 'body-parser' );
var urlencodedParser = bodyParser.urlencoded( {extended: false } );
var port = process.env.PORT || 8080;
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/koalaHollaDB';
// static folder
app.use( express.static( 'public' ) );

// spin up server
app.listen( port, function(){
  console.log( 'server up on', port );
});

// base url
app.get( '/', function( req, res ){
  console.log( 'base url hit' );
  res.sendFile( 'index.html' );
});

// get koalas
app.get( '/getKoalas', function( req, res ){
  console.log( 'getKoalas route hit' );
  //assemble object to send
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      var resultsArray = [];
      //ask database for all koalas, then send back array of koala objects
      var queryResults = client.query('SELECT * FROM koalas');
      queryResults.on('row', function(row){
        resultsArray.push(row);
      });
      queryResults.on('end', function(){
        done();
        return res.json(resultsArray);
      });
    }//end else
  });//end connect
});//end /getKoalas

// add koala
app.post( '/addKoala', urlencodedParser, function( req, res ){
  console.log( 'addKoala route hit', req.body );
  //Build query to add koala to database
  var queryString = 'INSERT INTO koalas (name, sex, age, ready_for_transfer, notes) VALUES (\''+ req.body.name + '\', \'' + req.body.sex + '\', ' + req.body.age + ', ' + req.body.readyForTransfer + ', \'' + req.body.notes + '\');';
  console.log('sending to database:', queryString);
  //send queryString to database
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      client.query(queryString);
      var queryResult = client.query('SELECT * FROM koalas ORDER BY id DESC LIMIT 1;');
      var koalaWithId = [];
      queryResult.on('row', function(row){
        koalaWithId.push(row);
      });
      queryResult.on('end', function(){
        console.log(koalaWithId);
        done();
        return res.json(koalaWithId);
      })
    }
  });
});//end /addKoala

//edit koala
app.post( '/editKoala', urlencodedParser, function( req, res ){
  console.log( 'editKoala route hit', req.body );
  //build query string to edit koala in database, found by id
  var queryString = 'UPDATE koalas SET name = \''+ req.body.name + '\', sex = \'' + req.body.sex + '\', age = ' + req.body.age + ', ready_for_transfer = ' + req.body.readyForTransfer + ', notes = \'' + req.body.notes + '\' WHERE id = ' + req.body.id + ';';
  console.log('sending to database:', queryString);
  //send queryString to database
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }
    else{
      client.query(queryString);
      done();
    }
  });
  //send info back to client
  res.send( req.body );
});//end /editKoala
