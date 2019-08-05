# Postgres


## TL;DR

### Dedicated Yarn Tasks
  * Making Dev life a lil easier... _run from PROJECT ROOT with `yarn <task name>`_
  * Onboarding and Teardown
    - `db:init` - run first time to have containerized db env setup on local
    - `db:seed` - run first time to have some key data seeded in db
    - `db:destroy` - run to completely remove env (and associated data in volumes) _NOTE: This does not remove the downloaded images.__
  * Active Development
    - `db:start` - run day-to-day to start containerized env
    - `db:stop` - run day-to-day to stop containerized env


## Docker

#### Docker setup
  * Install [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
  * Open Docker Preferences > Advanced, and increase memory to _at least_ 4GB
  * _Suggested: Install Kitematic (which should be available in the Docker Activity Bar menu in top-right of screen)_

#### Run Docker Compose
  * Initial download -> From root of project allow docker compose to set everything up
    ```bash
    docker-compose up
    ```
  * After first setup -> From root of project start docker compose
    ```bash
    docker-compose start
    ```
  * Stop Docker containers when done doing dev... they will keep running in background unless you shut them down. You can use kitematic to start/stop the container once built, or you can do so via the command-line
    - From root of project `docker-compose stop`
    - Note: all connections need to be stopped for this to work, e.g. any GUI SQL apps in-use on localhost

#### Docker Troubleshooting
  * If you see errors related to needing to run `initdb`, e.g. `initdb: directory "/var/lib/postgresql/data" exists but is not empty`. Docker may have left a data volume on your machine. You can run `docker volume prune` __BEWARE: This will destroy all local db data for all volumes on your machine, so be careful!__


## DB Admin GUI Tools

#### Web interface - adminer
  * How to use adminer
    - Once you have started the containerized db env, you can connect to adminer by visiting `http://localhost:8080/`

#### OSX App - postico
  * Download here: https://eggerapps.at/postico/
