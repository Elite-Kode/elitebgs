# Contribute to Elite BGS

Thank you for contributing to this project. All contributions are welcome. But for the sake of sanity please follow the guidlines for contribution.

## Requirements

EliteBGS requires a few things to get going:

1. Git and Github account
2. NodeJS v8.9.0 (Carbon) and above
3. MongoDb 3.2 and above
4. Configure front end and back end secrets, with or without Discord and BugSnag integration

Both node.js and MongoDB must be installed and correctly working, otherwise these instructions may fail.

### Optional Requirements

- An IDE or code editor is highly recommended, preferably with node.js integration and debugger
- GitHub Desktop can make working with GitHub a lot easier on Windows or Mac platforms
- A Discord account if you want the EliteBGS server to notify you of admin events
- A Bugsnag account and API token if you want crash reporting and analysis

## Obtain source code and install dependencies

You will be working on your own version of the code, and submitting any changes via pull request. For more details see the bottom on this guide.

Fork and then clone the EliteBGS repo

    ```console
    foo@bar:~$ git clone git@github.com:[your-username]/elitebgs.git
    ```

Install dependencies

    ```console
    foo@bar:~$ cd elitebgs
    foo@bar:~$ npm i
    ```

See below on how to contribute using branches and pull requests.

## Configure MongoDB

