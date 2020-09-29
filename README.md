# pgtools

Application for debugging applications that use postgres as DBMS.
The application aims to help the user to understand their application by displaying the database events triggered by the application in real time.

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

## Screenshots
### Connection Manager
In the connection manager you can manage your connections. This includes the creation, activation, deactivation and deletion of said connections.
Via the green play button you can activate connections to spectate them. You will only see the events of the active databases. Via the pause button you can stop listening to the database events of the connections.
![Connections](https://i.imgur.com/O5EsSeY.png)
![Create connection](https://i.imgur.com/zszR3cU.png)
### Trigger
In the trigger tab you can switch between all active connections in the upper right corner. In this view you can choose which tables in the database should throw events. If you want to watch the whole database you can check all connections.
![Detail view](https://i.imgur.com/3pHdY1O.png)
### Watcher - Event View
The event view shows the database events with information about time, type, database, table and the dataId. Every time an event is thrown it will appear on top of the table. In this view you can filter by database, table and dataId. In order to get to the detailed view, at least the database and the table must be selected. The detail view can be activated/deactivated by the toggle button in the upper right corner.
![Event view](https://i.imgur.com/IKDROaK.png)
### Watcher - Detail View
The detail view shows all data of the changed entity. If specific fields changed these changes are highlighted red.
![Detail view](https://i.imgur.com/ss0Xt8h.png)
### Quick Commands
Frequently used db commands can be created and executed from the user interface.
![Quick commands - Create](https://imgur.com/OJO3CBU.png)
The overview tab shows if the query was successful. The table tab shows the retrieved data in a table (if possible)
![Quick commands - Execute](https://i.imgur.com/iDdKl2c.png)
