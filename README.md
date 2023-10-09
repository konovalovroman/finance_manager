# Finance Manager API
This is an API for managing users' financial transactions, including viewing user balances, adding payments, updating payments, deleting payments, sorting payments by date and description, and assigning payment categories.

### Technology stack:
* NestJS
* TypeORM
* PostgreSQL

## Installation

```bash
 git clone https://github.com/konovalovroman/finance_manager.git
 cd finance_manager
 yarn install
```

## Running the app
```bash
 docker-compose up
```
### Will be launched:
* [http://localhost:4500/](http://localhost:4500/) – API URL
* [http://localhost:4500/swagger#/](http://localhost:4500/swagger#/) - Swagger documentation
* [http://localhost:5050/](http://localhost:5050/) – pgAdmin *email: admin@admin.com, password: root*


A /logs directory is created in the root directory, containing the logs.json file. The logs.json file contains logs for each CREATE/UPDATE/DELETE payment operation
### Each log contains:
* Type of payment
* Payment category
* Payment date
* Payment amount
* Payment operation (CREATE/UPDATE/DELETE )

## Running with yarn
### Notice!
If you want to run the application by yarn, you need to fill the .env file. You also need a working PostgreSQL on your machine.
#### .env template:
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```
#### Running application with yarn
```bash
 yarn start
```

## Running the tests
```bash
 yarn test
```

## Running without cloning
You can also run this application with just a single docker-compose.yml. Create a new directory and put docker-compose.yml in it
#### docker-compose.yml
```
version: '3'

services:
  app:
    container_name: finance_manager
    image: konovalovroman/finance_manager:latest
    ports:
      - 4500:4500
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=postgres
      - DB_NAME=finance_manager
    volumes:
      - ./logs:/usr/src/app/logs
    depends_on:
      - db
    
  db:
    container_name: db
    image: postgres:15
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=finance_manager
    volumes:
      - pgdata:/var/lib/postgresql/data
  pgadmin:
    container_name: pgadmin4
    image: dpage/pgadmin4
    restart: always
    ports:
      - 5050:80
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=root

volumes:
  pgdata: {}
```

Then in this directory run `docker-compose up`
It will run an API on same URLs and the */logs* directory will also be created
