from urllib.request import HTTPErrorProcessor
from django.shortcuts import render
from django.http import HttpResponse
from django.db import connections
import json

# Create your views here.

def index(request, id):
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(f'SELECT FIRST_NAME, LAST_NAME from EMPLOYEES')
        return HttpResponse(json.dumps(dictfetchall(cursor)))

def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

def create_user(request):
    body = json.loads(request.body)
    name = body['name']
    email = body['email']

    query = "INSERT INTO USERS (NAME, EMAIL) VALUES ('" + name + "', '" + email + "')"
    
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        return HttpResponse("<p>User Created.</p>")

def finalize_user(request):
    body = json.loads(request.body)
    age = body['age']
    favclub = body['favclub']
    fplteam = body['fplteam']
    email = body['email']

    query = 'UPDATE USERS SET AGE = ' + age + ", TEAM_NAME='" + fplteam + "', FAVOURITE_CLUB='" + favclub + "', PROFILE_COMPLETE='Y' WHERE EMAIL='" + email + "'"

    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
    
    query = "SELECT * FROM USERS WHERE EMAIL='" + email + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user))


def get_user(request):
    email = None
    if (request.GET['email']):
        email = request.GET['email']
    
    query = "SELECT * FROM USERS WHERE EMAIL='" + email + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user))

def get_teams(request):
    query = "SELECT ID, NAME FROM TEAMS"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")
