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
Client/server application for demo purposes. An attempt to create an user friendly UI for big/nested data structures. UI is focused on presenting only most important information, served in chunks of data.

### Technology stack ###
* React.js (client) 'unbundled' (used as JS modules) with Snowpack
* Fastify (server)
* MongoDB (database)
* Typescript (type checking)

#### Why those technologies? ####
All starts with data. MongoDB has been selected for huge possibilities with working on flat data structures (indexes, searching, easy inserting/deleting etc.).
Fastify deliveres quick, simple and reliable solutions for creating simple and fast server side apps.
React.js is a top tool for working with dynamic data on the client side.
Typescript helps to maintain the app.

#### Why not to use Typescript on the server side? ####
Actually there's no reason not to do this - this has been done only for demo purposes.

