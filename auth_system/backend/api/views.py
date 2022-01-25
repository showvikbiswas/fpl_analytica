from urllib.request import HTTPErrorProcessor
from django.shortcuts import render
from django.http import HttpResponse
from django.db import connections
import json
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
def create_user(request):
    body = json.loads(request.body)
    name = body['name']
    email = body['email']

    query = "INSERT INTO FPL_PLAYERS (NAME, EMAIL) VALUES ('" + name + "', '" + email + "')"
    
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        return HttpResponse("<p>User Created.</p>")

@csrf_exempt
def finalize_user(request):
    body = json.loads(request.body)
    name = body['name']
    id = body['id']
    age = body['age']
    favclub = body['favclub']
    fplteam = body['fplteam']
    email = body['email']

    print(request.body)

    query = "INSERT INTO FPL_PLAYERS (NAME, TEAM_NAME, PROFILE_COMPLETE, BUDGET, FAVOURITE_CLUB, EMAIL, USER_ID, TOTAL_POINTS) VALUES ('" + name + "', '" + fplteam + "', 'Y', '100', '" + favclub + "',  '" + email + "', '" + str(id) + "', '0')"

    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
    
    query = "SELECT * FROM FPL_PLAYERS WHERE EMAIL='" + email + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user))


def get_user(request):
    id = None
    if (request.GET['id']):
        id = request.GET['id']
    
    query = "SELECT * FROM FPL_PLAYERS WHERE USER_ID='" + id + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        if len(user) == 0:
            return HttpResponse('no user found')
        print(len(user))
        return HttpResponse(json.dumps(user))

def get_teams(request):
    query = "SELECT ID, NAME FROM TEAMS"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")

def get_players(request):
    query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST FROM PLAYERS"
    param_list = list(request.GET.items())
    query_length = len(param_list)
    if (query_length >= 1):
        query += " WHERE "
    i = 0
    for (key, value) in param_list:
        query += key + "='" + value + "'"
        if (query_length - i > 1):
            query += " AND "
        i = i+1
    print(query)
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")

def get_player(request, id):
    query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST FROM PLAYERS WHERE PLAYER_ID='" + str(id) + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")

def test(request):
    query = "SELECT FIRST_NAME FROM PLAYERS WHERE ELEMENT_TYPE='ERD'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")

def get_current_gw_team(request, id):
    query = "SELECT * FROM GW_TEAMS WHERE USER_ID='" + str(id) + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")
