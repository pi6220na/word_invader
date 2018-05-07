# MCTC Software Dev Capstone FINAL PROJECT
# Word Invaders
### May 8th, 2018

## Overview
This is a simple word game implemented on Phaser.io game engine and HTML/CSS/Javascript running on Node Express with MONGO Database. It is based on an example Phaser.io game Space Invaders. MIT Licence granted.

This is game first does a simple sign-on validation: user name, password (hash) is saved in a users/password collection.

The user sign-on, date/time stamp, high score, and level completed information is saved on the database in another collection. 

## Game Play
The game is played by typing the moving words completely before they hit the bottom of the screen. Mispelled words can be re-typed by hitting the enter key. The ESC key can be pressed at any time to advance to the next level. When all the words are typed, the user advances to the next level automatically. The speed that the words drop down the screen is increased with each level bump.

The original Space Invaders game is shown on another page, accessed by link at bottom of main page.

### Known Bugs
- A possible Phaser.io bug - occasionally words will be typed correctly, shot at, but not exploded. The missle seems to miss the word.

### Enhancements Needed
- The scoring sytem needs refinement. Currently it only scores 20 points per completed word, and 1000 points for end of round. Additional logic is needed to use words-per-minute as part of the score calcuation.
- The database information display and utilization could be improved, perhaps a separate page with a list of users and high scores.
- More game graphics can be added - different explosions and special effects can be added as the levels increase.
- Sound effects are needed.
- Background music is needed.
- More time to implement all this is needed :)


