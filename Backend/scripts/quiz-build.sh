#!/bin/bash
DB_URL=$1
DB_USER=$2
DB_PASS=$3

sudo systemctl stop tomcat
sleep 10
sudo rm -rf /opt/tomcat/webapps/ROOT*
aws s3 cp s3://airj18/AirTNT-0.0.1-SNAPSHOT.war .
sudo cp AirTNT-0.0.1-SNAPSHOT.war /opt/tomcat/webapps/ROOT.war
sudo systemctl start tomcat
sleep 10
sudo rm -rf /opt/tomcat/webapps/ROOT/WEB-INF/classes/application.properties

cat <<EOF | sudo tee - a /opt/tomcat/webapps/ROOT/WEB-INF/classes/application.properties
server.port=8080
server.servlet.context-path=/
spring.datasource.url=jdbc:mysql://$DB_URL:3306/quiz?useUnicode=true&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull
spring.datasource.username=$DB_USER
spring.datasource.password=$DB_PASS

jwt.secret=hjGIZoKeIYDnHA2xaN43acQoG10gzNybgy1X1zuKOPTiN0NZ9kzdSFv1IPzzKb2hvRmd3xN43acQoG10gzNybgy1X1zuKOPTiN0NZ9kzdSFv1IPzzKb2hvRm
env=prod

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

EOF

sudo systemctl restart tomcat
