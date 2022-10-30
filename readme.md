Setup:
1. Download and install VS-Code
2. Install Addons (recommended for qol but not techinally necessary):
    - GitLab Workflow
    - ESLint
    - Prisma
    - npm
3. On Windows install "Windows Subsystem for Linux" (see: https://docs.microsoft.com/de-de/windows/wsl/install-win10) and the VS-Code "Remote-WSL" addon.
4. Install debian from the windows app store
5. Install NodeJS recommended is v16 (see: https://github.com/nodesource/distributions/blob/master/README.md)
    - sudo apt update
    - sudo apt install curl
    - sudo curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
    - sudo apt-get install -y nodejs
6. Install and setup the mariadb database
    - sudo apt update
    - sudo apt install mariadb-server
    - sudo /etc/init.d/mysql start
    - sudo mysql_secure_installation # If you use the default .env you need to create the user "root" with password "root" - if password is required upfront, although you didnt set one, use the following Explanation: https://www.codeflow.site/de/article/how-to-reset-your-mysql-or-mariadb-root-password
    - sudo mysql -u root -p # Login
    - CREATE DATABASE workshops_dev; # Create the Database
    - exit;
7. Start DB with "sudo service mysql start"
8. Clone the repository (via GitLab Workflow)
9. Setup & Install
    - npm install # download npm dependencies
    - npx next telemetry disable # disable telemetry of next js
    - npx husky install # set pre-commit hook (autoformats the code before each commit)
    - npx prisma generate # generate javascript objects depending on the db model
    - npx prisma db push # push the database model as defined in the code to the database
    - npx prisma db seed # add example data to the database
10. Use "npm run local" to launch your local development server
