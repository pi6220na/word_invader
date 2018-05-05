
var game = new Phaser.Game(window.innerWidth*.9, window.innerHeight*.9, Phaser.AUTO, 'word_invade', { preload: preload, create: create, update: update, render: render });

// window.innerWidth*.9, window.innerHeight*.9

// var canvas = document.getElementById('myCanvas');
// canvas.width = window.innerWidth * .8;
// canvas.height = window.innerHeight * .8;

// canvas.width = rectangle1.clientWidth * .9;
// canvas.height = rectangle1.clientHeight * .9;

//
// // // start working with canvas - paint black to make visible
// ctx = canvas.getContext('2d');
// ctx.fillStyle = "#000";
// ctx.fillRect(0, 0, canvas.width, canvas.height);


function preload() {

    game.load.image('bullet', 'public/images/bullet.png');
    game.load.image('enemyBullet', 'public/images/enemy-bullet.png');
    game.load.spritesheet('invader', 'public/images/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'public/images/player.png');
    game.load.spritesheet('kaboom', 'public/images/explode.png', 128, 128);
    game.load.image('starfield', 'public/images/starfield.png');
    game.load.image('diamond', 'public/images/diamond.png');
    game.load.image('background', 'public/images/background2.png');
    game.load.bitmapFont('desyrel', 'public/images/desyrel.png', 'public/images/desyrel.xml');
    game.load.bitmapFont('carrier', 'public/images/carrier_command.png', 'public/images/carrier_command.xml');

}

var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var letter = '';
var typedString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];

// Jeremy's global variables
var wordsInArray = [
    ['','','','','','','','','','',
        '','','','','','','','','','',
        '','','','','','','','','','',
        '','','','','','','','','','']
];
var word_in_progress = "";
var globalX = 0;
//var weapons;
var emitter;
var wordShip;

var dropTimer = 0;
var dropDelay = 1000;       // was 2000
var dropDistance = 30;   // was 10 distance words (aliens) drop at each tic of the dropTimer


var countA = 0;
var countString = '';
var countText = '';

var countLetter = 0;
var countLstring = '';
var countLetterText = '';
var letterTimer = 0;
var letterCounter = 0;

var countWord = 0;
var countWstring = '';
var countWordText = '';
var wordTimer = 0;
var wordCounter = 0;


var crashCounter = 0;
var crashCstring = '';
var crashStringText = '';

function create() {

    // Add keyboard events
    document.addEventListener("keypress", onKeyPress);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.setBoundsToWorld();

    //game.world.setBounds(0,0, window.innerWidth*.9, (window.innerHeight*.9)); // was height-30
    //game.world.setBounds(0,0, window.innerWidth*.9, window.innerHeight*.9);
    game.world.setBounds(0,0, game.width, game.height-40);

    console.log('window inner width ' + window.innerWidth + ' window inner height' + window.innerHeight);
    console.log('window inner width*.9 ' + window.innerWidth*.9 + ' window inner height*.9' + window.innerHeight*.9);
    console.log('canvas width ' + canvas.width + ' canvas height ' + canvas.height);
    console.log('game width ' + game.width + ' game height ' + game.height);
    console.log('world width ' + game.world.width + ' world height ' + game.world.height);
    console.log('world width bounds' + game.world.bounds.width + ' world height bounds' + game.world.bounds.height);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, window.innerWidth*.9, window.innerHeight*.9, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);


    weapons = game.add.group();
    weapons.physicsBodyType = Phaser.Physics.ARCADE;
    weapons.enableBody = true;
    //  Creates 30 bullets, using the 'bullet' graphic
    weapons = game.add.weapon(30, 'enemyBullet');


    emitter = game.add.emitter(0, 0, 100);

    emitter.makeParticles('diamond');  // was diamond also tried kaboom
    emitter.gravity = 200;



    //  The hero!
    //player = game.add.sprite(400, 500, 'ship');
    player = game.add.sprite(game.world.width, game.world.height, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.visible = false;

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    // Typed letters
    typedString = 'You typed: ';
    typedText = game.add.text((game.world.width / 2) - 100, 20, typedString + letter, { font: '34px Arial', fill: '#fff' });


    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    // count aliens
    countString = 'Aliens Remaining: ';
    countA = 0;
    countText = game.add.text(10, game.world.height, countString + countA, { font: '34px Arial', fill: '#fff' });

    // letters per minute
    countLstring = 'Letters/minute (total): ';
    countLetter = 0;
    countLetterText = game.add.text((game.world.width/7)*2, game.world.height, countLstring + countLetter, { font: '34px Arial', fill: '#fff' });

    // words per minute
    countWstring = 'Words/minute (total): ';
    countWord = 0;
    countWordText = game.add.text((game.world.width/7)*4, game.world.height, countWstring + countWord, { font: '34px Arial', fill: '#fff' });

    // crashed words (hit bottom of world)
    crashCstring = 'Crashed count: ';
    crashCount = 0;
    crashStringText = game.add.text((game.world.width/7)*6, game.world.height, crashCstring + crashCount, { font: '34px Arial', fill: '#fff' });


    countLetter = 0;
    countLetterText.text = countLstring + countLetter + ' (' + letterCounter + ')';

    countWord = 0;
    countWordText.text = countWstring + countWord + ' (' + wordCounter + ')';

    crashCount = 0;
    crashStringText.text = crashCstring + crashCount;


    // moved createAliens() here from above so that lives group exists prior to adding ship to it
    createAliens();

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++)
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // add letter and word timers
    letterTimer = game.time.now;
    wordTimer = game.time.now;

}


