var game = new Phaser.Game(
  640,
  480,
  Phaser.CANVAS,
  'phaser-window',
  {
    preload: preload,
    create: create,
    update: update,
    render: render,
  }
);

var sprites = [
  'floor',
  'assembly_line',
  'oven',
  'inner_oven',
  'patties',
  'cheeses',
  'lettuces',
  'onions',
  'tomatoes',
  'top_bun',
  'bottom_bun',
  'mayo_bottle1',
  'mustard_bottle1',
  'ketchup_bottle1',
  'patty',
  'cheese',
  'lettuce',
  'onion',
  'tomato',
  'ketchup_bottle2',
  'mayo_bottle2',
  'mustard_bottle2',
  'ketchup',
  'mayo',
  'mustard'
];

var ingredientMap = {
  'patties': 'patty',
  'cheeses': 'cheese',
  'lettuces': 'lettuce',
  'onions': 'onion',
  'tomatoes': 'tomato',
  'top_bun': 'top_bun',
  'bottom_bun': 'bottom_bun',
  'ketchup_bottle1': 'ketchup_bottle2',
  'mayo_bottle1': 'mayo_bottle2',
  'mustard_bottle1': 'mustard_bottle2',
  'ketchup_bottle2': 'ketchup',
  'mayo_bottle2': 'mayo',
  'mustard_bottle2': 'mustard'
};

var burgerTypes = [
  ['patty', 'mustard', 'ketchup', 'cheese', 'onion', 'top_bun'],
  ['patty', 'mustard', 'ketchup', 'cheese', 'onion', 'lettuce', 'tomato', 'top_bun'],
  ['patty', 'cheese', 'lettuce', 'onion', 'cheese', 'patty', 'top_bun'],
  ['patty', 'bottom_bun', 'patty', 'top_bun'],
];

var config = {
  HAMBURGER_SPEED: 0.5
};

var floor;
var assemblyLine;

var patties;
var cheeses;
var lettuces;
var onions;
var tomatoes;
var topBuns;
var bottomBuns;
var mustard;
var ketchup;
var mayo;

var selectedIngredient;
var currentOrder;
var condiments = ['mustard_bottle1', 'mayo_bottle1', 'ketchup_bottle1']
var hamburger;

var score = 0;
var scoreText;


function preload() {
  sprites.forEach(function(sprite) {
    game.load.image(sprite, 'assets/' + sprite + '.png');
  });
}


function create() {
  floor = game.add.sprite(0, 0, 'floor');
  inner_oven = game.add.sprite(60, 125, 'inner_oven');
  assemblyLine = game.add.sprite(0, 0, 'assembly_line');

  hamburger = game.add.group();
  hamburger.create(0, 170, 'bottom_bun');
  hamburger.setAll('inputEnabled', true);
  hamburger.callAll('events.onInputDown.add', 'events.onInputDown', placeIngredient);

  oven = game.add.sprite(0, 118, 'oven');

  patties = game.add.sprite(160, 260, 'patties');
  cheeses = game.add.sprite(240, 270, 'cheeses');
  lettuces = game.add.sprite(315, 265, 'lettuces');
  onions = game.add.sprite(400, 270, 'onions');
  tomatoes = game.add.sprite(485, 280, 'tomatoes');
  topBuns = game.add.sprite(170, 335, 'top_bun');
  bottomBuns = game.add.sprite(250, 345, 'bottom_bun');
  mayoBottle = game.add.sprite(330, 335, 'mayo_bottle1');
  mustardBottle = game.add.sprite(390, 345, 'mustard_bottle1');
  ketchupBottle = game.add.sprite(455, 335, 'ketchup_bottle1');

  var ingredients = [patties, cheeses, lettuces, onions, tomatoes, topBuns,
                     bottomBuns, ketchupBottle, mustardBottle, mayoBottle];
  ingredients.forEach(function(ingredient) {
    ingredient.inputEnabled = true;
    ingredient.events.onInputUp.add(pickUpIngredient, this);
  });

  var style = { font: "20px Consolas", fill: "#fff", align: "center" };
  scoreText = game.add.text(20, game.height - 30, "Score: " + score, style);

  currentOrder = getBurgerOrder();
  renderOrder(currentOrder);
}


function getBurgerOrder() {
  var index = Math.floor(Math.random() * burgerTypes.length);
  return burgerTypes[index];
}


function renderOrder(ingredients) {
  var output = Mustache.render(
    document.getElementById('ingredients-tmpl').innerHTML,
    { ingredients: ingredients }
  );
  document.getElementById('order').innerHTML = output;
}


function checkOrder(burger, order) {
  if (burger.children.length - 1 !== order.length) {
    return false;
  }
  return order.every(function(ingredient, index) {
    return ingredient === hamburger.children[index + 1].key;
  });
}

function pickUpIngredient(sprite, pointer) {
  selectedIngredient = game.add.sprite(pointer.x, pointer.y, ingredientMap[sprite.key]);
  if (condiments.indexOf(sprite.key) >= 0) {
    selectedIngredient.anchor.setTo(0.15, 0.85);
  } else {
    selectedIngredient.anchor.setTo(0.5, 0.5);
  }
}


function placeIngredient(sprite, pointer) {
  if (selectedIngredient) {
    var lastIngredient = hamburger.children[hamburger.children.length - 1];
    var spriteKey = ingredientMap[selectedIngredient.key] || selectedIngredient.key;
    hamburger.create(lastIngredient.x, lastIngredient.y - 5, spriteKey);
    hamburger.setAll('inputEnabled', true);
    hamburger.callAll('events.onInputDown.add', 'events.onInputDown', placeIngredient);
  }
}


function update() {
  hamburger.x += config.HAMBURGER_SPEED;
  if (hamburger.x > game.width) {
    if (checkOrder(hamburger, currentOrder)) {
      score += 1;
      updateScore(score)
    }
    hamburger.children.slice(1).forEach(function(ingredient) {
      hamburger.remove(ingredient);
    });
    hamburger.x = 0;
    currentOrder = getBurgerOrder();
    renderOrder(currentOrder);
  }

  if (selectedIngredient) {
    selectedIngredient.x = game.input.x;
    selectedIngredient.y = game.input.y;
  }

  if (selectedIngredient && game.input.mousePointer.isDown) {
    selectedIngredient.destroy();
    selectedIngredient = null;
  }
}


function updateScore(score) {
  scoreText.setText('Score: ' + score);
}


function render() {

}
