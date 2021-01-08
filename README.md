# foody_app_be
### Set up the backend
1. Clone the project to local.
2. run `npm install` in the project root directory.
3. Create a **.env** file in the project root directory.
4. Insert following keys with it respective value in the **.env file** (Kindly refer to https://www.npmjs.com/package/dotenv)   
  ```
  *DB_USER=<Your MYSQL username> 
  *DB_PASS=<Your MYSQL pasword>
  *JWT_SECRET=<Random value to used as generate JWT token>
  ```  

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
6. Once everthing had set up, execute the `foodie_vlog.sql` in MySQL workbench (or any other valid way) to define all the tables.

### Set up CRUD for each module
1. Create a new route file in the **routers** directory for every module.
2. Create the REST API in the respective route file.
3. Register the route in `app.js`

### Create Query
1. Create MySQL query function in the **repository file**.
2. Passed in and use the created query function in respective **router file** http methods.  

3. **Example:**  
*users.repository.js*
```
function getUser(username){
    return new Promise ((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results, fields) => {
            error? reject(error):resolve(results);
        }) 
    }) 
}
```  
  
*users.router.js*  
```
router.get('/users', async (req,res) => {
    try{
        let results = await getUser(req.body.username);
        res.status(200).send(results);
    }catch (err){
        console.log(err)
        res.status(400).send(err);
    }   
})
```
Kindly refer to https://www.npmjs.com/package/mysql for more info.
