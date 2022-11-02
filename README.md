<div align="center" >
  <img width="150px" src="https://user-images.githubusercontent.com/65803142/199424482-801fb17e-7f98-4d8e-ba55-b90b9cd9c92f.png" alt="uvu" width="400">
  <br>
  <br>
  <h1>Healthy Foods</h1>
</div>

[![GitHub version](https://badge.fury.io/gh/luizfelipe-dev%2Fhealthy-foods.svg)](https://badge.fury.io/gh/luizfelipe-dev%2Fhealthy-foods)
---

## 📝 Description

Healthy Foods is a web application that allows users to search for proudcts and get information about them created for the challenge (**NodeJs Challenge 20201030**)

## 📌 Solved Problem

The main problem that this application solves is that it allows users to use the Foods platform as a data import base and can edit according to their need. This allows on the first day of use to have access to a vast amount of food options to help the food health professional's day.

## 🚀 Technologies

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [vitest](https://vitest.dev/)
- [eslint](https://eslint.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [cron](https://www.npmjs.com/package/cron)
- [Cucumber](https://cucumber.io/)


## 📦 Installation

Clone the repository.

```bash
# https
$ git clone https://github.com/WillianBL99/healthy-foods.git
# ssh
$ git clone git@github.com:WillianBL99/healthy-foods.git
```

Install the dependencies.

```bash
$ npm install
#or
$ yarn
```

## 🚀 Usage

This porject can be used in four ways:
- 1 development mode
- 2 production mode
- 3 docker compose
- 4 tests

### 1 Development mode

```bash
$ npm run dev
#or
$ yarn run dev
```

### 2 Production mode

```bash
$ npm run build && npm run start
#or
$ yarn run build && yarn run start
```

### 3 Docker compose

```bash
$ npm run docker
#or
$ yarn run docker
```

### 4 Tests

run all tests once

```bash
$ npm run test
#or
$ yarn run test
```

run all tests in watch mode

```bash
$ npm run test:watch
#or
$ yarn run test:watch
```

run all tests in coverage mode

```bash
$ npm run test:coverage
#or
$ yarn run test:coverage
```

## 📌 Features

- [x] Search for proudcts
- [x] Search for a recipe by id
- [x] Edit a recipe
- [x] Delete a recipe
- [x] Update a recipe
- [x] Update the database with the Foods API every 24 hours

## 🔀 Routes

### Products

- **GET** `/products` - Search for proudcts
  | Query Params | Type | Description |
  | :---: | :---: | :---: |
  | `page` | `number` | Page number |
  | `pagination` | `number` | Number of items per page |

- **GET** `/products/:id` - Search for a proudct by id
  | Params | Type | Description |
  | :---: | :---: | :---: |
  | `id` | `string` | Product id |

- **PUT** `/products/:id` - Edit a proudct
  | Params | Type | Description |
  | :---: | :---: | :---: |
  | `id` | `string` | Product id |
  | Body | `object` | Product data |

- **DELETE** `/products/:id` - Change the proudct status to trash
  | Params | Type | Description |
  | :---: | :---: | :---: |
  | `id` | `string` | Product id |

### API Information

- **GET** `/` - Get API information
```bash
{
  lastUpdate: "10-30-2022 00:00:00",
  upTime: "0h 0m 0s",
  connection: 'Connected',
  memoryUsage: "0.00 MB",
}
```

### Health

- **GET** `/health` - Get API health
```bash
{
  status: "OK",
}
```

## 💽 Database

This project uses a [MongoDB](https://www.mongodb.com/) database.
- **Database name:** `healthy-foods`
- **`Collections`:**
  - **`products`:** Stores all products
  - **`paramsUpdated`:** Stores the params that were updated
  - **`information`:** Stores the updates information

## 🏔️ Challenges

In this project, the main challenge was to create a way to update the database with the zip files provided by the **Foods API**. To solve this problem I created a [cron job](https://www.npmjs.com/package/cron) that runs every 24 hours combined with the use of the [Axios](https://axios-http.com/ptbr/docs/intro) library and the [Zlib](https://nodejs.org/api/zlib.html) and [fs](https://nodejs.org/api/fs.html) modules of the node that asked to create a stream that unpacks and converts to JSON while saving the file in the application.