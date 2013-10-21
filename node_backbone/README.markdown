## Introduction

This project should provide some basis to create your own webapplication under __node.js__ using [express.js](http://expressjs.com/) in 
combination with [backbone.js](http://documentcloud.github.com/backbone/).

## Getting started

1. Clone the project:

    `git clone git@github.com:jamuhl/express-backbone-boilerplate.git`
    
2. run `npm install`

3. start the app `node server.js`

4. direct your browser to [localhost:3000](http://localhost:3000) or [localhost:3000/test](http://localhost:3000/test) to run the tests

In order to use [jake](https://github.com/mde/jake) and [docco](http://jashkenas.github.com/docco/) you should global install the 
packages:

- npm install -g jake
- npm install -g docco

now you can run:

- `jake client:build`to concat and minify the JavaScripts for production use
- `jake doc` to create the documentation (output will be in build folder)

## Special thanks to

- __Nick Rabinowitz__ for inspiring me 'how to use backbone' in his [gapvis project](https://github.com/nrabinowitz/gapvis)
- __The team around twitter bootstrap__ for the excellent [work](http://twitter.github.com/bootstrap/)
- __Jim Newbery__ for his 3 posts about [Testing Backbone applications with Jasmine and Sinon](http://tinnedfruit.com/2011/03/03/testing-backbone-apps-with-jasmine-sinon.html)
- and all the others i missed



https://github.com/jamuhl/express-backbone-boilerplate
