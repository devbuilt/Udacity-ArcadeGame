'use strict';

//Game variables.
var SQUARE_X = 101,
    SQUARE_Y = 83,
    totalScore = 0,
    totalGem = 0,
    totalHeart = 0;

// Variable to set the starter point of the player.
var playerBeginX = 2 * SQUARE_X,
    playerBeginY = 5 * SQUARE_Y - 20;

//Constructor to generate Heart.
var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.position();
};

//Function to generate random position of hearts for lives.
Heart.prototype.position = function(){
    this.x = Math.floor(Math.random() * 4) * SQUARE_X;
    this.y = (Math.floor(Math.random() * 3) * SQUARE_Y) + 60;  
};

// Protoype to render Heart.
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Constructor to generate gem.
var Gem = function() {
    this.sprite = 'images/Gem Blue.png';
    this.position();
};

// Function to generate random position of the gem.
Gem.prototype.position = function() {
    this.x = Math.floor(Math.random() * 4) * SQUARE_X;
    this.y = (Math.floor(Math.random() * 3) * SQUARE_Y) + 55;
};

// Protoype to render the gem.
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';
    this.x = 0 - SQUARE_X;
    this.y = 55 + Math.floor(Math.random() * 3) * SQUARE_Y;
    this.speed = Math.floor(Math.random() * 500) + 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time dealt between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers. 

    this.x = this.x + this.speed * dt;
    if (this.x > SQUARE_X * 5) {
        this.x = 0 - SQUARE_X;
        this.y = 55 + Math.floor(Math.random() * 3) * SQUARE_Y;
        this.speed = Math.floor(Math.random() * 500) + 100;
    }

};

// Draw the enemy on the screen, required method for the game.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {

    this.sprite = 'images/char-boy.png';
    this.x = playerBeginX;
    this.y = playerBeginY;
};

//Updating player, score, gem and lives.
Player.prototype.update = function() {

    if (this.y < SQUARE_Y - 20) {
        this.x = playerBeginX;
        this.y = playerBeginY;
        totalScore += 1;
    } else if (collisionDetect(this, allEnemies)) {
        this.x = playerBeginX;
        this.y = playerBeginY;
        totalScore -= 1;
        totalHeart -= 1;
    } else if (collisionDetect(this, gem)) {
        totalGem = totalScore += 3;
        gem.position();
    } else if (collisionDetect(this, heart)) {
        totalHeart += 1;
        heart.position();
    }

};

//Rendering the character.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Updates player movements.
Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case 'left':
            if (this.x < SQUARE_X) {
                this.x = this.x;
            } else {
                this.x = this.x - SQUARE_X;
            }
            break;
        case 'up':
            if (this.y < SQUARE_Y - 20) {
                this.y = this.y;
            } else {
                this.y = this.y - SQUARE_Y;
            }
            break;
        case 'right':
            if (this.x > SQUARE_X * 3) {
                this.x = this.x;
            } else {
                this.x = this.x + SQUARE_X;
            }
            break;
        case 'down':
            if (this.y > SQUARE_Y * 4) {
                this.y = this.y;
            } else {
                this.y = this.y + SQUARE_Y;
            }
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();
var gem = new Gem();
var heart = new Heart();

// function to generate new enemy every 3 seconds then stop.
function generateEnemy() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
    if (allEnemies.length > 2) {
        clearInterval(randomEnemy);
    }
};

generateEnemy();
var randomEnemy = setInterval(generateEnemy, 3000);

// function to detect the enemy collison
function collisionDetect(axisA, axisB) {
    var playerX = Math.floor(axisA.x / SQUARE_X);
    var playerY = Math.floor(axisA.y / SQUARE_Y);

    return ([].concat(axisB)).some(function(ab) {
        var enemyX = Math.floor(ab.x / SQUARE_X);
        var enemyY = Math.floor(ab.y / SQUARE_Y);
        if (enemyX === playerX && enemyY === playerY) {
            return true;
        }
        return false;
    });
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});