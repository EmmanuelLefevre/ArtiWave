# ArtiWave
## INTRODUCTION
ArtiWave is a back-end blogging application developped with Express. It uses MongoDB as well as the Mongoose ORM. 
It has JWT authentication and allows you to perform CRUD operations on articles depending on your role.
## INSTALLATION
### 1. Local
#### Database
- Install MongoDb Compass and Mongosh shell.  
[MongoDb shell download](https://www.mongodb.com/try/download/shell)  
[MongoDb Compass download](https://www.mongodb.com/try/download/compass)  
- Create database with Mongosh:
```shell
mongosh
```
```shell
use artiwave
```
```shell
db.createCollection("users")
```
```shell
db.createCollection("articles")
```
[MongoDb create a database documentation](https://www.mongodb.com/docs/manual/core/databases-and-collections/)
- Create an authentication
```shell
mongosh
```
```shell
use artiwave
```
```shell
db.createUser({ user: "Admin", pwd: "nimda", roles: [{ role: "readWrite", db: "artiwave" }] })
```
[MongoDb create a user documentation](https://www.mongodb.com/docs/manual/tutorial/create-users/)
***
- Connexion to database
##### 1. Connexion with Mongosh:
```shell
db.auth("Admin","nimda")
```
##### 2. Or connexion with MongoDb VsCode extension:
![Connexion MongoDb VsCode extension step 1](https://github.com/EmmanuelLefevre/img/blob/main/MongoDb%20VsCode%20extension%20connexion%20step%201.png)
![Connexion MongoDb VsCode extension step 2](https://github.com/EmmanuelLefevre/img/blob/main/MongoDb%20VsCode%20extension%20connexion%20step%202.png)
***
#### Clone and install project
```shell
git clone
```
```shell
nvm install 20.10.0
```
```shell
npm install
```
#### Generate keys for JWT
```shell
mkdircd _certs
```
```shell
openssl genrsa -out pvt.pem 4096
```
```shell
openssl rsa -in pvt.pem -outform PEM -pubout -out pbl.pem
```
#### Check private key
```shell
openssl rsa -check -in _certs/pvt.pem
```
#### Load fixtures
```shell
make lf
```
#### Launch server
If NVM is locally installed on your computer and you're not confident that you're on the required Node v20.10.0 LTS you could execute this command line =>  
```shell
nvm use 20.10.0
```
Or check your version with =>  
```shell
node -v
```
Then you could launch server with makefile =>  
```shell
make dev
```
Otherwise with NPM  
```shell
npm run dev
```
#### Swagger doc
```
localhost:9001/swagger-doc
```
#### Launch tests
```shell
npm run test
```
#### Launch tests coverage
```shell
npm run test:cov
```
#### Launch Sonarqube server
First give rights to the sonar-server.sh file  
```shell
chmod u+x sonar-server.sh
```
Start the server after opening docker desktop
```shell
./sonar-server.sh
```
Open a browser and open the URL => http://localhost:9000  
Enter credentials Login: admin and Password: admin  
Set a new password...  

Give rights to the scan.sh file  
```shell
chmod u+x scan.sh
```
Launch SonarQube tests
```shell
./scan.sh
```



### 2. Docker
