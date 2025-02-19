# Oswego Career Readiness Dashboard

Authors: Partially Hydrated Devs, MoveHarborFestToRochester

## Development Setup

1. Clone the repository from GitHub
   
   **Linux (Ubuntu):** Run ```apt update``` before getting started
   
   - Install Git
     - **Windows:** 
       - Download Git from https://git-scm.com/downloads 
       - Choose Standalone Installer for your architecture (32-bit, 64-bit)
       - Run the installer (use default options)
     - **Linux (Ubuntu):** 
       - Run `apt-get install git`
   - Generate SSH key for GitHub
     - Install or enable OpenSSH if it is not already (Should be enabled by default)
     - Generate a new SSH key for your computer
       - From terminal run `ssh-keygen`
       - Press "Enter" to save key to default location
         - **Windows:** Default location at ```%userprofile%\.ssh\id_ed25519.pub```
         - **Linux (Ubuntu):**  Default location at ```$home/.ssh/id_ed25519.pub```
       - Type a passkey, or press "Enter" again for no passkey
     - Log into your GitHub and upload the public SSH key 
       - Under your profile, go to Settings → SSH and GPG keys → New SSH Key
       - Copy the text from your ```id_ed25519.pub``` and paste into the key input box
     - Give it a title and save
   - Clone the repository
     - Find this repository on GitHub and copy the text under Code → SSH
     - Open a terminal from where you would like to clone
     - Run `git clone {ssh-link}` replacing `{ssh-link}` with the copied text
       - Enter the passkey from above, if applicable
       - The repo should now be located in the`oswego-career-dashboard` directory
   - Setup Git config
     - Open the terminal inside `oswego-career-dashboard` 
     - Set your username: `git config --global user.name "FIRST_NAME LAST_NAME"`
     - Set your email address: `git config --global user.email "MY_NAME@example.com"`
   
2. Install Java SE Development Kit 17
   - **Windows:** 
     - Download installer from https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
     - Choose "Windows x64 Installer"
   - **Linux (Ubuntu):**
     - Run ```wget https://download.oracle.com/java/17/archive/jdk-17.0.12_linux-x64_bin.deb```
     - Then ```dpkg -i jdk-17.0.12_linux-x64_bin.deb```
   
3. Install IDE of your choice.
   - We recommend IntelliJ Ultimate https://www.jetbrains.com/idea/. It comes with support for all the Backend and 
     Frontend Technologies. As a student you can get it for free. 
   - You can also use VSCode and install plugins for java/angular. 
   - If for whatever reason you can't get IntelliJ ultimate you can use the Community Version for the Backend and 
     VSCode for the frontend.
   
4. Install Node/NPM
   - **Windows:**
     - Download from https://nodejs.org/en/download 
     - Choose "Windows Installer (.msi)"
   - **Linux (Ubuntu):**
     - Run ```curl -o- https://fnm.vercel.app/install | bash```
     - Restart the terminal
     - Then run ```fnm install 22```
   
5. Install npm packages
   - Open a terminal inside `oswego-career-dashboard/frontend` 
   - Run `npm install`. 
     - You will have to do this every time a dependency changes in 
       the frontend
   
6. Install MySQL 8
   - **Windows:**
     - Download installer from https://dev.mysql.com/downloads/installer/
     - Run the installer
       - Select "Full" for setup type
       - On the "Accounts and Roles" page create a root password
       - (Recommended) On the "Windows Service" page, select "Start the MySQL Server at System Startup"
   - **Linux (Ubuntu):**
     - Run ```apt-get install mysql-server```
   
7. Set up the CRD database
   - **Windows:**
   
     - Open "MySQL Workbench"
       - Select the created service and log in using the created root password
       - In the Query window, run:
         - ```CREATE DATABASE CRD;```
         - ```CREATE USER 'backend'@'localhost' IDENTIFIED BY 'password';```
         - ```GRANT ALL PRIVILEGES ON CRD.* TO 'backend'@'localhost';```
   
   - **Linux (Ubuntu):**
   
     - Run ```sudo mysql``` to enter MySQL CLI as root 
     - Then run each query:
       - ```CREATE DATABASE CRD;```
       - ```CREATE USER 'backend'@'localhost' IDENTIFIED BY 'password';```
       - ```GRANT ALL PRIVILEGES ON CRD.* TO 'backend'@'localhost';```
     - Run ```quit``` to exit MySQL CLI
   
   - **IMPORTANT**: The backend needs a "SuperAdmin" user in the database to run properly. 
   
     - From your query tool or MySQL CLI, run:
   
       - ```USE CRD;```
   
       - ```INSERT INTO user(id, email, phone_number, first_name, preferred_name, last_name, can_email, can_text, role, signed_up)```
         ```VALUES (UUID_TO_BIN(UUID()), 'superuser@example.com', '123-456-7890', "First", "Preferred", "Last", 1, 1, "SuperAdmin", 1);```
   
         - Replace `superuser@example.com`  with the email of the desired admin account
   
           

