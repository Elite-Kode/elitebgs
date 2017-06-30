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

- `http://elitebgs.kodeblox.com/api/eddb/v1/bodies*`
- `http://elitebgs.kodeblox.com/api/eddb/v1/bodies?<params>`

### Commodities

- `http://elitebgs.kodeblox.com/api/eddb/v1/commodities*`
- `http://elitebgs.kodeblox.com/api/eddb/v1/commodities?<params>`
- `http://elitebgs.kodeblox.com/api/eddb/v1/commodities/id/<commodity id>`

### Factions

- `http://elitebgs.kodeblox.com/api/eddb/v1/factions*`
- `http://elitebgs.kodeblox.com/api/eddb/v1/factions?<params>`

### Populated Systems

- `http://elitebgs.kodeblox.com/api/eddb/v1/populatedsystems*`
- `http://elitebgs.kodeblox.com/api/eddb/v1/populatedsystems?<params>`

### Stations

- `http://elitebgs.kodeblox.com/api/eddb/v1/stations*`
- `http://elitebgs.kodeblox.com/api/eddb/v1/stations?<params>`

### Systems

- `http://elitebgs.kodeblox.com/api/eddb/v1/systems*`
- `http://elitebgs.kodeblox.com/api/eddb/v1/systems?<params>`

### Download dumps from EDDB*

- `http://elitebgs.kodeblox.com/api/eddb/v1/downloaddumps/body`
- `http://elitebgs.kodeblox.com/api/eddb/v1/downloaddumps/commodity`
- `http://elitebgs.kodeblox.com/api/eddb/v1/downloaddumps/faction`
- `http://elitebgs.kodeblox.com/api/eddb/v1/downloaddumps/station`
- `http://elitebgs.kodeblox.com/api/eddb/v1/downloaddumps/populatedsystem`
- `http://elitebgs.kodeblox.com/api/eddb/v1/downloaddumps/system`

### Insert downloaded dumps*

- `http://elitebgs.kodeblox.com/api/eddb/v1/insertdumps/body`
- `http://elitebgs.kodeblox.com/api/eddb/v1/insertdumps/commodity`
- `http://elitebgs.kodeblox.com/api/eddb/v1/insertdumps/faction`
- `http://elitebgs.kodeblox.com/api/eddb/v1/insertdumps/station`
- `http://elitebgs.kodeblox.com/api/eddb/v1/insertdumps/populatedsystem`
- `http://elitebgs.kodeblox.com/api/eddb/v1/insertdumps/system`

### Update database from downloaded dumps*

- `http://elitebgs.kodeblox.com/api/eddb/v1/updatedumps/body`
- `http://elitebgs.kodeblox.com/api/eddb/v1/updatedumps/commodity`
- `http://elitebgs.kodeblox.com/api/eddb/v1/updatedumps/faction`
- `http://elitebgs.kodeblox.com/api/eddb/v1/updatedumps/station`
- `http://elitebgs.kodeblox.com/api/eddb/v1/updatedumps/populatedsystem`
- `http://elitebgs.kodeblox.com/api/eddb/v1/updatedumps/system`

### Download and insert dumps*

- `http://elitebgs.kodeblox.com/api/eddb/v1/downloadinsert`

### Download and update dumps*

- `http://elitebgs.kodeblox.com/api/eddb/v1/downloadupdate`

\* These routes are not availble to public due to security/traffic issues. Only developer(s) have access.

For more deatils please refer the [wiki](https://github.com/SayakMukhopadhyay/elitebgs/wiki "EliteBGS Wiki")

## Contributing

If you find a bug, please create an issue in the issue tracker in Github, properly detailing the bug and reproduction steps.

If you are willing to contribute to the project, please work on a fork and create a pull request.

## Credits

For the CMDRs by a CMDR. Created by CMDR Garud for an awesome gaming community. Also, a great thanks to the developers of [EDDB](https://eddb.io/) without which this project would not have started.

## License

Developed under [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).