

describe('calc letters per minute function', function(){

  it('should return 0 if no words have been typed', function(){

    // arrange  ... global vars
    game = {}; game.time = {}; game.time.now = 10000;  // mock game
    letterTimer = 11000;   // for example
    letterCounter = 0

    // act
    var lpm = calcLettersPerMinute();
    // assert

    expect(lpm).to.be.equal(0)

  });

  it('should compute and return the letters per minute', function() {

    // arrange  ... global vars
    game = {}; game.time = {}; game.time.now = 20000;  // mock game
    letterTimer = 10000;   // for example
    letterCounter = 4   // letters typed in this time period (?)

    // If my understanding of the math is correct, 20000ms = 20 seconds
    // so user is typing 12 letters per minute

    // act
    var lpm = calcLettersPerMinute();

    // assert
    expect(lpm).to.be.equal(12);


  })

})
