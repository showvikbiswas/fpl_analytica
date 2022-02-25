<h1>FPL Analytica</h1>

FPL Analytica is a custom fantasy league playing platform which is a replica of Fantasy Premier League. This was my term project for CSE216 at Level 2 Term 2, BUET.

My project partner was Muhammad Ehsanul Kader, and the project was supervised by Dr. Rifat Shahriyar.

<h2>Project Overview</h2>

FPL Analytica was built with Django at the backend and React completely handing the frontend (handling routes and rendering webpages).

Features of FPL Analytica implemented till now:

1. Transfer of football players in and out of the fantasy team
2. Detailed statistics of each players for each gameweek played
3. Creation of leagues and inviting other players based on invite codes
4. Management of leagues including changing the league name and removing members
5. Picking the starting XI and choosing four substitutes
6. Calculation of gameweek points based on the chosen starting XI

<h2>Prerequisites</h2>

1. Getting the repository

```sh
   git clone https://github.com/showvikbiswas/fpl_analytica.git
   ```
   
2. Inside the fplanalytica folder, navigate to the **backend** folder.
3. Make sure the latest version of Python is installed.
4. Install pipenv
```sh
   pip install pipenv
   ```

5. Create a new pipenv environment inside **backend**


```sh
   pipenv shell
   ```

6. Install the following prerequisites


```sh
   pip install django
   ```

```sh
   pip install djoser
   ```

```sh
   pip install djangorestframework
   ```

```sh
   pip install cx_oracle
   ```


```sh
   pip install django-cors-headers
   ```

<h2>Setting up the database</h2>

1. Open SQL Plus
2. Connect to system using credentials
3.  Create a new user c##fpl

   ```sh
   create user c##fpl identified by password;
   grant dba to c##fpl;
   ```
4. Find the SQL dump in sql/dump.sql
5. Use a database GUI to connect to fpl and import the dump to the database

<h2>Configuring Django</h2>

In `fplanalytica/backend/auth_system/settings.py`, navigate to the **DATABASES** object, and replace the **USER** and **PASSWORD** fields in **fpl_db** with your Oracle credentials.

<h2>Launching the Application</h2>

At `fplanalytica/backend/`, with the pipenv shell activated, run the following

```sh
   python manage.py runserver
   ```
   
 The server should be up and running.
 
 <h2>Modifying the Frontend</h2>
 
 If you want to modify the frontend, once inside the **frontend** folder, run the following
 
 ```sh
   npm install
   ```
   
 Then with each modification made, run the following npm script with a shell that supports the rm and cp commands
 
 ```sh
   npm run build
   ```
 
 to apply the changes to the application.
 
