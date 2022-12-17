#!/bin/bash
#mysql -h airj18.cvkwid3ehrok.ap-southeast-1.rds.amazonaws.com -u admin -p12345678 quiz < quiz.sql

echo "SET FOREIGN_KEY_CHECKS = 0;" > ./temp.sql
mysqldump --add-drop-table --no-data -u root -p123456 quiz | grep 'DROP TABLE' >> ./temp.sql
echo "SET FOREIGN_KEY_CHECKS = 1;" >> ./temp.sql
mysql -u root -p quiz < ./temp.sql
rm -f ./temp.sql


cd ~/Projects/DART_TTN/Backend
mysql -h localhost -u root -p123456 quiz < quiz.sql