function createAliens () {
    // this function generates a list of 24 words (sprites).
    var index = 0;

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 6; x++)   // was 10
        {
            // get a random word from list of over 3000 common American english words
            var word = game.rnd.pick(words);


            var text = game.add.text(x * (window.innerWidth/7), y * (window.innerHeight/6), word);
            //var text = game.add.text(x * 240, y * 120, word);   // 200 was 140
            //  Centers the text
            text.anchor.set(0.5);
            //text.align = 'center';

            //  Our font + size
            text.font = 'Arial';
            text.fontWeight = 'bold';
            text.fontSize = 30;
            text.addColor('#ffff00', 0);


            wordsInArray[index] = word;
            index+=1;

            aliens.add(text);
            //console.log(String(aliens.countLiving()));
        }
    }

    //console.log(wordsInArray);

    // this positions the aliens (words) group top left corner
    aliens.x = (game.world.width/12);
    aliens.y = (game.world.height/8);

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = game.add.tween(aliens).to( { x: game.world.width/7 }, 2000, Phaser.Easing.Linear.None, true, 200, 1000, true);

    //  When the tween loops it calls descend ::: this onLoop function is broken, known issue on Phaser.io
    //  descending handled manually
    tween.onLoop.add(descend, this);

    // console.log(tween);
    // console.log(tween.current)

    // place ship at bottom center of screen
    wordShip = lives.create(game.world.width / 2, game.world.height - 40, 'ship');
    wordShip.anchor.setTo(0.5, 0.5);
    wordShip.angle = 0;
    wordShip.alpha = 1.0;
    game.physics.enable(wordShip, Phaser.Physics.ARCADE);
    wordShip.visible = true;

}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += dropDistance;

}

function update() {

    //  Scroll the background
    starfield.tilePosition.y += 2;

    if (game.time.now > dropTimer) {
        descend();
        dropTimer = game.time.now + dropDelay;   // was 2000
    }

    if (player.alive)
    {
        //  Reset the player, then check for movement keys
        player.body.velocity.setTo(0, 0);

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
        }

        //  Firing?
        if (fireButton.isDown)
        {
            fireBullet();
        }

        // if (game.time.now > firingTimer)
        // {
        //     enemyFires();
        // }

        //  Run collision                           aliens.children[globalX]

        game.physics.arcade.overlap(weapons.bullets, aliens.children[globalX], collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

        //  The count of aliens
        countString = 'Aliens Remaining: ';
        countA = aliens.countLiving();
        countText.text = countString + countA;


        // moved setBounds from here

        // loop through the word list (aliens) to see if any have hit the bottom of the screen, if yes, explode them
        //for (var x = 0; x < aliens.length; x++) {
        for (var x = aliens.length-1; x >= 0; x--) {
            aliens.children[x].checkWorldBounds = true;
            aliens.children[x].events.onOutOfBounds.add(explody, this);
        }

    }
}

function explody(alien) {

    alien.kill(); // subtracts one from countLiving total and removes from array

    crashCounter++;
    crashStringText.text = crashCstring + crashCounter;

    // //  And create an explosion :)
    // var explosion = explosions.getFirstExists(false);
    // explosion.reset(alien.body.x, alien.body.y);
    // explosion.play('kaboom', 30, false, true);


    //  Position the emitter where the mouse/touch event was
    emitter.x = alien.body.x;
    emitter.y = alien.body.y;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    emitter.start(true, 2000, null, 20);

    if (aliens.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);

        //enter key also restarts game
        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // keyEnter.onDown.add(console.log('enter key is pressed'));
        keyEnter.onDown.add(restart, this);

    }

}

