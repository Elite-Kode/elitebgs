# Elite BGS Installation, Development, and Contribution Guide

Thank you for contributing to this project. All contributions are welcome. But for the sake of sanity, please follow the guidelines to contribute to Elite BGS.

## Requirements

Elite BGS requires a few things to get going:

1. Git and Github account
2. A recent Node.js LTS version, v12.18.2 (Erbium) and above
3. MongoDB 4.0 and above
4. Redis 6.2 (stable) and above
5. Configure secrets for `frontend`, `backend`, `eddn_listener`, `guild_bot` and `tick_listener`
6. A Discord account for OAuth authentication (required) and a Discord "guild" (server) if `guild_bot` is required

On the server or development workstation, Node.js, MongoDB, and Redis must be installed and correctly working. Otherwise, these instructions may fail. If you develop on Windows, you will need to install Redis in Windows Subsystem For Linux (WSL2), a Docker container, or a virtual machine, as there are no current native Windows ports.

Documentation to serve the `frontend` application scalably in production is not yet available. Documentation updates on how to do this on a single host or within a Dockerized environment such as Google Cloud Platform or Kubernetes are most welcome.

See below on how to contribute using branches and pull requests.

### Optional Requirements

- An IDE or code editor is highly recommended, preferably with Node.js integration and debugger
- GitHub Desktop can make working with GitHub a lot easier on Windows or Mac platforms
- `guild_bot` to send Elite BGS admin notifications to Discord
- A Bugsnag account and API token if you want crash reporting and analysis

## Install and configure servers

### Install node.js and npm

Download the latest stable version of Node.js for your platform, and let it install. After installation, restart your terminal or PowerShell window to ensure that Node.js is now on the default path and check that both these commands work:

```console
    foo@bar:~$ node -v
    v12.18.2
    foo@bar:~$ npm -v
    6.14.4
```

Update npm:

```console
    foo@bar:~$ npm update
```

### Install and Configure MongoDB

