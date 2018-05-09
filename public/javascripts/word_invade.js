// This game is based on space invaders from examples on phaser.io
// MIT Licenced
// heavily modified by J. Wolfe 5/7/2018 MCTC Capstone Final Project
// built on top of framework from WebDev Final Project (Snake Game by Jeremy)

var game = new Phaser.Game(window.innerWidth*.9, window.innerHeight*.9, Phaser.AUTO, 'container', { preload: preload, create: create, update: update, render: render });


// var canvas = document.getElementById('myCanvas');
// canvas.width = window.innerWidth * .8;
// canvas.height = window.innerHeight * .8;

// canvas.width = rectangle1.clientWidth * .9;
// canvas.height = rectangle1.clientHeight * .9;


// This runs once at beginning when loaded
function preload() {

    game.load.image('bullet', 'images/bullet.png');
    game.load.image('enemyBullet', 'images/enemy-bullet.png');
    game.load.spritesheet('invader', 'images/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'images/player.png');
    game.load.spritesheet('kaboom', 'images/explode.png', 128, 128);
    game.load.image('starfield', 'images/starfield.png');
    game.load.image('diamond', 'images/diamond.png');
    game.load.image('background', 'images/background2.png');
    game.load.bitmapFont('desyrel', 'images/desyrel.png', 'images/desyrel.xml');
    game.load.bitmapFont('carrier', 'images/carrier_command.png', 'images/carrier_command.xml');

}

// Game Globals
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

var keyEsc;

var level = 1;
var speed = 100;

var dropTimer = 0;
var dropDelay = 1500;       // was 2000
var dropDistance = 10;   // was 10 distance words (aliens) drop at each tic of the dropTimer


// initializes various game objects and builds data structures as needed
function create() {

    // Add keyboard events
    document.addEventListener("keypress", onKeyPress);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.setBoundsToWorld();

    //game.world.setBounds(0,0, window.innerWidth*.9, (window.innerHeight*.9)); // was height-30
    //game.world.setBounds(0,0, window.innerWidth*.9, window.innerHeight*.9);
    game.world.setBounds(0,0, game.width, game.height-40);

    // console.log('window inner width ' + window.innerWidth + ' window inner height' + window.innerHeight);
    // console.log('window inner width*.9 ' + window.innerWidth*.9 + ' window inner height*.9' + window.innerHeight*.9);
    // console.log('canvas width ' + canvas.width + ' canvas height ' + canvas.height);
    // console.log('game width ' + game.width + ' game height ' + game.height);
    // console.log('world width ' + game.world.width + ' world height ' + game.world.height);
    // console.log('world width bounds' + game.world.bounds.width + ' world height bounds' + game.world.bounds.height);

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
    countLstring = 'Letters/min (ttl): ';
    countLetter = 0;
    countLetterText = game.add.text((game.world.width/7)*2, game.world.height, countLstring + countLetter, { font: '34px Arial', fill: '#fff' });

    // words per minute
    countWstring = 'Words/min (ttl): ';
    countWord = 0;
    countWordText = game.add.text((game.world.width/7)*4, game.world.height, countWstring + countWord, { font: '34px Arial', fill: '#fff' });

    // crashed words (hit bottom of world)
    crashCstring = 'Crashed: ';
    crashCount = 0;
    crashStringText = game.add.text((game.world.width/7)*6, game.world.height, crashCstring + crashCount, { font: '34px Arial', fill: '#fff' });

    // set canvas scores to zero
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

    // keyEsc to reset game at any point
    keyEsc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);


    // populate html fields using jquery

    var levelString;
    levelString = level;
    $('#gameLevel').html(levelString);

    var speedString;
    speedString = speed;
    $('#speed').html(speedString);

    $('#huser').html(logs[0].local.username);

    $('#dbHighScore').html(logs[0].highScore);

    $('#dbHighLevel').html(logs[0].highLevel);

    $('#dbHighDate').html(logs[0].highDate.substr(0, 10));


}


// this function generates a list of 24 words (sprites).
function createAliens () {

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

// original function not used
function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.y += dropDistance;

}