function markLetters(stringIn) {

    word_in_progress = word_in_progress.concat(stringIn);

    letter = letter.concat(stringIn);
    typedText.text = typedString + letter;

    letterCounter++;

    //var num = (letterCounter / (game.time.now - letterTimer)) * 6000;
    var num = (letterCounter / ((game.time.now - letterTimer) / 1000) * 60);
    countLetter = num.toFixed(0);

    //letterTimer = game.time.now;

    // console.log('time now ' + game.time.now);
    // console.log('letterTimer ' + letterTimer);
    // console.log('letterCounter ' + letterCounter);
    // console.log(((game.time.now - letterTimer) / letterCounter));

    countLetterText.text = countLstring + countLetter + ' (' + letterCounter + ')';

    for (var x = 0; x < wordsInArray.length; x++) {
        
        if (wordsInArray[x].startsWith(word_in_progress)) {    // string function startsWith
            //alert('found a partial match')
            changeLetters(word_in_progress, x);
            if ((wordsInArray[x] === word_in_progress) && (word_in_progress !== "")) {
                //alert('Exact Match!');
                globalX = x;
                
                // shoot a bullet at word and make it explode
                fireWord(aliens.children[x]);

                // reset variables
                letter = '';
                word_in_progress = "";
                wordsInArray[x] = "";
                
                // loop through all remaining words and reset color back to default
                resetColors();
                
                // clear out letters that have been typed text area (top of web page)
                letter = '';
                typedText.text = typedString + letter;

            }
        }
    }

}

function resetColors() {
    // loop through all words in the array and reset color back to original color
    for (var x = 0; x < wordsInArray.length; x++) {

        // extract word from array so that individual letters can be changed
        var myWord = aliens.children[x];

        // loop through letters of word starting at the end and working toward beginning of word
        // need to do this because of how the addColor function works - it stops when it hits a change
        for (var j = wordsInArray[x].length-1; j >= 0; j--) {

            myWord.addColor('#ffff00', j);
            //console.log(String(j));
        }

        // put reset word back into array
        aliens.children[x] = myWord;
    }
}

function changeLetters(word_in_progress, x) {
// change color of letter(s) of word to indicate that it has been typed by the user

    // extract word from array
    var myWord = aliens.children[x];

    for (var j = 0; j < word_in_progress.length; j++) {
        //myWord.text.charAt(j).tint = 0x555555;
        myWord.addColor('#ff0000', j);
        myWord.addColor('#ffff00', j+1);
    }

    aliens.children[x] = myWord;

}

function fireWord (target) {

    // shoot a bullet at the target word and make it explode

    //  The bullet will be automatically killed when it leaves the world bounds
    weapons.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapons.bulletSpeed = 3600; // was 2600

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapons.fireRate = 60;

    // shoot from wordShip at bottom center of web page
    weapons.trackSprite(wordShip, 0, 0, true);
    weapons.fireAtSprite(target);
    weapons.fire();                 // shoot the bullet

    firingTimer = game.time.now + 20;   // was 2000

    wordCounter++;
    var num = (wordCounter / ((game.time.now - wordTimer) / 1000) * 60);
    countWord = num.toFixed(0);
    countWordText.text = countWstring + countWord + ' (' + wordCounter + ')';

}


// uncomment to turn on debugging of alien (word) sprites
function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    //
    // }

    //game.debug.spriteInfo(weapons, 32, 450);


}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    //console.log(String(aliens.countLiving()));

    if (aliens.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);

        //enter key also restarts game
        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // keyEnter.onDown.add(console.log('enter key is pressed'));
        keyEnter.onDown.add(restart, this);

    }

}

function collisionOne (alien) {

    //  When a bullet hits an alien we kill them both
    //bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);

        //enter key also restarts game
        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // keyEnter.onDown.add(console.log('enter key is pressed'));
        keyEnter.onDown.add(restart, this);

    }

}



