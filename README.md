# tsoa-koa-example-with-typeorm

This example repository shows how you can use tsoa with koa to generate swagger and routes for an api that would write to a SQL database via TypeORM

Note: This has a lot of advanced cases that you may not need:
* It builds a different swagger.yaml file based on the environment it's running in. See tsoaCustom.ts to learn how that works
* This has dockerfiles and CodeFresh pipeline files so it can be easily run in CICD
* It enforces that certain environment variables are present at compile time and at runtime. See src\config\configInitiator.ts for more information
* It has a docker-compose.yml file that will create a local database for you. If you want to try running without that, you can set process.env.DEMO_MODE to true

## How to bend this example repo to your usage:

1) Ctrl+shift+f for REPLACE_ME and insert your own values

## Reference Material

### For Developers

- [VSCode Setup](docs/ide-vscode.md)
- [Postgres](docs/store-postgres.md)
- [TypeORM guide](docs/orm-typeorm.md) - Includes information about writing migrations
- [API - Swagger Editor](http://localhost:8081/) - Import current config by using Import -> Url `http://localhost:5555/swagger.json` [instructions here](https://github.com/swagger-api/swagger-editor/blob/master/docs/import.md)
- [Postgres Tools - Adminr](http://localhost:8080/)
- [Postgres Tools - Pg Admin](http://localhost:8000)

## Local development information

### Prerequisites

1. Node 10.15.3
    - if using [n](https://github.com/tj/n), check with `n`
    - if using [nvm](https://github.com/creationix/nvm), check with `nvm current`
2. npm
3. yarn
4. [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

### Run local dev server (Node API):

1. Install Dependencies: `yarn`
1. Initialize the database:  `yarn db:init`
	- run `yarn db:where-is-dev-db-running` to get the ip address you will use for PGAdmin setup
1. Run migrations so that your schemas are current `yarn db:migrate:run`
1. To run the development server: `yarn start:dev`. If you would prefer to debug inside your editor, you can look at the [editor config doc](docs/ide-vscode.md) for help.
1. To open up PgAdmim - (use values from file docker-compose.yml)
	- get the pgadmin.ports value WITHOUT the colon and part to the right as pgAdminValue (for example: localhost:9000)
	- PgAdmin will run in a browser at localhost:{pgAdminValue}
	- use the PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD to login
	- create a new Server and connection.
		- the server name is the value of POSTGRES_DB
		- the connection Host name/Address is where the dev db is running (see step 2)
		- the UserName is the value of POSTGRES_USER
		- the Passowrd is the value of POSTGRES_PASSWORD
1. Post a new orator using the swagger page and expect a 200 response to validate your dev setup is complete.

### Building for production (Node API)

To build for production: `yarn build`. Which can then be started with: `$ yarn start`

### Available npm script commands (yarn `<taskname>`)

1. `start:dev` - this is what you'll want to run if you're running locally
2. `test` - run unit tests
3. `test:cov` - run tests with code coverage. Note this will mangle stack traces on failure reports, so it is generally recommended to use the bare `test` command for development an only run this when a coverage report is desired.  HTML coverage report will be written to the `coverage` directory.
4. `build` - build for release. writes output to `build` directory
5. `start` - run application from built source
6. __Dev Server__
    - `dev-server` - run development server from the command line
    - `dev-server:debug` - run development server with additional logging
7. `lint` - run typescript linter
8. `available-routes` - see which routes koa is currently making available
9. __Docker__
    - `docker:build`
    - `docker:run`
10. __Database Interaction__
    - `db:migrate:generate nameOfTheNewMigration` - this should be run any time there is a schema change
    - `db:migrate:run` - run all migrations (utilizes a table `migrations`)
    - `db:migrate:revert` - undo most recent migration

### To build your own docker image (Node API)

1. `docker build -t msvc-example-service .` - build the image RUN FROM CMD WINDOW FAILS _ RUN FROM TERMINAL IN VSCODE FAILS
2. `docker run -d -p 5555:5555 msvc-example-service` - run docker container
3. on the host machine open a browser and test that it is running here: [http://localhost:5555/api/health](http://localhost:5555/api/health)

