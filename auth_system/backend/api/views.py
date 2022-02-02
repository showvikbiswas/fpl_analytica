from urllib.request import HTTPErrorProcessor
from django.shortcuts import render
from django.http import HttpResponse
from django.db import connections
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.


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
    query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, PLAYER_ID, TOTAL_POINTS TEAM FROM PLAYERS"
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
    query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, TOTAL_POINTS FROM PLAYERS WHERE PLAYER_ID='" + str(id) + "'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        reply = dictfetchall(cursor)
        return HttpResponse(json.dumps(reply), content_type="application/json")

def test(request):
    query = "SELECT FIRST_NAME FROM PLAYERS WHERE ELEMENT_TYPE='ERD'"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        reply = dictfetchall(cursor)
        return HttpResponse(json.dumps(reply), content_type="application/json")

def get_current_gw_team(request, id):
    query = "SELECT * FROM GW_TEAMS WHERE USER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)"
    with connections['fpl_db'].cursor() as cursor:
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if (reply == []):
            return HttpResponse(json.dumps(reply), content_type="application/json")
        else:
            GKs = reply[0]['GK']
            DEFs = reply[0]['DEF']
            MIDs = reply[0]['MID']
            FWDs = reply[0]['FWD']
            GKs = GKs.split(',')
            DEFs = DEFs.split(',')
            MIDs = MIDs.split(',')
            FWDs = FWDs.split(',')
            player_list = list()
            # Make query to database about each player
            for player in GKs:
                query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, PLAYER_ID, TEAM, TOTAL_POINTS FROM PLAYERS WHERE PLAYER_ID='" + str(player) + "'"
                cursor.execute(query)
                reply = dictfetchall(cursor)
                player_list.append(reply[0])
            for player in DEFs:
                query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, PLAYER_ID, TEAM, TOTAL_POINTS FROM PLAYERS WHERE PLAYER_ID='" + str(player) + "'"
                cursor.execute(query)
                reply = dictfetchall(cursor)
                player_list.append(reply[0])
            for player in MIDs:
                query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, PLAYER_ID, TEAM, TOTAL_POINTS FROM PLAYERS WHERE PLAYER_ID='" + str(player) + "'"
                cursor.execute(query)
                reply = dictfetchall(cursor)
                player_list.append(reply[0])
            for player in FWDs:
                query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, PLAYER_ID, TEAM, TOTAL_POINTS FROM PLAYERS WHERE PLAYER_ID='" + str(player) + "'"
                cursor.execute(query)
                reply = dictfetchall(cursor)
                player_list.append(reply[0])
            return HttpResponse(json.dumps(player_list), content_type="application/json")

@csrf_exempt
def confirm_gw_team(request, id):
    query = "SELECT * FROM GW_TEAMS WHERE USER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)"
    body = json.loads(request.body)
    team = body['team']
    newBudget = body['newBudget']
    cost = body['cost']
    newFreeTransfers = body['newFreeTransfers']
    if (newFreeTransfers < 0):
        newFreeTransfers = 0
    with connections['fpl_db'].cursor() as cursor:
        query = 'SELECT CURRENT_GW FROM GENERAL'
        cursor.execute(query)
        reply = dictfetchall(cursor)
        current_gw = int(reply[0]["CURRENT_GW"])
        defs = str()
        gks = str()
        mids = str()
        fwds = str()
        subs = str()
        for player in team:
            if player['ELEMENT_TYPE'] == "GK":
                gks += str(player['PLAYER_ID']) + ","
            elif player['ELEMENT_TYPE'] == "DEF":
                defs += str(player['PLAYER_ID']) + ","
            if player['ELEMENT_TYPE'] == "MID":
                mids += str(player['PLAYER_ID']) + ","
            if player['ELEMENT_TYPE'] == "FWD":
                fwds += str(player['PLAYER_ID']) + ","
        subs += gks.split(',')[0] + "," + defs.split(',')[0] + "," + mids.split(',')[0] + "," + fwds.split(',')[0]
        print(subs) 
        query = "SELECT USER_ID FROM GW_TEAMS WHERE USER_ID ='" + str(id) + "'"
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply == []:
            # New gameweek entry
            query = "INSERT INTO GW_TEAMS (USER_ID, GW, GK, DEF, MID, FWD, SUBS) VALUES ('" + str(id) + "', '" + str(current_gw) + "', '" + gks.strip(",") + "', '" + defs.strip(",") + "', '" + mids.strip(",") + "', '" + fwds.strip(",") + "', '" + subs + "')"
            cursor.execute(query)
        else:
            # Updating current gameweek entry
            query = "UPDATE GW_TEAMS SET GK='" + gks.strip(",") + "', DEF='" + defs.strip(",") + "', MID='" + mids.strip(",") + "', FWD='" + fwds.strip(",") + "', SUBS='" + subs + "' WHERE USER_ID='" + str(id) + "' AND GW='" + str(current_gw) + "'"
            cursor.execute(query)
        query = "SELECT TOTAL_POINTS FROM FPL_PLAYERS WHERE USER_ID='" + str(id) + "'"
        cursor.execute(query)
        total_points = dictfetchall(cursor)[0]['TOTAL_POINTS']
        query = "UPDATE FPL_PLAYERS SET BUDGET = '" + str(newBudget) + "', FREE_TRANSFERS='" + str(newFreeTransfers) + "', TOTAL_POINTS='" + str(int(total_points)+cost) + "' WHERE USER_ID='" + str(id) + "'"
        cursor.execute(query)
        query = "SELECT * FROM FPL_PLAYERS WHERE USER_ID='" + str(id) + "'"
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")
