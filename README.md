# EliteBGS

A website to track the background simulation in Elite Dangerous

## This is a work in progress. More features will be added. Some may change. Not ready for production yet.

Currently [EDDB](https://eddb.io/) is the greatest treasure of information of the galaxy and it is a user friendly tool for many pilots. But it lacks an API for developers. Elite BGS is an attempt to fill this gap by providing an API for EDDB data sources.

# API

## Access

The API endpoints are access restricted. There are 2 users:

1. admin
2. guest

Consumers must make a GET request at any endpoint using Basic HTTP authentication with username `guest` and password `secret`.

## Endpoints

### Bodies

- http://elitebgs.kodeblox.com/api/bodies*
- http://elitebgs.kodeblox.com/api/bodies?\<params>
- http://elitebgs.kodeblox.com/api/bodies/name/\<body name>

### Commodities

- http://elitebgs.kodeblox.com/api/commodities*
- http://elitebgs.kodeblox.com/api/commodities?\<params>
- http://elitebgs.kodeblox.com/api/commodities/id/\<commodity id>

### Factions

- http://elitebgs.kodeblox.com/api/factions*
- http://elitebgs.kodeblox.com/api/factions?\<params>
- http://elitebgs.kodeblox.com/api/factions/name/\<faction name>

### Populated Systems

- http://elitebgs.kodeblox.com/api/populatedsystems*
- http://elitebgs.kodeblox.com/api/populatedsystems?\<params>
- http://elitebgs.kodeblox.com/api/populatedsystems/name/\<system name>

### Stations

- http://elitebgs.kodeblox.com/api/stations*
- http://elitebgs.kodeblox.com/api/stations?\<params>
- http://elitebgs.kodeblox.com/api/stations/name/\<station name>

### Systems

- http://elitebgs.kodeblox.com/api/systems*
- http://elitebgs.kodeblox.com/api/systems?\<params>
- http://elitebgs.kodeblox.com/api/systems/name/\<system name>

### Download dumps from EDDB*

- http://elitebgs.kodeblox.com/api/downloaddumps/body
- http://elitebgs.kodeblox.com/api/downloaddumps/commodity
- http://elitebgs.kodeblox.com/api/downloaddumps/faction
- http://elitebgs.kodeblox.com/api/downloaddumps/station
- http://elitebgs.kodeblox.com/api/downloaddumps/populatedsystem
- http://elitebgs.kodeblox.com/api/downloaddumps/system

### Insert downloaded dumps*

- http://elitebgs.kodeblox.com/api/insertdumps/body
- http://elitebgs.kodeblox.com/api/insertdumps/commodity
- http://elitebgs.kodeblox.com/api/insertdumps/faction
- http://elitebgs.kodeblox.com/api/insertdumps/station
- http://elitebgs.kodeblox.com/api/insertdumps/populatedsystem
- http://elitebgs.kodeblox.com/api/insertdumps/system

### Update database from downloaded dumps*

- http://elitebgs.kodeblox.com/api/updatedumps/body
- http://elitebgs.kodeblox.com/api/updatedumps/commodity
- http://elitebgs.kodeblox.com/api/updatedumps/faction
- http://elitebgs.kodeblox.com/api/updatedumps/station
- http://elitebgs.kodeblox.com/api/updatedumps/populatedsystem
- http://elitebgs.kodeblox.com/api/updatedumps/system

\* These routes are not availble to public due to security/traffic issues. Only developer(s) have access.

For more deatils please refer the [wiki](https://github.com/SayakMukhopadhyay/elitebgs/wiki "EliteBGS Wiki")

## Contributing

If you find a bug, please create an issue in the issue tracker in Github, properly detailing the bug and reproduction steps.

If you are willing to contribute to the project, please work on a fork and create a pull request.

## Credits

For the CMDRs by a CMDR. Created by CMDR Garud for an awesome gaming community. Also, a great thanks to the developers of [EDDB](https://eddb.io/) without which this project would not have started.

## License

Developed under [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).