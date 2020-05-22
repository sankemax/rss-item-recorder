# Rss Item Recorder
It's a web-app I wrote in collaboration with [Hanan Cohen](https://twitter.com/hananc) who requested me to re-create the site after the previous iteration - Blogim.info - was struggling to survive.


I've written the [frontend](https://github.com/sankemax/blogim-react-ts) separately.

## Internals
To collect blog feeds, I use "davereader" which I configured to store as little information on the file system as possible. I emit the feeds with node events and write to sqlite3 DB.

Currently, the application writes information to an sqlite DB on the machine it operates on. The reason is that we didn't want to pay extra money for cloud DB hosting.
Also, since the project was developing rapidly, I've made a lot of changes to the DB and needed to see the reflection immediately, so it was easy to delete and re-create the DB at will.

It is possible that in the future, a more stable version of the site will emerge and more means will be allocated to the project. We could consider changing to cloud solution and other DBs like MongoDB.
In that regard, since the application is well layered, I assume changing the implementation to another DB will be fairly easy.

## Available Scripts

In the project directory, you can run:

### `npm run start:dev`

Runs the app in development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.<br />
It uses babel.

Your app is ready to be deployed!
