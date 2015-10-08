//TODO: turn this into a regular file (or DB) instead of a JSON object?

var prompts = [
'fish',
'horse',
'keith',
'pokemons',
'truck',
'abe lincoln',
'golden gate bridge',
'dragon',
'submarine',
'bees',
'medusa',
'ancient greece',
'the cold war',
'harry potter',
'doctor suess',
"can't find my glasses",
'whiteboards',
'startup companies',
'public speaking',
'alligator',
'dubstep',
'edward scissorhands',
'yoga',
'bowling',
'lawnmower',
'hipsters',
'smash bros',
'typhoon',
'magic cards',
'twitter',
'the bride is drunk',
'dinosaur valentine',
'english breakfast',
'custard',
'spliced'
];


var getRandomPrompt = function () {
  var i = Math.floor(Math.random()*prompts.length);
  return prompts[i];
};



module.exports = getRandomPrompt;