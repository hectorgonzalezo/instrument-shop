#! /usr/bin/env node

console.log('This script populates the database with instruments and categories');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const mongoose = require('mongoose');

const mongoDB = userArgs[0];

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const async = require('async')
const Instrument = require('./models/instrument');
const Category = require('./models/category');

const instrumentsArr = []
const categoriesArr = []

function instrumentCreate(name, brand, model,  description, tuning, categories, price, stock, cb) {
  const instrument = new Instrument({
    name,
    brand,
    model,
    description,
    tuning,
    categories,
    price,
    stock,
  });

  console.log(instrument)
       
  instrument.save((err) =>{
    if (err) {
      cb(err, null)
      return
    }
    console.log('New instrument: ' + instrument);
    instrumentsArr.push(instrument)
    cb(null, instrument)
  }  );
}

function categoryCreate(name, description, cb) {
  const category = new Category({ name, description });
       
  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New category: ' + category);
    categoriesArr.push(category)
    cb(null, category);
  }   );
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate("String", "Bowed or plucked? Anything from nylon to steel strings.", callback);
        },
        function(callback) {
          categoryCreate("Percussion", "If it's struck or scraped, you'll find it here!", callback);
        },
        function(callback) {
          categoryCreate("Woodind", "Reed instruments or flutes of all sizes.", callback);
        },
        function(callback) {
          categoryCreate("Brass", "Anything sounded by lip vibration", callback);
        },
        function(callback) {
          categoryCreate("Electronic", "Digital and analog instruments for all needs!", callback);
        },
        function(callback) {
          categoryCreate("Supplies", "Supplies for all kinds of instruments.", callback);
        },
        ],
        // optional callback
        cb);
}


function createInstruments(cb) {
    async.parallel([
				function(callback){
					instrumentCreate(
						"Oboe",
						"Rigoutat",
						"Classique",
						"The Classique embodies the aesthetics and sound signature of Rigoutat oboes; it is the brand’s iconic oboe.\nThis legendary oboe offers the powerful, generous projection that is characteristic of Rigoutat oboes, providing unrivalled transfer and return of sound.",
						"C",
						[categoriesArr[2]._id],
						8500,
						1,
						callback
					)
				},
				function(callback){
					instrumentCreate(
						"Clarinet",
						"Selmer",
						"Presence",
						"Thanks to its innovative bore design, this clarinet has unique acoustic qualities that provide ease of emission, exceptional homogeneity and above all an instrument that is easy to play.\nThe sound of the Présence clarinet is a mix of harmonic richness, and timbre; essential characteristics to the instrument. Also, the research done on the position and size of the tone holes has given this clarinet unrivalled intonation.",
						"Bb",
						[categoriesArr[2]._id],
						3350,
						2,
						callback
					)
				},
				function(callback){
					instrumentCreate(
						"Cello",
						"Eastman Strings",
						"Galiano",
						"Our performance cellos are painstakingly antiqued by hand. The result is an eye-catching instrument that sounds full and resonant.",
						"",
						[categoriesArr[0]._id],
						3350,
						2,
						callback
					)
				},
        function(callback){
					instrumentCreate(
						"Trumpet",
						"Allora",
						"ATR-250 Student Series",
						"The Allora ATR-250 has a medium-large .460 bore, a yellow brass leadpipe and a rose brass bell. It features a first-valve slide thumb saddle, an adjustable 3rd valve slide stop, two water keys and stainless steel pistons for long life and accurate travel. Comes with an upgraded nylon polyfoam case and a three-year warranty.",
						"Bb",
						[categoriesArr[3]._id],
						699,
						5,
						callback
					)
				},
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
		createInstruments
],
// Optional callback
(err, results) => {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Instruments: '+ instrumentsArr);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




