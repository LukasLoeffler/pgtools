# pgtools

Application for debugging applications that use postgres as DBMS.
The application aims to help the user to understand his application by visualizing the database events triggered by the application in real time.

## General
Application built with python3 (server-side) and vue.js (client-side).
The sub-projects for front- and backend can be found in the respective folders.

## Note
The application uses postgres trigger and trigger functions to intercept the database events and to forward them via pg_notify. For this reason, before using the application, you should check whether trigger or trigger functions with the same name exist.
Names used by default for
* triggers: **notify_trigger**
* trigger functions: **notify_event**