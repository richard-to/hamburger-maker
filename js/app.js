var game = new Phaser.Game(
  640,
  480,
  Phaser.CANVAS,
  'phaser-window',
  {
    preload: preload,
    create: create,
    update: update
  }
);

var sprites = [
  'floor',
  'assembly_line',
  'patties',
  'cheeses',
  'lettuces',
  'onions',
  'tomatoes',
  'top_bun',
  'bottom_bun',
  'mayo',
  'mustard',
  'ketchup',
  'patty',
  'cheese',
  'lettuce',
  'onion',
  'tomato',
  'ketchup_bottle',
  'mayo_bottle',
  'mustard_bottle'
];

var ingredientMap = {
  'patties': 'patty',
  'cheeses': 'cheese',
  'lettuces': 'lettuce',
  'onions': 'onion',
  'tomatoes': 'tomato',
  'top_bun': 'top_bun',
  'bottom_bun': 'bottom_bun',
  'ketchup': 'ketchup_bottle',
  'mayo': 'mayo_bottle',
  'mustard': 'mustard_bottle',
};

var floor;
var assemblyLine;

var patties;
var cheeses;
var lettuces;
var onions;
var tomatoes;
var top_buns;
var bottom_buns;
var mustard;
var ketchup;
var mayo;

var selectedSprite = null;

function preload() {
  sprites.forEach(function(sprite) {
    game.load.image(sprite, 'assets/' + sprite + '.png');
  });
}

function create() {
  floor = game.add.sprite(0, 0, 'floor');
  assemblyLine = game.add.sprite(0, 0, 'assembly_line');

  patties = game.add.sprite(160, 260, 'patties');
  cheeses = game.add.sprite(240, 270, 'cheeses');
  lettuces = game.add.sprite(315, 265, 'lettuces');
  onions = game.add.sprite(400, 270, 'onions');
  tomatoes = game.add.sprite(485, 280, 'tomatoes');
  top_buns = game.add.sprite(170, 335, 'top_bun');
  bottom_buns = game.add.sprite(250, 345, 'bottom_bun');
  mayo = game.add.sprite(330, 335, 'mayo');
  mustard = game.add.sprite(390, 345, 'mustard');
  ketchup = game.add.sprite(455, 335, 'ketchup');

  var ingredients = [patties, cheeses, lettuces, onions, tomatoes, top_buns, bottom_buns, ketchup, mustard, mayo];
  ingredients.forEach(function(element) {
    element.inputEnabled = true;
    element.events.onInputUp.add(clickIngredient, this);
  });
}

function clickIngredient(sprite, pointer) {
  selectedSprite = game.add.sprite(pointer.x, pointer.y, ingredientMap[sprite.key]);
  selectedSprite.anchor.setTo(0.5, 0.5);
}

function update() {
  if (selectedSprite) {
    selectedSprite.x = game.input.x;
    selectedSprite.y = game.input.y;
  }

  if (selectedSprite && game.input.mousePointer.isDown) {
    selectedSprite = null;
  }
}
