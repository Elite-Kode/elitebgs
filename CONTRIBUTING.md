# Contribute to Elite BGS

Thank you for contributing to this project. All contributions are welcome. But for the sake of sanity please follow the guidlines for contribution.

## Requirements

1. NodeJS v8.9.0 (Carbon) and above
2. MongoDb 3.2 and above
3. Bugsnag API token (optional)
4. Discord API token and secret
5. Discord Bot token for same application (optional)
6. `secrets.js` file placed alongside `server.js`
7. Git
8. Github account
9. (Optional) A good IDE or code editor

## Setup

* Make sure MongoDB is installed and running.
* Create a database in the mongodb instance, `elite_bgs`.
* Fork and then clone the repo using `git clone git@github.com:[your-username]/elitebgs.git`.
* Make sure you checkout the `master` branch first.
* Create a new branch to work on using `git checkout -b [name-of-your-new-branch]`.
* Run `npm i` to install all the dependencies.
* Create a file alongside `server.js` called `secrets.js`. This file will contain all the secret tokens used by the project. The file needs to have the following content. Make sure to verify that MongoDB is running at port 27017. If not, change here accordigly.
  ```js
  "use strict";
  let elite_bgs_db_user = "[username for elite_bgs db]";
  let elite_bgs_db_pwd = "[password for elite_bgs db]";
  module.exports.elite_bgs_db_url = `mongodb://${elite_bgs_db_user}:${elite_bgs_db_pwd}@localhost:27017/elite_bgs`;

  module.exports.session_secret = "[a secret for express-session]";

  module.exports.client_id = '[Discord API client id]';
  module.exports.client_secret = '[Discord API client secret]';

  module.exports.bugsnag_token = "[Bugsnag token for backend express app]";
  module.exports.bugsnag_sourcemap_send = [true/false];
  module.exports.bugsnag_use = [true/false];

  module.exports.discord_token = "[Discord bot token]";
  module.exports.discord_use = [true/false];
  ```
* `client_id` and `client_secret` is needed for Discord auth.
* `bugsnag_sourcemap_send` is used to determine whether to send the compiled sourcemaps to bugsnag or not. You would need it in production but not in development.
* You can set `bugsnag_use` to `false` to disable the use of Bugsnag altogether. In that case make sure to still populate `bugsnag_token` and `bugsnag_sourcemap_send` with dummy values.
* `discord_token` is used for generating a Discord bot alongside the server. THIS IS NOT BGSBOT. This bot is used for admin level notification purposes. You can disable this bot by setting `discord_use` to `false`. 
* Create a file in the `src` directory, alongside `main.ts` called `secrets.ts`. This file will contain all the secret tokens used by the frontend. The file needs to have the following content.
  ```ts
  class RouteAuth {
      public static readonly auth: string = '[Generated Secret]';
  }

  class Bugsnag {
      public static readonly token: string = '[Bugsnag token for frontend angular app]';
      public static readonly use: boolean = [true/false]
  }

  export { RouteAuth, Bugsnag };
  ```
* You can set `Bugsnag.use` to `false` to disable Bugsnag.
* You also need to create a collection in the DB called `configs`. Add a single document in that collection with the following data
  ```json
  { 
      "guild_id" : "[Discord guild id where you want the website bot to notify]", 
      "admin_channel_id" : "[Discord channel id where you want the website bot to notify", 
      "time_offset" : NumberInt([the number offset in milliseconds for rejecting old records]), // Example: "time_offset" : NumberInt(60000),
      "blacklisted_software" : [
          "^ed-ibe (api)$", 
          "^ed central production server$", // These are examples
          "^eliteocr$", 
          "^regulatednoise__dj$", 
          "^ocellus - elite: dangerous assistant$", 
          "^eva"
      ], 
      "version_software" : [
          {
              "name" : "E:D Market Connector [Windows]", // List of software versions to check against. Versions below these wont be accepted
              "version" : "2.4.2.0"
          }, 
          {
              "name" : "E:D Market Connector [Linux]", 
              "version" : "2.4.2.0"
          }
      ], 
      "user_role_id" : "[Discord role id for new members in the Discord server]"
  }
  ```
* In the above, `guild_id`, `admin_channel_id` and `user_role_id` can be omitted if `discord_use` was set to false in `secrets.js`. `blacklisted_software` and `version_software` can be empty arrays.
* To execute the project run `npm run startdev`. This executes the project in development Environment. To test the production environment run `npm start`.

## Pushing changes

After you have made the necessary changes and committed them push them to your forked repository. Then create a pull request to the `master` base branch. I will review the PR and might ask to make changes before accepting them.