function enemyHitsPlayer (player,bullet) {

    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    // if (lives.countLiving() < 1)
    // {
    //     player.kill();
    //     enemyBullets.callAll('kill');
    //
    //     stateText.text=" GAME OVER \n Click to restart";
    //     stateText.visible = true;
    //
    //     //the "click to restart" handler
    //     game.input.onTap.addOnce(restart,this);
    //     //enter key also restarts game
    //     var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //     // keyEnter.onDown.add(console.log('enter key is pressed'));
    //     keyEnter.onDown.add(restart, this);
    // }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {

        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,1200);  // was 120
        firingTimer = game.time.now + 2000;
    }

}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts

    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    wordShip.kill();
    createAliens();

    //revives the player
    player.revive();
    player.visible = false;

    //hides the text
    stateText.visible = false;

    //reset keyEnter to null so that special restart function not called all the time
    keyEnter = game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);

    letterCounter = 0;
    wordCounter = 0;
    crashCounter = 0;

    // reset letter and word timers
    letterTimer = game.time.now;
    wordTimer = game.time.now;

    countLetter = 0;
    countLetterText.text = countLstring + countLetter + ' (' + letterCounter + ')';

    countWord = 0;
    countWordText.text = countWstring + countWord + ' (' + wordCounter + ')';

    crashCount = 0;
    crashStringText.text = crashCstring + crashCount;
}


// Keyboard event handler - gets the key character code e.g. lowercase a = 97
function onKeyPress(e) {

    var myKey = e.which;

    if (myKey === 97) {
        markLetters('a');
    } else if (myKey === 98) {
        markLetters('b');
    } else if (myKey === 99) {
        markLetters('c');
    } else if (myKey === 100) {
        markLetters('d');
    } else if (myKey === 101) {
        markLetters('e');
    } else if (myKey === 102) {
        markLetters('f');
    } else if (myKey === 103) {
        markLetters('g');
    } else if (myKey === 104) {
        markLetters('h');
    } else if (myKey === 105) {
        markLetters('i');
    } else if (myKey === 106) {
        markLetters('j');
    } else if (myKey === 107) {
        markLetters('k');
    } else if (myKey === 108) {
        markLetters('l');
    } else if (myKey === 109) {
        markLetters('m');
    } else if (myKey === 110) {
        markLetters('n');
    } else if (myKey === 111) {
        markLetters('o');
    } else if (myKey === 112) {
        markLetters('p');
    } else if (myKey === 113) {
        markLetters('q');
    } else if (myKey === 114) {
        markLetters('r');
    } else if (myKey === 115) {
        markLetters('s');
    } else if (myKey === 116) {
        markLetters('t');
    } else if (myKey === 117) {
        markLetters('u');
    } else if (myKey === 118) {
        markLetters('v');
    } else if (myKey === 119) {
        markLetters('w');
    } else if (myKey === 120) {
        markLetters('x');
    } else if (myKey === 121) {
        markLetters('y');
    } else if (myKey === 122) {
        markLetters('z');
    } else if (myKey === 65) {
        markLetters('A');
    } else if (myKey === 66) {
        markLetters('B');
    } else if (myKey === 67) {
        markLetters('C');
    } else if (myKey === 68) {
        markLetters('D');
    } else if (myKey === 69) {
        markLetters('E');
    } else if (myKey === 70) {
        markLetters('F');
    } else if (myKey === 71) {
        markLetters('G');
    } else if (myKey === 72) {
        markLetters('H');
    } else if (myKey === 73) {
        markLetters('I');
    } else if (myKey === 74) {
        markLetters('J');
    } else if (myKey === 75) {
        markLetters('K');
    } else if (myKey === 76) {
        markLetters('L');
    } else if (myKey === 77) {
        markLetters('M');
    } else if (myKey === 78) {
        markLetters('N');
    } else if (myKey === 79) {
        markLetters('O');
    } else if (myKey === 80) {
        markLetters('P');
    } else if (myKey === 81) {
        markLetters('Q');
    } else if (myKey === 82) {
        markLetters('R');
    } else if (myKey === 83) {
        markLetters('S');
    } else if (myKey === 84) {
        markLetters('T');
    } else if (myKey === 85) {
        markLetters('U');
    } else if (myKey === 86) {
        markLetters('V');
    } else if (myKey === 87) {
        markLetters('W');
    } else if (myKey === 88) {
        markLetters('X');
    } else if (myKey === 89) {
        markLetters('Y');
    } else if (myKey === 90) {
        markLetters('Z');
    }

    if (myKey === 39) {
        markLetters("'");
    }

    // enter key
    if (myKey === 13) {
        // clear out "you typed" area, reset all text to default color
        letter = '';
        typedText.text = typedString + letter;
        word_in_progress = "";
        resetColors();
    }

}


