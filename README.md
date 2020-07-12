# React Fastify Mongo Typescript demo #

### Dependencies ###
* Docker v.19.03.8 or higher
* Node.js version 14.1.0 or higher (for any kind of custom actions with the app)

### Quick start ###
```javascript
docker-compose up
```
* After build and init server is listening on port `8081`
* Open `http://localhost:8081`

### Description ###
Client/server demo application. An attempt to create user friendly UI for big/nested data structures (inspired by http://imagenet.stanford.edu/synset?wnid=n02486410). UI is focused on presenting only most important information. Data are being sent in chunks.

### Technology stack ###
* React.js (client) 'unbundled' (used as JS modules) with Snowpack
* Fastify (server)
* MongoDB (database)
* Typescript (client side - type checking)

#### Why those technologies? ####
All starts with data. MongoDB has been selected for huge possibilities with working on flat data structures (indexes, searching, easy inserting/deleting etc.).
Fastify deliveres quick, simple and reliable solutions for creating simple and fast server side apps.
React.js is a top tool for working with dynamic data on the client side.
Typescript helps to maintain the app.
