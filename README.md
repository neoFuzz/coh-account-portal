# Account Portal

A Node.js application to allow users to create their own accounts and change their passwords.
This implementation intends to be more standalone over it's PHP predecessor.

# Operational Requirements

* This application requires Node.js >v18.17.1, and the Microsoft ODBC Driver 17 for SQL Server. The latter should have been installed with the Ouro self-installer.
* This application additionally requires access to the dbquery.exe binary, found in your City of Heroes server\bin folder.

# Setup Guide

* Install [Node.js](https://nodejs.org/en/download/prebuilt-installer) v18.17.0 (or greater).

* Install the [Microsoft ODBC Driver 17 for SQL Server](https://go.microsoft.com/fwlink/?linkid=2266337). If it isn't installed already.

* Download and extract this repository's files into into a folder of your choice.

* Open the command line, navigate to the root directory of this `npm install`. This will download required dependencies.

* Configuration is stored in `.env` file. Edit the file and update some of the values. Just put some random typing as your KEY and IV values.

* run the server with `npm run start`

# Recommendations

* Add a unique index to column uid on cohauth.dbo.user_account to reduce the possibility of account uid collisions. To do that, run this SQL statement: ```CREATE UNIQUE INDEX AccountUID ON cohauth.dbo.user_account (uid);```

# Customization

Website content can be found in the `\templates` directory. Rename the .example files by removing the extension '.example'. Then customize to taste.

* create.phtml is displayed as text above the create your account form. Use this for EULA, rules, etc.
* index.phtml lets you customize your main index page. If you do not have this file, a default server status message will be displayed instead.
* menuitems.phtml allows you to add additional menu items to the bottom of the main menu.

# Upgrade Guide

No upgrade info at this time.
* TBA

# Support

Support is available from OuroDev on Discord. https://discord.gg/G5tRFFX in the #portal-discussion channel.
