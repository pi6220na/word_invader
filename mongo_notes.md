## Starting Mongo DB to run a Mongo DB Server:

mongod --dbpath X:\path

Starting the Mongo shell to view the DB in question:

from a command prompt:

- mongo
- use admin
- db.auth('dbUser','456def')
- show db
- use snake
- show collections
- db.users.find().pretty()


 Start word_invader.js node server running in WebServer

 go to a browser window and type in localhost:3000 to launch the snake game

## Mongo Database Setup

- use admin
- db.createUser({user:"myUserAdmin",pwd:"abc123",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})
- db.createUser({user:"dbUser",pwd:"456def",roles:[{role:"readWrite",db:"invade"}]})
- db.auth('myUserAdmin','123abc')
- use admin
- switched to db admin
- show dbs
- show collections
- db.admin.find()
- db.system.users.find()



