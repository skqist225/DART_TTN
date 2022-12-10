[![Frontend Deploy Netlify Status](https://api.netlify.com/api/v1/badges/7c04b6fb-11dc-4b0c-bc8b-95db7e2a7d94/deploy-status)](https://app.netlify.com/sites/quiz-app-dart/deploys)

Tech Stack:
Frontend: Reactjs
Beckend: Spring Boot
Database: MySQL, AWS RDS
CI/CD: Jenkins
VM: AWS EC2

1. Installation

To run this application, you need to have below tools and technologies installed.
About the technology's version I use for this project.

```
JAVA_VERSION  = 11.0.16  : Runtime environment for Java Application
MAVEN_VERSION = 3.6.3    : Tool for building Java project.
NODE_VERION   = 14.0.0   : Runtime environment for Javascript Application.
MYSQL_VERSION = 8.0.29   : Database for storing application's data.
```

As I use Pop!os(Debian distributed) as the main operating system, I would like to guide you how to install above tools in Linux.

1.1 Java

```
  sudo apt-get update
  sudo apt install default-jdk
```

The default location of Java would be in /usr/lib/jvm/
Go to this folder: `cd /usr/lib/jvm/ && ls -la` to list your installed Java.
Copy and paste below two lines into your ~/.bashrc or ~/.zshrc

```
  export PATH="$PATH:/usr/lib/jvm/java-1.11.0-openjdk-amd64/bin"
  export JAVA_HOME="/usr/lib/jvm/java-1.11.0-openjdk-amd64/"
```

1.2 Maven

```
sudo apt install maven
```

1.3 NodeJS

1.4 Install and Setup MySQL
Change directory to Backend folder and run below command to download needed libraries.

```
  mvn install
```

Change directory to Admin folder and run below command to download needed libraries. The same goes for Frontend as well.

```
  npm install
```

Project deploy process:
Backend: 1. Code change 2. Push to Github 3. Build Jenkins job to deploy Backend to AWS EC2.
Frontend: 1. Code change 2. Build source code (npm run deploy). 3. Code will be pushed to github under gh-pages branch. 4. Netlify will listen change on the branch and redeploy Frontend.
