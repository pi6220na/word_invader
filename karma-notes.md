## Karma tests

### break the client-side javascript into individual files.

Karma can then read individual files without needing to instantiate the entire game

### install, in the dev dependencies:

* karma
* mocha
* chai
* karma-mocha
* karma-chai

for example, with

`npm install --save-dev karma`


### install karma-cli

`nmp i -g karma-cli`

### make a directory for tests

Create test files.

Common convention to call tests origininalfile.test.js but this isn't required.

### Create karma config file

karma.conf.js in this example. Point it to the test files, also include the code-to-be-tested in the `files` attribute. Can use wildcards, so

`files = [ ' tests/*.tests.java ' ]`

will read all the files utils.tests.java, game.test.java, etc.  

### Describe it

Mocha is for structuring your tests with describe() and it()  describe() creates a set of related tests, it() is for one individual test.

Chai is the assertion library, provides the expect methods for testing if a thing is equal/not equal/contains etc... another thing.

See mocha docs for describe() and it() and other methods.
See chai docs for assertions, e.g. `expect(thing).to.be.equal('another thing')`

### run tests

`karma start`

You might need to open your browser at the link given by karma to run the tests, (the browser's JS engine is used to excute the js?? not sure about that.)

### Arrange, act, assert

Typical unit tests *arrange* the scenario, take some *act*ion, *assert* the correct thing happened. We've been doing this in python, junit etc... 
