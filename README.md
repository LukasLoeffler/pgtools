# pgtools

Application for debugging applications that use postgres as DBMS.
The application aims to help the user to understand his application by displaying the database events triggered by the application in real time.

## General
Application built with python3 (server-side) and vue.js (client-side).
The sub-projects for front- and backend can be found in the respective folders.

## Note
The application uses postgres trigger and trigger functions to intercept the database events and to forward them via pg_notify. For this reason, before using the application, you should check whether the used names of the trigger or trigger functions interfer with your existing ones. 
Names used for
* triggers: **notify_trigger**
* trigger functions: **notify_event**

In addition, the application should only be used for development or debugging purposes, as the application has not yet been tested with high loads.

The application is currently under development. If you find bugs or have suggestions, don't hesitate and create an issue or create a pull request.