// this function cycles every game loop (60 times a second ? )
function update() {

    // reset game
    if (keyEsc.isDown) {
        restart();
    }

    //  Scroll the background
    starfield.tilePosition.y += 2;

    if (game.time.now > dropTimer) {
        descend();
        dropTimer = game.time.now + dropDelay;   // was 2000
    }

    if (player.alive)
    {

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

// this function blows up an alien (word) and restarts if no more words
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
        scoreText.text = String(score);

        scoreString = score;
        console.log('scoreString = ' + scoreString + ' scoreText.text = ' + scoreText.text);
        $('#scorethis').html(scoreString);


        enemyBullets.callAll('kill',this);
        stateText.text = "      Level Complete, \n Click/enter for next Level";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);

        //enter key also restarts game
        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // keyEnter.onDown.add(console.log('enter key is pressed'));
        keyEnter.onDown.add(restart, this);

    }

}




// this function gets a letter and matches it to all words (aliens). If alien word completely spelled then
// the alien (word) is exploded and the word is removed from the word array.
function markLetters(stringIn) {

    word_in_progress = word_in_progress.concat(stringIn);

    //print text at top of screen
    letter = letter.concat(stringIn);
    typedText.text = typedString + letter;

    letterCounter++;

    updateLetterCounter()

    //letterTimer = game.time.now;

    // console.log('time now ' + game.time.now);
    // console.log('letterTimer ' + letterTimer);
    // console.log('letterCounter ' + letterCounter);
    // console.log(((game.time.now - letterTimer) / letterCounter));

    //console.log('wordsInArray : ' + wordsInArray );

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


// when typing letters many words can match (usually just the first one or two letters)
// this function resets all the words back to default color in preparation for the next letter to be typed
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


// change color of letter(s) of word to indicate that it has been typed by the user
function changeLetters(word_in_progress, x) {

    // extract word from array
    var myWord = aliens.children[x];

    for (var j = 0; j < word_in_progress.length; j++) {
        //myWord.text.charAt(j).tint = 0x555555;
        myWord.addColor('#ff0000', j);
        myWord.addColor('#ffff00', j+1);
    }

    aliens.children[x] = myWord;

}


// this function shoots down an alien (word)
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

    // recalculate words per minute
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


// not used yet
function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = String(score);

    // html score
    scoreString = score;
    $('#scorethis').html(scoreString);


    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    //console.log(String(aliens.countLiving()));

    if (aliens.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = String(score);

        scoreString = score;
        console.log('scoreString = ' + scoreString  + ' scoreText.text = ' + scoreText.text);
        $('#scorethis').html(scoreString);


        enemyBullets.callAll('kill',this);
        stateText.text = "      Level Complete, \n Click/enter for next Level";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);

        //enter key also restarts game
        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // keyEnter.onDown.add(console.log('enter key is pressed'));
        keyEnter.onDown.add(restart, this);

    }

}


// not used yet
function collisionOne (alien) {

    //  When a bullet hits an alien we kill them both
    //bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = String(score);

    scoreString = score;
    console.log('scoreString = ' + scoreString  + ' scoreText.text = ' + scoreText.text);
    $('#scorethis').html(scoreString);


    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() === 0)
    {
        score += 1000;
        scoreText.text = String(score);

        scoreString = score;
        console.log('scoreString = ' + scoreString  + ' scoreText.text = ' + scoreText.text);
        $('#scorethis').html(scoreString);


        enemyBullets.callAll('kill',this);
        stateText.text = "      Level Complete, \n Click/enter for next Level";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);

        //enter key also restarts game
        var keyEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        // keyEnter.onDown.add(console.log('enter key is pressed'));
        keyEnter.onDown.add(restart, this);

    }

}


// not used yet
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

}

// not used yet
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


// not used yet
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

// not used yet
function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}


// resets game for next level
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


    HighScore = score;
    HighLevel = level;
    updateDatabase(HighScore, HighLevel)


    level++;
    var levelString;
    levelString = level;
    $('#gameLevel').html(levelString);

    speed+=100;
    var speedString;
    speedString = speed;
    $('#speed').html(speedString);

    // bump up the speed
    dropDelay-=100;       // decrease to speed up words moving down the screen
    dropDistance+=5;   //  increase distance words (aliens) drop at each tic of the dropTimer

}