- Install [MongoDB](https://www.mongodb.com/what-is-mongodb), and use the default port 27017
- Enabling [access control](https://docs.mongodb.com/manual/tutorial/enable-authentication/) is essential for production environments and optional for development environments.
- Create a database in the MongoDB instance, `elite_bgs` containing a single collection called `configs`
- Add a single document in the `configs` collection with the following data:

 ```json
    { 
        "time_offset" : 60000, 
        "guild_id" : "", 
        "admin_channel_id" : "",
        "user_role_id" : "", 
        "blacklisted_software" : [], 
        "version_software" : [],
        "whitelisted_software" : []
    }
  ```

- `time_offset` is an integer, where `eddn_listener` will reject records older than that many milliseconds
- `guild_id` If using Discord admin notifications, your guild (server) ID, otherwise blank
- `admin_channel_id` If using Discord admin notifications, the channel ID you'd like Elite BGS admin notifications, otherwise blank
- `user_role_id` If using Discord admin notifications, the Discord role ID that Elite BGS admin notifications should use, otherwise blank
- `blacklisted_software` is an array of software that cannot submit data to Elite BGS. Example format (the apps may or may not be harmful, just an example):

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

- `version_software` is an array of software that is too old to submit data to Elite BGS. Example format:

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

- `whitelisted_software` is an array of the only softwares that can submit data to Elite BGS. Example format (the apps are trusted, just an example):

  ```json
    { 
        ...
        "whitelisted_software" : [
            "^E:D Market Connector.*$", 
            "^edd$"
        ], 
        ...
    }
  ```

If you're not going to use blacklisted software in your testing, you can leave `blacklisted_software`, `version_software` and `whitelisted_software` as empty arrays as in the first definition.

### Install Redis

For Mac or Linux systems, follow the instructions at [https://redis.io/download](https://redis.io/download) and install the most recent stable Redis on your system. Make sure it is enabled and started:

On most system.d based Linux flavors:

```console
    foo@bar:~$ sudo systemctl enable redis.service
    foo@bar:~$ sudo systemctl start redis.service
```

That's it. Redis has no configuration. As Redis, by default, has no authentication or access control, please do not allow it to listen on a port open to the Internet.

Installing on Windows requires installing the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) or using a [Docker Redis container](https://hub.docker.com/_/redis). We recommend the Debian WSL2 version, as it's probably the easiest to get going, but if you already have Docker running, that works. WSL2 installs Debian by default, so follow those instructions to get Redis running.

### Configuring Redis

Insert the following lines into `backend/secrets.js` to enable Redis caching:

```console
module.exports.redis_use = true;
module.exports.redis_host = 'localhost';
module.exports.redis_port = 6379;
module.exports.redis_password = '';
module.exports.redis_timeout = 300; // 5 minutes of cache time
```

If you don't want Redis caching, you only need a single line:

```console
module.exports.redis_use = false;
```

**Known issue:** If Redis is not running when backend starts or fails after the API has started, the backend API may stop responding. The code has checks for this, but the asynchronous connection behavior seems to create calls that never end despite an error occuring on the console. To resolve this, either restart Redis and then the backend service, or disabling redis in the configuration, and restart the backend.

## Obtain source code and install dependencies

Building Elite BGS is relatively straightforward if taken step by step. Being a more extensive app split into five parts, there's a bit more work than a typical demo or a smaller application.

### Fork and then clone the Elite BGS repo

```console
    foo@bar:~$ git clone git@github.com:[your-username]/elitebgs.git
```

### General structure of Elite BGS

There are five major components to Elite BGS:

- `backend` is the Elite BGS RESTful API Server and is written in Node.js, Express, Redis, and MongoDB. Backend is read-only; it relies upon other servers to update MongoDB collections.
- `eddn_listener` listens to the EDDN firehose via a socket. It parses messages it is interested in and stores them in various MongoDB collections. It will throw errors if it sees records it doesn't necessarily care about, but these are warnings and not fatal
- `frontend` is an Angular application written in TypeScript that is the user interface that most users are familiar with.
- `guild_bot` is a Node.js application that provides admin notifications to a Discord server run by you, an Elite BGS administrator. This is not BGS Bot - that's an entirely different project.
- `tick_listener` is a small node.js application that watches for ticks from Cmdr Phelbore's tick service. In the future, this code will likely adopt Cmdr Phelbore's code, but for now, it relies upon monitoring a socket to determine when the tick occurs.

### Install dependencies

Let's first get all the dependencies needed to build and run the underlying servers that run Elite BGS installed.

```console
    foo@bar:~$ cd elitebgs
    foo@bar:~$ cd backend
    foo@bar:~$ npm i
    foo@bar:~$ cd ../eddn_listener
    foo@bar:~$ npm i
    foo@bar:~$ cd ../frontend
    foo@bar:~$ npm i
    foo@bar:~$ cd ../guild_bot
    foo@bar:~$ npm i
    foo@bar:~$ cd ../tick_listener
    foo@bar:~$ npm i
```

Please address any errors you see, such as installing missing node modules, such as say `lodash` or similar. This may happen when the code demands a module that is not yet in package.json, but is needed:

```console
    foo@bar:~$ npm install --save <module> 
```

This will include the package in package.json as well as install it locally. This should then allow a clean `npm i' with no errors. Please [report missing packages as an issue](https://github.com/SayakMukhopadhyay/elitebgs/issues).

## Configure backend, eddn_listener, guild_bot and ticket_listener

### Create a secrets file

The secrets file is used by all Elite BGS components, including the front end, but we need it mainly for the back end services.

Create a new `secrets.js` file for each service in their respective folders with the following lines:

#### backend/secrets.js

```js
  "use strict";
  
  // Authenticated MongoDB (not default, strongly recommended in prod). Comment out if not using authentication
  module.exports.elite_bgs_db_user = "[username for elite_bgs db]";
  module.exports.elite_bgs_db_pwd = "[password for elite_bgs db]";
  
  module.exports.elite_bgs_db_url = "mongodb://localhost:27017/elite_bgs";

  module.exports.bugsnag_use = [true/false];
  module.exports.bugsnag_token = "[Bugsnag token for backend Express app]";
```

#### eddn_listener/secrets.js

```js
  "use strict";
  
  // Authenticated MongoDB (not default, strongly recommended in prod). Comment out if not using authentication
  module.exports.elite_bgs_db_user = "[username for elite_bgs db]";
  module.exports.elite_bgs_db_pwd = "[password for elite_bgs db]";
  
  module.exports.elite_bgs_db_url = "mongodb://localhost:27017/elite_bgs";

  module.exports.bugsnag_use = [true/false];
  module.exports.bugsnag_token = "[Bugsnag token for eddn_listener Express app]";
```

#### frontend/secrets.js

```js
  "use strict";
  
  // Authenticated MongoDB (not default, strongly recommended in prod). Comment out if not using authentication
  module.exports.elite_bgs_db_user = "[username for elite_bgs db]";
  module.exports.elite_bgs_db_pwd = "[password for elite_bgs db]";
  
  module.exports.elite_bgs_db_url = "mongodb://localhost:27017/elite_bgs";

  module.exports.bugsnag_token_angular = "[Bugsnag token for frontend Angular app]";
  module.exports.bugsnag_token = "[Bugsnag token for frontend Express app]";
  module.exports.bugsnag_sourcemap_send = [true/false];
  module.exports.bugsnag_use = [true/false];

  module.exports.session_secret = "[a secret for express-session]";
  module.exports.client_id = "[Discord API client id]";
  module.exports.client_secret = "[Discord API client secret]";

  // Change the port to 4013 (or any other configured port) when running production
  module.exports.discord_use = [true/false];
  module.exports.companion_bot_endpoint = "http://localhost:3013" 
```

#### guild_bot/secrets.js

```js
  "use strict";
  
  // Authenticated MongoDB (not default, strongly recommended in prod). Comment out if not using authentication
  module.exports.elite_bgs_db_user = "[username for elite_bgs db]";
  module.exports.elite_bgs_db_pwd = "[password for elite_bgs db]";
  
  module.exports.elite_bgs_db_url = "mongodb://localhost:27017/elite_bgs";
  
  module.exports.discord_token = "[Discord bot token]";

  module.exports.bugsnag_use = [true/false];
  module.exports.bugsnag_token = "[Bugsnag token for backend express app]";
```

#### tick_listener/secrets.js

```js
  "use strict";
  
  // Authenticated MongoDB (not default, strongly recommended in prod). Comment out if not using authentication
  module.exports.elite_bgs_db_user = "[username for elite_bgs db]";
  module.exports.elite_bgs_db_pwd = "[password for elite_bgs db]";
  
  module.exports.elite_bgs_db_url = "mongodb://localhost:27017/elite_bgs";

  module.exports.bugsnag_use = [true/false];
  module.exports.bugsnag_token = "[Bugsnag token for backend express app]";
```

- `elite_bgs_db_user` if you have set up MongoDB access control (mandatory in production environments), the username for the elite_bgs collection, or blank in development
- `elite_bgs_db_pwd` if you have set up MongoDB access control (mandatory in production environments), the password for the elite_bgs collection, or blank in development
- `elite_bgs_db_url` Elite BGS assumes a local MongoDB installation on port 27017. Change this if you have a cloud or different MongoDB configuration
- `session_secret` is a random value. Create a random password using a password generator. Please don't change it, or your users will need to log in again
- `discord_use` enables Discord `guild_bot` integration if set to true, set to false otherwise
- `client_id` is your application's Discord Client ID - this CANNOT be blank. See next section
- `client_secret` is your application's Discord Client Secret - this CANNOT be blank. See next section
- `discord_token` is the bot public key.
- `companion_bot_endpoint` is the endpoint where the `guild_bot` is running. Default dev port is `3013` and prod port is `4013`
- `bugsnag_use` enables BugSnag if set to true, set to false otherwise
- `bugsnag_token` is your BugSnag API key for each Express app. Please don't set it if `bugsnag_use` is `false`
- `bugsnag_token_angular` is your BugSnag API key for the Angular app. Please don't set it if `bugsnag_use` is `false`
- `bugsnag_sourcemap_send` will send sourcemaps of the built files to BugSnag if set to true. Set it false if you don't want this

NB: Although MongoDB access control is strongly recommended, MongoDB has significant password composition limitations. We suggest a long random alphanumeric password rather than a highly complex password because many punctuation characters, including `;` are not valid MongoDB passwords.

### Discord oAuth integration

Elite BGS frontend requires a valid oAuth2 redirect URL for your Discord server to be set up, allowing the `frontend` application to authenticate clients with Discord. Without OAuth URL redirection, Elite BGS `frontend` will not run.

- [Enable Discord developer mode](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
- Login to the [Discord Developer Portal Application](https://discord.com/developers/applications)
- Click Applications > New Application

> Call it something like "elitebgs-dev" or similar for development, and whatever you like in Production

- Navigate [Developer Dashboard](https://discord.com/developers/applications) > Applications > `elitebgs-dev` > OAuth2
- Click "Add Redirect" and use `http://localhost:3014/auth/discord/callback` for development, or `https://<yourElite BGSUrl>/auth/discord/callback` for production
- Grab the client ID next on the oAuth page, and add it to `module.exports.client_id` in `secrets.js`

[Reference for creating Discord applications](https://www.writebots.com/discord-bot-token/)

> **Security notice:** Do not add or commit secrets.js or your client ID to Git.

## Configure and build Elite BGS frontend

The front end is a bit more complicated than the other Elite BGS components, which can quickly be started after installing the necessary node modules. The frontend code must be built at least once by hand to get past an interactive question, and it relies upon Angular and TypeScript to be installed, so we must get those installed the first time we build the app.

### Configure Elite BGS frontend

Ensure the same `secrets.js` file installed above is at `frontend/secrets.js`. This is used to run a small node.js server used by the front end code for Discord oAuth integration and other frontend-y stuff.

Create a file called `frontend/src/secrets.ts` (should be at the same level as `main.ts`), which will contain all the secret tokens used by the Angular frontend. These include a random secret for the router (not currently used) and your private BugSnag API key.

The new `secrets.ts` file needs to have the following content:

```ts
class Bugsnag {
    public static readonly token: string = '[Bugsnag token for frontend angular app]';
    public static readonly use: boolean = [true/false]
}

export { Bugsnag };
```

- `use` when true enables BugSnag. Set it to `false` if not needed
- `token` is an optional BugSnag token. Please don't set it if `use` is `false`

> **Security notice:** Do not add or commit your secrets to Git.

### Build Elite BGS frontend

`frontend` is an Angular application written in TypeScript, and it needs to be transpiled into browser-friendly code. To do this, we first install Angular CLI and TypeScript command line tools, which the build process uses, and then build the code:

```console
    foo@bar:~$ cd elitebgs/frontend
    foo@bar:~$ npm install -g @angular/cli typescript
    foo@bar:~$ ng -v
         _                      _                 ____ _     ___
        / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
       / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
      / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
     /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                    |___/

    Angular CLI: 10.2.2
    Node: 12.16.3
    OS: win32 x64

    Angular: 10.2.4
    ...
    foo@bar:~$ tsc -v
    Version 4.2.3
```

If both `ng` and `tsc` work, we can go ahead and build frontend:

```console
    foo@bar:~$ npm run build
```

You will see a prompt on your first compile:

```console
    ? Would you like to share anonymous usage data about this project with the Angular Team at
    Google under Google's Privacy Policy at https://policies.google.com/privacy? For more details and how to change this setting, see http://angular.io/analytics. [y/N]
```

Opt-in or out as you wish, and it won't ask again, allowing `nodemon` to automatically work without further input during compilation, which can be a problem if you jump in and run startdev.

Please take care of any errors you see. Sometimes, two attempts are required to get a successful build. You may need to add more node modules locally to get it to build. In development, you will likely see warnings about the production environment not being used, and that's correct. Developers can generally ignore other alerts as long as the build succeeds. Feel free to submit a pull request to fix or address these warnings.

## Optional Integrations

Elite BGS has three optional integrations, Redis caching support detailed above, `guild_bot` to send admin notifications via Discord, and a commercial monitoring platform called BugSnag to capture and analyze errors.

### Send admin notifications via guild_bot

Elite BGS `guild_bot` can send admin notifications to a Discord server, also known as a guild. Elite BGS `frontend` uses Discord for OAuth authentication but doesn't need `guild_bot` 's optional integration to function, and `guild_bot` doesn't rely upon the oAuth redirection URL to work - they are separate and different. Elite BGS `guild_bot` is not [BGS Bot](https://github.com/SayakMukhopadhyay/bgsbot), which provides Discord channel commands to provide information to factions.

If you want to get admin notification via `guild_bot`:

1. In `frontend/secrets.js`, set `discord_use` to `true` and `companion_bot_endpoint` to the endpoint where the `guild_bot` server is running (default `http://localhost:3013`)
2. Navigate to Discord's [Application Dashboard](https://discord.com/developers/applications) > `elitebgs-dev` or `whatever` > General Information
3. Copy Client ID to `client_id`, Client Secret to `client_secret`, and Public Key to `discord_token` in secrets.js
4. In MongoDB, change the following values in the configs collection:

- `guild_id` The [guild (server) ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
- `admin_channel_id` The [channel ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) you'd like Elite BGS admin notifications
- `user_role_id` The [Discord role ID](https://discordhelp.net/role-id) that Elite BGS admin notifications should use. @everyone is fine, but you may wish to use [something custom](https://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-Permissions-), such as write only permissions.

If you don't want to use Discord:

- In `frontend/secrets.js`, set `discord_use` to `false`. `companion_bot_endpoint` can be left blank and `guild_bot` service need not be started
- In MongoDB set `guild_id`, `admin_channel_id`, `user_role_id` to blank in the configs collection.

> **Security notice:** Do not add or commit your secrets to Git.

### Monitor Elite BGS via BugSnag

BugSnag is an error capture and analysis platform. This is great for production, but as you have access to errors in the console, it's unnecessary for development unless you're testing BugSnag integration or fixing issues with BugSnag. If you are using the free Lite tier, it has limited events per day. If you are in development mode, consider only using BugSnag integration if you intend to work on or test BugSnag related functionality.

If you want to use BugSnag, create a BugSnag account, then an application, and obtain the application's API key.

You should create a separate application for each service. Also, the Express app in `frontend` should be a separate application from the `Angular` app.

In each `secrets.js` file in `backend`, `eddn_listener`, `frontend`, `guild_bot`, and `tick_detector` 

- set `bugsnag_use` to `true`
- set `bugsnag_token` to your BugSnag application API key
  
Additionally in `frontend/secrets.js`

- set `bugsnag_sourcemap_send` to `true`
- set `bugsnag_token_angular` to your BugSnag application API key generated for the Angular application

Additionally in `frontend/src/secrets.ts`

- set `Bugsnag.use` to `true`, and `Bugsnag.token` to your BugSnag application API key

If you don't want to use BugSnag, and rely on the console or your debugger instead:

In each `secrets.js` file in `backend`, `eddn_listener`, `frontend`, `guild_bot`, and `tick_detector`

- set `bugsnag_use` to `true` and omit all other `bugsnag_` properties
- In `frontend/src/secrets.ts`, set `Bugsnag.use` to `false`, and omit `Bugsnag.token`

> **Security notice:** Do not add or commit your secrets to Git.

## Running and debugging Elite BGS

### Ports

As Elite BGS is split into five parts, the following default HTTP ports are used:

| Service | Prod | Dev | Debug |
| -- | -- | -- | -- |
| backend API | 4010 | 3010 | 9029 |
| eddn_listener | 4011 | 3011 | 9129 |
| tick_listener | 4012 | 3012 | 9229 |
| guild_bot | 4013 | 3013 | 9329 |
| frontend app + accompanying backend | 4014 | 3014 | 9429 |

### Development Mode

If you've read this far, you're likely to be developing Elite BGS or want to run your custom version. Developers can start development mode in their IDE, via the command line, or within a debugger like this:

```console
    foo@bar:~$ cd elitebgs
    foo@bar:~$ npm run startdev # starts all five servers at once
```

You can also run an individual service:

```console
    foo@bar:~$ cd elitebgs/backend
    foo@bar:~$ npm run startdev # starts just backend
```

You can also use your IDE to navigate to `package.json` and configure, run, or debug a script target, which gives you great control over the development process.

### Production Mode

To execute the project in production mode:

Ensure you have the correct URL in `frontend/processVars.js`, as otherwise the internal links within the application will not work, or will redirect the user to the main production site:

```js
    } else if (process.env.NODE_ENV === 'production') {
        host = 'elitebgs.app'; // CHANGE ME
        protocol = 'https';
    }
```

```console
    foo@bar:~$ cd elitebgs
    foo@bar:~$ npm run start # starts all production instances
```

Review the HTTP ports above to connect to the Elite BGS front end or set up a port forwarding or caching configuration to scale and serve many clients.

You will need to establish a TLS listener and, if very busy, a load balancer, such as via a cloud router or Nginx or Apache Reverse Proxy, and ensure that your URL's DNS servers point to your server and the URL you have chosen.

## Contributing fixes and enhancements back to Elite BGS

Elite BGS is an open-source project and relies upon contributors such as yourself fixing issues or creating new features for the benefit of all. Elite BGS follows standard GitHub industry practices, including that new fixes or features should be in their branch and committed via a pull request. GitHub has many excellent articles on how to install and get going with pull requests and branches.

### Working on a branch

Find an issue you want to fix or enhance, and let folks know that you want to work on it. Create a new branch for your issue or enhancement:

`git checkout -b [name-of-your-new-branch]`

### Create a pull request for your issue fix or enhancement

After you have made the necessary changes and committed them, push them to your forked repository. Then create a pull request to the `master` base branch.

I will review the PR and might ask to make changes before accepting them.
