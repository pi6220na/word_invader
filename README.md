# FinalProject
MCTC Web Client Server Web Dev FINAL PROJECT

This is a simple "snake" game implemented in HTML/CSS/Javascript running on Node Express with MONGO Database. 

It does a simple sign-on validation: user name, password (hash) is saved in a users/password collection.
The user sign-on, date/time stamp, high score, and comment (not fully implemented) information are saved on the database in another
collection. 

The game is played by pressing the space bar (or g key at the end of a game) to start the snake moving. Use the keyboad arrow keys to 
change the direction the snake is moving. Try to eat an apple to gain a point. Get 10 or more points and move to the next level (2). Hitting walls or the snake's own body ends the round. Five lives per game. You get an unlimited number of games to play. If you advance
to level 2, expect the snake speed to increase.

Work-in-progress but far from complete, adding in multi-player capability over the Internet using Sockets.IO to implement.