var words = [
    "Africa","Alaska","Alice","America","Andy","Ann","April","Asia","Atlantic","August",
    "Aunt","Australia","Autumn","Bay","Ben","Betsy","Bill","Billy","Bob","British",
    "California","Canada","Carlos","Casey","Charles","Chicago","China","Chinese","Christmas","Columbus",
    "Dad","Dan","Daniel","Danny","David","Dick","Don","Dr.","Dutch","Eddy",
    "Edward","Egypt","Ellen","England","Europe","European","Florida","France","Frank","Fred",
    "French","George","German","Germany","Greece","Greek","Harry","Henry","I","I'd",
    "I'll","I'm","I've","Illinois","India","Indian","Italian","Italy","James","Jane",
    "January","Japan","Japanese","Jeff","Jim","Jimmy","Joe","John","Johnny","Johnson",
    "Jones","July","June","King","Latin","Lee","Lincoln","London","Louis","Mama",
    "March","Maria","Mark","Mars","Martin","Mary","May","Mexico","Mike","Miss",
    "Mississippi","Mount","Mr.","Mrs.","Negro","New York","Norway","October","Ohio","Pacific",
    "Papa","Paris","Paul","Pennsylvania","Peter","Philadelphia","Pole","Richard","Robert","Roman",
    "Rome","Russia","Russian","Sally","Sam","Saturday","Sir","Smith","Spain","St.",
    "States","Sunday","TV","Texas","Thomas","Tim","Tom","United","University","Virginia",
    "Washington","William","Wilson","ability","able","aboard","about","above","accept","accident",
    "according","account","accurate","acres","across","act","action","active","activity","actual",
    "actually","add","addition","additional","adjective","adult","adventure","advice","affect","afraid",
    "after","afternoon","again","against","age","ago","agree","ahead","aid","air",
    "airplane","alike","alive","all","allow","almost","along","aloud","alphabet","already",
    "also","although","am","among","amount","an","ancient","and","angle","angry",
    "animal","announced","another","answer","ants","any","anybody","anyone","anything","anyway",
    "anywhere","apart","apartment","appearance","apple","applied","appropriate","are","area","aren't",
    "arm","army","around","arrange","arrangement","arrive","arrow","art","article","as",
    "aside","ask","asleep","at","ate","atmosphere","atom","atomic","attached","attack",
    "attempt","attention","audience","author","automobile","available","average","avoid","aware","away",
    "baby","back","bad","badly","bag","balance","ball","balloon","band","bank",
    "bar","bare","bark","barn","base","baseball","basic","basis","basket","bat",
    "battle","be","bean","bear","beat","beautiful","beauty","became","because","become",
    "becoming","bee","been","before","began","beginning","begun","behavior","behind","being",
    "believed","bell","belong","below","belt","bend","beneath","bent","beside","best",
    "bet","better","between","beyond","bicycle","bigger","biggest","bill","birds","birth",
    "birthday","bit","bite","black","blank","blanket","blew","blind","block","blood",
    "blow","blue","board","boat","body","bone","book","border","born","both",
    "bottle","bottom","bound","bow","bowl","box","boy","brain","branch","brass",
    "brave","bread","break","breakfast","breath","breathe","breathing","breeze","brick","bridge",
    "brief","bright","bring","broad","broke","broken","brother","brought","brown","brush",
    "buffalo","build","building","built","buried","burn","burst","bus","bush","business",
    "busy","but","butter","buy","by","cabin","cage","cake","call","calm",
    "came","camera","camp","can","can't","canal","cannot","cap","capital","captain",
    "captured","car","carbon","card","care","careful","carefully","carried","carry","case",
    "cast","castle","cat","catch","cattle","caught","cause","cave","cell","cent",
    "center","central","century","certain","certainly","chain","chair","chamber","chance","change",
    "changing","chapter","character","characteristic","charge","chart","check","cheese","chemical","chest",
    "chicken","chief","child","children","choice","choose","chose","chosen","church","circle",
    "circus","citizen","city","class","classroom","claws","clay","clean","clear","clearly",
    "climate","climb","clock","close","closely","closer","cloth","clothes","clothing","cloud",
    "club","coach","coal","coast","coat","coffee","cold","collect","college","colony",
    "color","column","combination","combine","come","comfortable","coming","command","common","community",
    "company","compare","compass","complete","completely","complex","composed","composition","compound","concerned",
    "condition","congress","connected","consider","consist","consonant","constantly","construction","contain","continent",
    "continued","contrast","control","conversation","cook","cookies","cool","copper","copy","corn",
    "corner","correct","correctly","cost","cotton","could","couldn't","count","country","couple",
    "courage","course","court","cover","cow","cowboy","crack","cream","create","creature",
    "crew","crop","cross","crowd","cry","cup","curious","current","curve","customs",
    "cut","cutting","daily","damage","dance","danger","dangerous","dark","darkness","date",
    "daughter","dawn","day","dead","deal","dear","death","decide","declared","deep",
    "deeply","deer","definition","degree","depend","depth","describe","desert","design","desk",
    "detail","determine","develop","development","diagram","diameter","did","didn't","die","differ",
    "difference","different","difficult","difficulty","dig","dinner","direct","direction","directly","dirt",
    "dirty","disappear","discover","discovery","discuss","discussion","disease","dish","distance","distant",
    "divide","division","do","doctor","does","doesn't","dog","doing","doll","dollar",
    "don't","done","donkey","door","dot","double","doubt","down","dozen","draw",
    "drawn","dream","dress","drew","dried","drink","drive","driven","driver","driving",
    "drop","dropped","drove","dry","duck","due","dug","dull","during","dust",
    "duty","each","eager","ear","earlier","early","earn","earth","easier","easily",
    "east","easy","eat","eaten","edge","education","effect","effort","egg","eight",
    "either","electric","electricity","element","elephant","eleven","else","empty","end","enemy",
    "energy","engine","engineer","enjoy","enough","enter","entire","entirely","environment","equal",
    "equally","equator","equipment","escape","especially","essential","establish","etc.","even","evening",
    "event","eventually","ever","every","everybody","everyone","everything","everywhere","evidence","exact",
    "exactly","examine","example","excellent","except","exchange","excited","excitement","exciting","exclaimed",
    "exercise","exist","expect","experience","experiment","explain","explanation","explore","express","expression",
    "extra","eye","face","facing","fact","factor","factory","failed","fair","fairly",
    "fall","fallen","familiar","family","famous","far","farm","farmer","farther","fast",
    "fastened","faster","fat","father","favorite","fear","feathers","feature","fed","feed",
    "feel","feet","fell","fellow","felt","fence","few","fewer","field","fierce",
    "fifteen","fifth","fifty","fight","fighting","figure","fill","film","final","finally",
    "find","fine","finest","finger","finish","fire","fireplace","firm","first","fish",
    "five","fix","flag","flame","flat","flew","flies","flight","floating","floor",
    "flow","flower","fly","fog","folks","follow","food","foot","football","for",
    "force","foreign","forest","forget","forgot","forgotten","form","former","fort","forth",
    "forty","forward","fought","found","four","fourth","fox","frame","free","freedom",
    "frequently","fresh","friend","friendly","frighten","frog","from","front","frozen","fruit",
    "fuel","full","fully","fun","function","funny","fur","furniture","further","future",
    "gain","game","garage","garden","gas","gasoline","gate","gather","gave","general",
    "generally","gentle","gently","get","getting","giant","gift","girl","give","given",
    "giving","glad","glass","globe","go","goes","gold","golden","gone","good",
    "goose","got","government","grabbed","grade","gradually","grain","grandfather","grandmother","graph",
    "grass","gravity","gray","great","greater","greatest","greatly","green","grew","ground",
    "group","grow","grown","growth","guard","guess","guide","gulf","gun","habit",
    "had","hadn't","hair","half","halfway","hall","hand","handle","handsome","hang",
    "happen","happened","happily","happy","harbor","hard","harder","hardly","has","hat",
    "have","haven't","having","hay","he","he'd","he'll","he's","headed","heading",
    "health","heard","hearing","heart","heat","heavy","height","held","hello","help",
    "helpful","her","herd","here","herself","hidden","hide","high","higher","highest",
    "highway","hill","him","himself","his","history","hit","hold","hole","hollow",
    "home","honor","hope","horn","horse","hospital","hot","hour","house","how",
    "however","huge","human","hundred","hung","hungry","hunt","hunter","hurried","hurry",
    "hurt","husband","ice","idea","identity","if","ill","image","imagine","immediately",
    "importance","important","impossible","improve","in","inch","include","including","income","increase",
    "indeed","independent","indicate","individual","industrial","industry","influence","information","inside","instance",
    "instant","instead","instrument","interest","interior","into","introduced","invented","involved","iron",
    "is","island","isn't","it","its","itself","jack","jar","jet","job",
    "join","joined","journey","joy","judge","jump","jungle","just","keep","kept",
    "key","kids","kill","kind","kitchen","knew","knife","know","knowledge","known",
    "label","labor","lack","lady","laid","lake","lamp","land","language","large",
    "larger","largest","last","late","later","laugh","law","lay","layers","lead",
    "leader","leaf","learn","least","leather","leave","leaving","led","left","leg",
    "length","lesson","let","let's","letter","level","library","lie","life","lift",
    "light","like","likely","limited","line","lion","lips","liquid","list","listen",
    "little","live","living","load","local","locate","location","log","lonely","long",
    "longer","look","loose","lose","loss","lost","lot","loud","love","lovely",
    "low","lower","luck","lucky","lunch","lungs","lying","machine","machinery","mad",
    "made","magic","magnet","mail","main","mainly","major","make","making","man",
    "managed","manner","manufacturing","many","map","mark","market","married","mass","massage",
    "master","material","mathematics","matter","may","maybe","me","meal","mean","means",
    "meant","measure","meat","medicine","meet","melted","member","memory","men","mental",
    "merely","met","metal","method","mice","middle","might","mighty","mile","military",
    "milk","mill","mind","mine","minerals","minute","mirror","missing","mission","mistake",
    "mix","mixture","model","modern","molecular","moment","money","monkey","month","mood",
    "moon","more","morning","most","mostly","mother","motion","motor","mountain","mouse",
    "mouth","move","movement","movie","moving","mud","muscle","music","musical","must",
    "my","myself","mysterious","nails","name","nation","national","native","natural","naturally",
    "nature","near","nearby","nearer","nearest","nearly","necessary","neck","needed","needle",
    "needs","negative","neighbor","neighborhood","nervous","nest","never","new","news","newspaper",
    "next","nice","night","nine","no","nobody","nodded","noise","none","noon",
    "nor","north","nose","not","note","noted","nothing","notice","noun","now",
    "number","numeral","nuts","object","observe","obtain","occasionally","occur","ocean","of",
    "off","offer","office","officer","official","oil","old","older","oldest","on",
    "once","one","only","onto","open","operation","opinion","opportunity","opposite","or",
    "orange","orbit","order","ordinary","organization","organized","origin","original","other","ought",
    "our","ourselves","out","outer","outline","outside","over","own","owner","oxygen",
    "pack","package","page","paid","pain","paint","pair","palace","pale","pan",
    "paper","paragraph","parallel","parent","park","part","particles","particular","particularly","partly",
    "parts","party","pass","passage","past","path","pattern","pay","peace","pen",
    "pencil","people","per","percent","perfect","perfectly","perhaps","period","person","personal",
    "pet","phrase","physical","piano","pick","picture","pictured","pie","piece","pig",
    "pile","pilot","pine","pink","pipe","pitch","place","plain","plan","plane",
    "planet","planned","planning","plant","plastic","plate","plates","play","pleasant","please",
    "pleasure","plenty","plural","plus","pocket","poem","poet","poetry","point","pole",
    "police","policeman","political","pond","pony","pool","poor","popular","population","porch",
    "port","position","positive","possible","possibly","post","pot","potatoes","pound","pour",
    "powder","power","powerful","practical","practice","prepare","present","president","press","pressure",
    "pretty","prevent","previous","price","pride","primitive","principal","principle","printed","private",
    "prize","probably","problem","process","produce","product","production","program","progress","promised",
    "proper","properly","property","protection","proud","prove","provide","public","pull","pupil",
    "pure","purple","purpose","push","put","putting","quarter","queen","question","quick",
    "quickly","quiet","quietly","quite","rabbit","race","radio","railroad","rain","raise",
    "ran","ranch","range","rapidly","rate","rather","raw","rays","reach","read",
    "reader","ready","real","realize","rear","reason","recall","receive","recent","recently",
    "recognize","record","red","refer","refused","region","regular","related","relationship","religious",
    "remain","remarkable","remember","remove","repeat","replace","replied","report","represent","require",
    "research","respect","rest","result","return","review","rhyme","rhythm","rice","rich",
    "ride","riding","right","ring","rise","rising","river","road","roar","rock",
    "rocket","rocky","rod","roll","roof","room","root","rope","rose","rough",
    "round","route","row","rubbed","rubber","rule","ruler","run","running","rush",
    "sad","saddle","safe","safety","said","sail","sale","salmon","salt","same",
    "sand","sang","sat","satellites","satisfied","save","saved","saw","say","scale",
    "scared","scene","school","science","scientific","scientist","score","screen","sea","search",
    "season","seat","second","secret","section","see","seed","seeing","seems","seen",
    "seldom","select","selection","sell","send","sense","sent","sentence","separate","series",
    "serious","serve","service","sets","setting","settle","settlers","seven","several","shade",
    "shadow","shake","shaking","shall","shallow","shape","share","sharp","she","sheep",
    "sheet","shelf","shells","shelter","shine","shinning","ship","shirt","shoe","shoot",
    "shop","shore","short","shorter","shot","should","shoulder","shout","show","shown",
    "shut","sick","sides","sight","sign","signal","silence","silent","silk","silly",
    "silver","similar","simple","simplest","simply","since","sing","single","sink","sister",
    "sit","sitting","situation","six","size","skill","skin","sky","slabs","slave",
    "sleep","slept","slide","slight","slightly","slip","slipped","slope","slow","slowly",
    "small","smaller","smallest","smell","smile","smoke","smooth","snake","snow","so",
    "soap","social","society","soft","softly","soil","solar","sold","soldier","solid",
    "solution","solve","some","somebody","somehow","someone","something","sometime","somewhere","son",
    "song","soon","sort","sound","source","south","southern","space","speak","special",
    "species","specific","speech","speed","spell","spend","spent","spider","spin","spirit",
    "spite","split","spoken","sport","spread","spring","square","stage","stairs","stand",
    "standard","star","stared","start","state","statement","station","stay","steady","steam",
    "steel","steep","stems","step","stepped","stick","stiff","still","stock","stomach",
    "stone","stood","stop","stopped","store","storm","story","stove","straight","strange",
    "stranger","straw","stream","street","strength","stretch","strike","string","strip","strong",
    "stronger","struck","structure","struggle","stuck","student","studied","studying","subject","substance",
    "success","successful","such","sudden","suddenly","sugar","suggest","suit","sum","summer",
    "sun","sunlight","supper","supply","support","suppose","sure","surface","surprise","surrounded",
    "swam","sweet","swept","swim","swimming","swing","swung","syllable","symbol","system",
    "table","tail","take","taken","tales","talk","tall","tank","tape","task",
    "taste","taught","tax","tea","teach","teacher","team","tears","teeth","telephone",
    "television","tell","temperature","ten","tent","term","terrible","test","than","thank",
    "that","that's","the","thee","them","themselves","then","theory","there","there's",
    "therefore","these","they","they're","thick","thin","thing","think","third","thirty",
    "this","those","thou","though","thought","thousand","thread","three","threw","throat",
    "through","throughout","throw","thrown","thumb","thus","thy","tide","tie","tight",
    "tightly","till","time","tin","tiny","tip","tired","title","to","tobacco",
    "today","together","told","tomorrow","tone","tongue","tonight","too","took","tool",
    "top","topic","torn","total","touch","toward","tower","town","toy","trace",
    "track","trade","traffic","trail","train","transportation","trap","travel","treated","tree",
    "triangle","tribe","trick","tried","trip","troops","tropical","trouble","truck","trunk",
    "truth","try","tube","tune","turn","twelve","twenty","twice","two","type",
    "typical","uncle","under","underline","understanding","unhappy","union","unit","universe","unknown",
    "unless","until","unusual","up","upon","upper","upward","us","use","useful",
    "using","usual","usually","valley","valuable","value","vapor","variety","various","vast",
    "vegetable","verb","vertical","very","vessels","victory","view","village","visit","visitor",
    "voice","volume","vote","vowel","voyage","wagon","wait","walk","wall","want",
    "war","warm","warn","was","wash","wasn't","waste","watch","water","wave",
    "way","we","we'll","we're","we've","weak","wealth","wear","weather","week",
    "weigh","weight","welcome","well","went","were","weren't","west","western","wet",
    "whale","what","what's","whatever","wheat","wheel","when","whenever","where","wherever",
    "whether","which","while","whispered","whistle","white","who","whole","whom","whose",
    "why","wide","widely","wife","wild","will","willing","win","wind","window",
    "wing","winter","wire","wise","wish","with","within","without","wolf","women",
    "won","won't","wonder","wonderful","wood","wooden","wool","word","wore","work",
    "worker","world","worried","worry","worse","worth","would","wouldn't","wrapped","write",
    "writer","writing","written","wrong","wrote","yard","year","yellow","yes","yesterday",
    "yet","you","you'd","you'll","you're","you've","young","younger","your","yourself",
    "youth","zero","zoo"
];