## Running the app

### Backend

1. Set up backend environment
   * Open a terminal in `oswego-career-dashboard/backend` 
   * Set environment variables:
     * **Windows:** 
       * ```set CRD_DB_PASSWORD=your_password```
       * ```set EMAIL_PASSWORD=app_password```
       * ```set CRD_SUPER_ADMIN=admin_email```
     * **Linux (Ubuntu):**
       * ```export CRD_DB_PASSWORD=your_password```
       * ```export EMAIL_PASSWORD=app_password```
       * ```export CRD_SUPER_ADMIN=admin_email```
2. Run ```./gradlew bootrun```

##### Alternative backend run

* There is a shell script that will ask for environment variables and run automatically:
  * **Linux (Ubuntu):** Open terminal in ```oswego-career-dashboard/backend```:
  * **Windows:** Open a Git Bash in ```oswego-career-dashboard/backend```:
    * Run `./setenv.sh`

### Frontend

1. Run the development build
   * Open a terminal in `oswego-career-dashboard/frontend` 
     * Run ```npm start```



Finally, open up your browser and go to http://localhost:4200/



## Run using IntelliJ Configurations 


- Add IDE configuration for running the app.
  - ### Backend
    
    - In IntelliJ go to Configuration -> Edit Configurations... -> Add new configuration -> Gradle
    - Name it 
    - select the backend directory as the gradle project
    - set the task to `bootrun`
    - in environment variables add `CRD_DB_PASSWORD=your_password; EMAIL_PASSWORD=app password; CRD_SUPER_ADMIN=admin email;`
    
  - ### Frontend
    - In IntelliJ go to Configuration -> Edit Configurations... -> Add new configuration -> npm
    - select `oswego-career-dashboard/frontend/package.json` as the package.json
    - change the command to start



## Notes
- The frontend will recompile automatically but the backend will not
- View API documentation at http://localhost:4200/swagger
- You can add a compound command in IntelliJ that will run the backend/frontend together. 
You can also do this for frontend/backend test.



## Executing tests

### Frontend

- `cd frontend`
- `npm run test-headless`
- Coverage found in frontend/coverage/crd/index.html
- For more accurate coverage, run `npm run test-headless-coverage`



### Backend

- `cd backend`
- `./gradlew test`
- Coverage found in backend/build/reports/jacoco/test/html/index.html



### Integration

- When setting up, create an `account_information.yml` file in the `sit/tests` directory, follow the 
  format in the `account_information_default.yml` file. Get the sign in information from the sponsors
  or another team member to get the login information for each account. Replace the database username
  and password with the username and password you set for the crd database.
- `cd sit`
- `./runner.sh`
- Tests will take some time to complete



## Deployment

Linux (Ubuntu) with Apache is recommended for frontend deployment

1. Build backend jar (Requires Java, [See "Development Setup"](#Development-Setup))
   * Open terminal in `oswego-career-dashboard/backend`
     * Run `./gradlew build`
   * The build is located at `backend/build/libs`
   * Run the jar using `java -jar backend-X.X.X.jar`
2. Build frontend files (Requires Node.js, [See "Development Setup"](#Development-Setup))
   * Open terminal in `oswego-career-dashboard/frontend`
     * Run `npm run build`
   * Files output to `backend/src/main/resources/static` (**TODO:** change frontend output to make more sense)
3. Install Web Server
   * **Linux (Ubuntu):** 
     * Run `apt install apache2`
       * This will create the `/var/www/html` directory
4. Move all frontend build files into `/var/www/html`
   * **Linux (Ubuntu):**
     * Open a terminal in `oswego-career-dashboard`
     * Run `mv backend/src/main/resources/static/* /var/www/html`
5. Run the Web Server 
   * Start server with `systemctl start apache2` 
   * Restart using `systemctl restart apache2`
   * Stop using `systemctl stop apache2`

**Note:** Environment variables must be created before running the backend jar, [See "Running the app"](# Running-the-app).



## Troubleshooting
- Spring may not recognize changes in the db schema and will instead try to recreate tables that already exist
- If that happens, drop and recreate the db using the following commands (any data not in the migration scripts will be lost)
  - run `mysql -u backend -p`
  - enter the password for the backend
  - run `DROP DATABASE CRD;`
  - run `CREATE DATABASE CRD;`
