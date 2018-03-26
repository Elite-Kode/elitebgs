# Contribute to Elite BGS

Thank you for contributing to this project. All contributions are welcome. But for the sake of sanity please follow the guidlines for contribution.

## Requirements

1. NodeJS v8.9.0 (Carbon) and above
2. MongoDb 3.2 and above
3. Bugsnag API token
4. Discord API token and secret
5. `secrets.js` file placed alongside `server.js`
6. Git
7. Github account
8. (Optional) A good IDE or code editor

## Setup

* Make sure MongoDB is installed and running.
* Create 2 databases in the mongodb instance, `eddb_api` and `elite_bgs`.
* Fork and then clone the repo using `git clone git@github.com:[your-username]/elitebgs.git`.
* Make sure you checkout the `master` branch first.
* Create a new branch to work on using `git checkout -b [name-of-your-new-branch]`.
* Run `npm i` to install all the dependencies.
* Create a file alongside `server.js` called `secrets.js`. This file will contain all the secret tokens used by the project. The file needs to have the following content. Make sure to verify that MongoDB is running at port 27017. If not, change here accordigly.
  ```
  "use strict";
  let eddb_api_db_user = "[username for eddb_api db]";
  let eddb_api_db_pwd = "[password for eddb-api db]";
  module.exports.eddb_api_db_url = `mongodb://${eddb_api_db_user}:${eddb_api_db_pwd}@localhost:27017/eddb_api`;

  let elite_bgs_db_user = "[username for elite_bgs db]";
  let elite_bgs_db_pwd = "[password for elite_bgs db]";
  module.exports.elite_bgs_db_url = `mongodb://${elite_bgs_db_user}:${elite_bgs_db_pwd}@localhost:27017/elite_bgs`;
  module.exports.bugsnag_token = "[Bugsnag token]";

  module.exports.session_secret = "[a secret for express-session]";

  module.exports.client_id = '[Discord API client id]';
  module.exports.client_secret = '[Discord API client secret]';
  ```
* To execute the project run `npm run startdev`. This executes the project in development Environment. To test the production environment run `npm start`.

## Pushing changes

After you have made the necessary changes and committed them push them to your forked repository. Then create a pull request to the `master` base branch. I will review the PR and might ask to make changes before accepting them.
