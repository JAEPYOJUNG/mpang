"db": "C:/html5project/MongoDB/Server/3.4/bin/mongod --dbpath c:/html5project/mongodb/data"

$ git push heroku master
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Delta compression using up to 8 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (2/2), 260 bytes | 260.00 KiB/s, done.
Total 2 (delta 1), reused 0 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote:
remote: -----> Node.js app detected
remote:
remote: -----> Creating runtime environment
remote:
remote:        NPM_CONFIG_LOGLEVEL=error
remote:        NODE_ENV=production
remote:        NODE_MODULES_CACHE=true
remote:        NODE_VERBOSE=false
remote:
remote: -----> Installing binaries
remote:        engines.node (package.json):  unspecified
remote:        engines.npm (package.json):   unspecified (use default)
remote:
remote:        Resolving node version 10.x...
remote:        Downloading and installing node 10.14.2...
remote:        Using default npm version: 6.4.1
remote:
remote: -----> Restoring cache
remote:        - node_modules
remote:
remote: -----> Building dependencies
remote:        Installing node modules (package.json + package-lock)
remote:        audited 191 packages in 1.188s
remote:        found 0 vulnerabilities
remote:
remote:
remote: -----> Caching build
remote:        - node_modules
remote:
remote: -----> Pruning devDependencies
remote:        audited 191 packages in 1.053s
remote:        found 0 vulnerabilities
remote:
remote:
remote: -----> Build succeeded!
remote: -----> Discovering process types
remote:
remote:  ~     Mis-cased procfile detected; ignoring.
remote:  ~     Rename it to Procfile to have it honored.
remote:
remote:        Procfile declares types     -> (none)
remote:        Default types for buildpack -> web
remote:
remote: -----> Compressing...
remote:        Done: 20.3M
remote: -----> Launching...
remote:        Released v5
remote:        https://mojirida.herokuapp.com/ deployed to Heroku
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/mojirida.git
   3f99133..4306d6b  master -> master
