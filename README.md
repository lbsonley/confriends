# Confriends

An app to help groups organize and coordinate attending a conference together.

## Installation

```sh
# make directory in which to clone this repo
mkdir confriends && cd confriends

# clone the repo in that directory
git clone https://github.com/lbsonley/confriends.git .

# install dependencies for server and DB
yarn install

# install dependencies for Create React App
cd client
yarn install
```

## Run all the tasks

```sh
# start the database
npm run start:db

# transpile the server
npm run compile:server

# start the server
npm run start:server

# start the react app
npm run start
```

## Database setup and maintenance

### Populate db with dummy data

```sh
mongoimport --db confriends --collection conferences --jsonArray --file ./client/src/Data/conferenceslong.json
```

### Reset the database to its original state

```sh
mongoimport --db confriends --collection conferences --drop --jsonArray --file ./client/src/Data/conferenceslong.json
```

## Drop a db

```sh
mongo <dbname> --eval "printjson(db.dropDatabase())"
```

## User Accounts

In order to access certain functionality, you will need to log in to a sample user account. Contact me for account credentials.