- Make sure [MongoDB](https://www.mongodb.com/what-is-mongodb) is installed and running on the default port 27017
- Enabling [access control](https://docs.mongodb.com/manual/tutorial/enable-authentication/) is highly recommended and essential for production environments
- Create a database in the mongodb instance, `elite_bgs`, and a collection called `configs`
- Add a single document in the `configs` collection with the following data:

  ```json
    { 
        "time_offset" : 60000, 
        "guild_id" : "", 
        "admin_channel_id" : "",
        "user_role_id" : "", 
        "blacklisted_software" : [], 
        "version_software" : []
    }
  ```

- `time_offset` is an integer, where records older than that many milliseconds will be rejected
- `guild_id` If using Discord, your guild (server) ID, otherwise blank
- `admin_channel_id` If using Discord, the channel ID you'd like EliteBGS admin notifications, otherwise blank
- `user_role_id` If using Discord, the Discord role ID that EliteBGS admin notifications should use, otherwise blank
- `blacklisted_software` is an array of software that cannot submit data to EliteBGS. Example format (the apps may or may not be bad, just an example):

  ```json
    { 
        ...
        "blacklisted_software" : [
            "^ed-ibe (api)$", 
            "^ed central production server$",
            "^eliteocr$", 
            "^regulatednoise__dj$", 
            "^ocellus - elite: dangerous assistant$", 
            "^eva"
        ], 
        ...
    }
  ```

- `version_software` is an array of software that is too old to submit data to EliteBGS. Example format:

  ```json
    { 
        ...
        "version_software" : [
            {
                "name" : "E:D Market Connector [Windows]",
                "version" : "2.4.2.0"
            }, 
            {
                "name" : "E:D Market Connector [Linux]", 
                "version" : "2.4.2.0"
            }
        ]
    }
  ```

If you're not going to use blacklisted software in your testing, you can leave `blacklisted_software` and `version_software` as empty arrays as in the first definition.

## Configure Back End

Create a file in the main directory alongside `server.js` called `secrets.js`, which will contain all your secret tokens used by the back end. These are sensitive and unique to you, so don't check them in.

The new `secrets.js` file needs to have the following content:

  ```js
  "use strict";
  let elite_bgs_db_user = "[username for elite_bgs db]";
  let elite_bgs_db_pwd = "[password for elite_bgs db]";
  module.exports.elite_bgs_db_url = `mongodb://${elite_bgs_db_user}:${elite_bgs_db_pwd}@localhost:27017/elite_bgs`;

  module.exports.session_secret = "[a secret for express-session]";

  module.exports.discord_use = [true/false];
  module.exports.discord_token = "[Discord bot token]";
  module.exports.client_id = '[Discord API client id]';
  module.exports.client_secret = '[Discord API client secret]';

  module.exports.bugsnag_use = [true/false];
  module.exports.bugsnag_token = "[Bugsnag token for backend express app]";
  module.exports.bugsnag_sourcemap_send = [true/false];

  ```

- `elite_bgs_db_user` if you have set up MongoDB access control (mandatory in production environments), the username for the elite_bgs collection, or blank in development
- `elite_bgs_db_pwd` if you have set up MongoDB access control (mandatory in production environments), the password for the elite_bgs collection, or blank in development
- `elite_bgs_db_url` Elite BGS assumes a local MongoDB installation on port 27017. Change this if you have a cloud or different MongoDB configuration
- `session_secret` is a random value. Create a random password using a password generator. Don't change it or your users will need to log in again
- `discord_use` enables Discord if set to true, set to false otherwise
- `client_id` is your application's Discord Client ID, leave it blank otherwise
- `client_secret` is your application's Discord Client Secret, leave it blank otherwise
- `discord_token` is the bot public key, leave it blank otherwise
- `bugsnag_use` enables BugSnag if set to true, set to false otherwise
- `bugsnag_token` is your BugSnag API key, set it to a fake MD5 string otherwise
- `bugsnag_sourcemap_send` will send extra data to BugSnag is set to true, set it false if you don't want this

## Configure Front End

Create a file in the `src/` directory alongside `main.ts` called `secrets.ts`, which will contain all the secret tokens used by the frontend. These contain a random secret for the router (not currently used), and your BugSnag API key, so don't check them in.

The new `secrets.ts` file needs to have the following content:

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

- `auth` is not currently used, and can be anything
- `use` when true, enables BugSnag. Set it to `false` if not needed
- `token` is an optional BugSnag token, make it some random value if not needed


> **Security notice:** Do not add or commit your secrets to Git.

## Optional Integrations

EliteBGS has two integrations, Discord to send admin notifications, and BugSnag to capture and analyze errors.

### Discord notification integration

Elite BGS can send admin notifications to a Discord server (guild). THIS IS NOT BGSBOT. The EliteBGS front end uses Discord for user authentication, but you don't need this integration to make that work.

If you want to integrate with Discord:

- [Setup a Discord application](https://discord.com/developers/applications), enable developer mode, [create a bot application](https://www.writebots.com/discord-bot-token/), and follow the instructions to find your Discord user's client_id and client_secret, and the Discord bot token for the application
- In secrets.js, set `discord_use` to `true`
- In secrets.js, copy your Discord application's Client ID to `client_id`, Client Secret to `client_secret`, and Public Key to `discord_token`. You can find this under Developer Portal -> My Applications -> \<application name\>
- In MongoDB, change the following values in the configs collection:
  - `guild_id` The [guild (server) ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
  - `admin_channel_id` The [channel ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) you'd like EliteBGS admin notifications
  - `user_role_id` The [Discord role ID](https://discordhelp.net/role-id) that EliteBGS admin notifications should use. @everyone is fine, but you may wish to use [something custom](https://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-Permissions-), such as write only permissions.

If you don't want to use Discord:

- In secrets.js, set `discord_use` to `false`. The other Discord related settings can be blank
- In MongoDB set `guild_id`, `admin_channel_id`, `user_role_id` to blank in the configs collection. 

> **Security notice:** Do not add or commit your secrets to Git.

### BugSnag Integration

BugSnag is an error capture and analysis platform. This is great for production, but as you have access to errors in the console, so it's not necessary for development unless you're testing BugSnag integration or fixing issues with BugSnag. If you are using the free Lite tier, it has limited events per day. If you are in development mode, consider only using BugSnag integration if you intend to work on or test BugSnag related functionality.

If you want to use BugSnag, create a BugSnag account, an application, and obtain the API key.

- In secrets.js, set `bugsnag_use` and `bugsnag_sourcemap_send` to `true`
- In secrets.js, set `bugsnag_token` to your BugSnag application API key
- In secrets.ts, set `Bugsnag.use` to `true`, and `token` to your BugSnag application API key

If you don't want to use BugSnag, and rely on the console or your debugger instead:

- In secrets.js, set `bugsnag_use` and `bugsnag_sourcemap_send` to `false`
- In secrets.js, set `bugsnag_token` to a random MD5 value
- In secrets.ts, set `Bugsnag.use` to `false`, and `token` to a random MD5 value

> **Security notice:** Do not add or commit your secrets to Git.

### Start the project

To execute the project run in local development mode:

`npm run startdev`

To execute the project in production mode:

`npm start`.

## Contributing fixes and enhancements back to EliteBGS

EliteBGS is an open source project, and relies upon contributors such as yourself fixing issues or creating new features for the benefit of all. Elite BGS follows common GitHub industry practices, which includes that new fixes or features should be in their own branch and committed via a pull request. GitHub has many excellent articles on how to install and get going with pull requests and branches.

### Working on a branch

Find an issue you want to fix or enhance, and let folks know that you want to work on it. Create a new branch for your issue or enhancement:

`git checkout -b [name-of-your-new-branch]`

### Create a pull request for your issue fix or enhancement

After you have made the necessary changes and committed them, push them to your forked repository. Then create a pull request to the `master` base branch.

I will review the PR and might ask to make changes before accepting them.
