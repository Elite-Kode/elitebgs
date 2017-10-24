# EliteBGS

A website to track the background simulation in Elite Dangerous

Elite BGS is a project that attempts to fill a gap of APIs for the treasure trove of information online. Currently, it is operating in 2 separate modules.

## EDDB API

Currently, [EDDB](https://eddb.io/) is the greatest treasure of information of the galaxy and it is a user friendly tool for many pilots. But it lacks an API for developers. EDDB API is an attempt to fill this gap by providing an API for EDDB data sources.

## ELITE BGS API

For ultimate immersion and BGS control, we require not only the latest data but also historical ones. ELITE BGS API is a step in that direction. It stores information which changes regularly in a historical format. Thus, one can always look up the events that led to the current Civil War, for instance.

# API

## Access

The API endpoints are access restricted. There are 2 users:

1. admin
2. guest

Consumers must make a GET request at any endpoint using Basic HTTP authentication with username `guest` and password `secret`.

## EDDB API Endpoints

### Bodies

- `http://elitebgs.kodeblox.com/api/eddb/v1/bodies`*
- `http://elitebgs.kodeblox.com/api/eddb/v1/bodies?<params>`

### Commodities

- `http://elitebgs.kodeblox.com/api/eddb/v1/commodities`*
- `http://elitebgs.kodeblox.com/api/eddb/v1/commodities?<params>`
- `http://elitebgs.kodeblox.com/api/eddb/v1/commodities/id/<commodity id>`

### Factions

- `http://elitebgs.kodeblox.com/api/eddb/v1/factions`*
- `http://elitebgs.kodeblox.com/api/eddb/v1/factions?<params>`

### Populated Systems

- `http://elitebgs.kodeblox.com/api/eddb/v1/populatedsystems`*
- `http://elitebgs.kodeblox.com/api/eddb/v1/populatedsystems?<params>`

### Stations

- `http://elitebgs.kodeblox.com/api/eddb/v1/stations`*
- `http://elitebgs.kodeblox.com/api/eddb/v1/stations?<params>`

### Systems

- `http://elitebgs.kodeblox.com/api/eddb/v1/systems`*
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

## Elite BGS Endpoints

- `http://elitebgs.kodeblox.com/api/ebgs/v1/factions?<params>`
- `http://elitebgs.kodeblox.com/api/ebgs/v1/systems?<params>`

\* These routes are not availble to public due to security/traffic issues. Only developer(s) have access.

For more details, please refer the [wiki](https://github.com/SayakMukhopadhyay/elitebgs/wiki "EliteBGS Wiki").

## Contributing

If you find a bug, please create an issue in the issue tracker in Github, properly detailing the bug and reproduction steps.

If you are willing to contribute to the project, please work on a fork and create a pull request.

## Credits

For the CMDRs by a CMDR. Created by [CMDR Garud](https://forums.frontier.co.uk/member.php/136073-Garud) for an awesome gaming community. 
A great thanks to the developers of [EDDB](https://eddb.io/) without which this project would not have started. Special mention for the awesome group I am in, [Knights of Karma](http://knightsofkarma.com/), whose members had to put up with me making no contribution during development. And last but not least, [CMDR Blood Drunk](https://forums.frontier.co.uk/member.php/125031-Blood-Drunk), for making me MEAN and guiding me through all the troubles faced by me at all odd times!

## License

Developed under [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).
