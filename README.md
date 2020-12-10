# foody_app_be
### Set up the backend
1. Clone the project to local.
2. run `npm install` in the project root directory.
3. Create a .env file in the project root directory.
4. Add DB_USER and DB_PASS based on your MYSQL username and password respectively in your .env file  
-refer (https://www.npmjs.com/package/dotenv)  

### Set up MySQL Server
1. Download MYSQL Server from https://dev.mysql.com/downloads/ (Select `MySQL Installer for Windows` if using Window OS)
2. Install the   
  -MYSQL Server   
  -MYSQL Workbench  
  -Connector/ODBC  
3. Click Configure in MySQL Installer after MySQL server is installed to set up the user and password.
4. Add your MySQL Path to your PC env variable.
5. Connect to your MySQL db via command prompt with following command  
  `mysql -u <username> -p <password>` or  `mysql -u root -p`  
  
### Set up CRUD for each module
1. Create a new route file in the **routers** directory for every module.
2. Create the REST API in the respective route file.
3. Register the route in `app.js`