// Keyboard event handler - gets the key character code e.g. lowercase a = 97
function onKeyPress(e) {

    var myKey = e.which;

    var alpha = 'abcdefghijklmnopqrstuvwxyz'
    var actionKeys = alpha + alpha.toUpperCase() + ".'"

    var character = String.fromCharCode(myKey)

    if (actionKeys.includes(character)) {
      markLetters(character);
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



// code copied from last Fall's WebDev final project
function updateDatabase (HighScore, HighLevel) {
    console.log(' in updateDatabase logs._id = ' + logs[0]._id);
    console.log(' in updateDatabase user.local = ' + user.local);
    console.log(' in updateDatabase highScore = ' + HighScore);
    console.log(' in updateDatabase highlevel = ' + HighLevel);

    // this first ajax method updates the database with the new high score for the player
    $.ajax({
        method: "POST",
        url: "/update",
        //data: { _id: logs[0]._id, highScore: HighScore, highDate: Date.now() }
        data: { _id: logs[0]._id, highScore: HighScore, highDate: new Date(), highLevel: HighLevel },
    }).done (function(msg) {
        console.log('ajax success');

        //console.log('ajax success' + msg);
        //for (item in data) {
        //    console.log('snakegame item = ' + item + ' data[item] = ' + data[item]);
        // }

        // ajax method embedded within successful completion of first ajax update call to database
        // because we need to wait until the database has a chance to update before proceeding to next
        // database operation. This is a prime example of the useage of callback logic structure.

        console.log('about to call /reload, username = ' + logs[0].local.username);
        $.ajax({
            method: "POST",
            url: "/reload",
            data: { username: logs[0].local.username }
        }).done (function(msg) {

            // all these variable manipulations done here within the ajax method to do the asynchronous delay
            // in response back from the database. javascript will zoom ahead of the db returning data thus
            // making the html updates meaningless. putting the html updates here forces the code to update within
            // the callback.
            console.log('ajax second success');
            //console.log('ajax second success' + msg);
            //for (item in msg) {
            //    console.log('snakegame msg = ' + item + ' msg[item] = ' + msg[item]);
            //}
            passed_user = JSON.parse(msg.user);
            passed_logs = JSON.parse(msg.logs);  // logs is returned as an object within an array
            var rv = {};
            for (var i = 0; i < passed_logs.length; ++i) {
                rv[i] = passed_logs[i];
            }

            /*
            console.log('');
            console.log('passed_user = ' + JSON.stringify(passed_user));
            console.log('passed_logs = ' + JSON.stringify(passed_logs));
            */

            user.highScore = passed_user.highScore;
            user.highDate = passed_user.highDate;
            user.local.username = passed_user.local.username;
            logs[0].local.username = passed_logs[0].local.username;
            logs[0].highScore = passed_logs[0].highScore;
            logs[0].highDate = passed_logs[0].highDate;
            logs[0].highLevel = passed_logs[0].highLevel;


            /*
            console.log('')
            console.log('passed_logs.highScore = ' + logs[0].highScore);
            console.log('passed_logs.highDate = ' + logs[0].highDate);
            console.log('');
            console.log('user.highScore = ' + user.highScore);
            console.log('user.highDate = ' + user.highDate);
            console.log('logs[0].highScore = ' + logs[0].highScore);
            console.log('logs[0].highDate = ' + logs[0].highDate);
            */

            if (user.highDate === null || user.highDate === undefined) {
                user.highDate = new Date().toDateString();
            }
            if (logs[0].highDate === null || logs[0].highDate === undefined) {
                logs[0].highDate = new Date().toDateString();
            }

            // $('#highestscore').html(user.highScore);
            // $('#hDate').html(user.highDate.substr(0, 10));
            // $('#hUser').html(user.local.username);
            //
            // $('#highestuserscore').html(logs[0].highScore);
            // $('#hdate').html(logs[0].highDate.substr(0, 10));
            // $('#huser').html(logs[0].local.username);
            // $('#huser1').html(logs[0].local.username);

        }).fail(function (xhr,status,error) {
            console.log("ajax Second Post error:");
            console.log('xhr = ' + JSON.stringify(xhr));
            console.log('status = ' + status);
            console.log('error = ' + error);
        });

    }).fail(function (xhr,status,error) {
        console.log("ajax Post error:");
        console.log('xhr = ' + JSON.stringify(xhr));
        console.log('status = ' + status);
        console.log('error = ' + error);
    });

    var passed_user = {};
    var passed_logs = {};

    // this ajax method gets the new highest score on the database as well as the player's highest score


    console.log('leaving updateDatabase');
}
