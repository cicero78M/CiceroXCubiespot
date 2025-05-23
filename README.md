# CiceroXCubiespot

Cicero Collaboration is a social media management system designed for organizations to supervise member participation across official social media accounts. It supports data processing and reporting for Instagram, TikTok, and WhatsApp Stories, automates routine tasks through cron jobs, and provides both admin and user-facing commands via a simple interface.

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Project Structure](#project-structure)
* [Core Components](#core-components)

  * [app.js](#appjs)
  * [Controllers](#controllers)
  * [Routes](#routes)
  * [Views](#views)
  * [Cron Jobs](#cron-jobs)
  * [Utilities](#utilities)
  * [Scripts](#scripts)
* [Usage](#usage)

  * [Admin Commands](#admin-commands)
  * [User Commands](#user-commands)
* [Contributing](#contributing)
* [License](#license)

## Features

* **Client Management**: Add, remove, and modify clients' data and statuses.
* **User Profiles**: Store member details (ID, name, division, jabatan, social links).
* **Automated Data Collection**: Reload Instagram likes, TikTok comments, and WhatsApp story data via cron.
* **Reporting**: Generate engagement reports on demand for each client.
* **Command Interface**: Simple hash-delimited commands to perform admin and user operations.
* **Web Dashboard**: EJS-based dashboard showing member data and quick command input.

## Prerequisites

* Node.js v16+ and npm
* (Optional) SQLite or PostgreSQL if migrating from JSON to a relational database
* (Optional) MongoDB if using the NoSQL configuration

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cicero78M/CiceroXCubiespot.git
   cd CiceroXCubiespot
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` in the project root (see [Configuration](#configuration)).
4. (If using SQLite) Initialize the database or run migrations.
5. Start the app:

   ```bash
   npm start
   ```
6. Open your browser at `http://localhost:3000/{CLIENT_ID}` (e.g., `/pojonegoro`).

## Configuration

Copy `.env.example` to `.env` and set the following values:

```ini
PORT=3000
DB_DIALECT=sqlite
DB_STORAGE=./data/database.sqlite   # or your Postgres URL in production
# Or for MongoDB:
# MONGO_URI=mongodb://localhost:27017/cicero
APP_CLIENT_TYPE=COM
APP_SESSION_NAME=cicero_session
```

Cron schedules are defined in `app/config/cron.js`.

## Project Structure

```
CiceroXCubiespot/
├── .env.example       # Template for environment variables
├── .gitignore
├── README.md          # This documentation
├── app.js             # Entry point: server, routes, cron, WhatsApp integration
├── package.json       # Dependencies and scripts
├── app/               # Core application modules
│   ├── controller/    # Business logic (adminController.js, userController.js, dataController.js, reportController.js)
│   ├── routes/        # Express routers (client.js)
│   ├── views/         # EJS templates (index.ejs, error.ejs)
│   ├── config/        # Configuration files (cron.js)
│   └── util/          # Utilities (CryptoUtil.js, logger.js)
├── data/              # JSON data storage per client (if not using DB)
└── scripts/           # Helper scripts (e.g., migrateUsers.js)
```

## Core Components

### app.js

* **Express Setup**: Initializes Express, sets EJS as the view engine, and serves routes.
* **WhatsApp Integration**: Uses `whatsapp-web.js` to listen for incoming messages; parses commands and dispatches to controllers.
* **Cron Scheduling**: Imports schedules from `app/config/cron.js` and registers tasks for:

  * Reloading engagement data (Instagram, TikTok, WhatsApp)
  * Generating periodic reports
* **Error Handling**: Centralized handler logs errors and renders a friendly error page.

### Controllers

Distributed in `app/controller/`, each module encapsulates related business logic:

* **adminController.js**

  * `addClient(name, type, instaLink, tiktokLink)`
  * `changeClientStatus(name, status)`
  * `transferByOrg(name, sheetUrl)`
  * `transferByCom(name, sheetUrl)`
  * `addNewUser(name, userObj)`
  * `editUserField(name, userId, field, newValue)`

* **userController.js**

  * `getMyData(name, userId)`
  * `updateInsta(name, instaLink)`
  * `updateTiktok(name, tiktokLink)`

* **dataController.js**

  * `reloadInstaLikes()`
  * `reloadTiktokComments()`
  * `reloadWhatsappStory()`

* **reportController.js**

  * `reportInstaLikes(name)`
  * `reportTiktokComments(name)`
  * `reportWhatsappStory(name)`

### Routes

In `app/routes/client.js`:

```js
router.get('/:clientId', async (req, res, next) => {
  // Fetches client data and renders index.ejs
});
```

This dynamic route replaces multiple static routes, loading any client present in storage.

### Views

Stored in `app/views/`:

* **index.ejs**: Displays a table of members for the selected client and a command input form.
* **error.ejs**: Renders generic errors with a helpful message.

### Cron Jobs

Defined in `app/config/cron.js`:

```js
export default {
  reloadSchedule: '*/10 * * * *',
  reportSchedule: '0 12,16,19 * * *',
  // …other schedules
};
```

Imported in `app.js` to schedule tasks via `node-cron`.

### Utilities

* **CryptoUtil.js**: Provides simple encrypt/decrypt helpers for command verification.
* **logger.js**: Wraps a structured logger (`pino`/`winston`) to replace `console.log`.

### Scripts

* **migrateUsers.js**: Migrates JSON-based user data into the configured database (SQLite/Postgres/MongoDB).

## Usage

### Admin Commands

Commands sent via WhatsApp message or the dashboard form:

```
ClientName#addclient#type['COM','RES']#instaLink#tiktokLink
ClientName#clientstate#boolean
ClientName#newclientorg#sheetUrl
ClientName#newclientcom#sheetUrl
ClientName#addnew#ID_Key#UserName#Division#Jabatan#Title(Optional)
ClientName#editname#ID_Key#newName
ClientName#editdivisi#ID_Key#newDivision
ClientName#editjabatan#ID_Key#newJabatan
```

### User Commands

```
ClientName#mydata
ClientName#updateinsta#InstagramProfileLink
ClientName#updatetiktok#TiktokProfileLink
```

### Reload & Report (Automated)

* `reloadInstaLikes`, `reloadTiktokComments`, `reloadWhatsappStory` run on defined schedules.
* Reports (`reportInstaLikes`, `reportTiktokComments`, `reportWhatsappStory`) run automatically and can be triggered manually via commands.

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -m 'Add xyz feature'`)
4. Push to the branch (`git push origin feature/xyz`)
5. Open a Pull Request

## License

MIT © Cicero Collaboration
