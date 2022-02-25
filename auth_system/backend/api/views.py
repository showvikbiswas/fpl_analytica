from operator import truediv
from urllib.request import HTTPErrorProcessor
from django.shortcuts import render
from django.http import HttpResponse
from django.db import connections
import json
from django.views.decorators.csrf import csrf_exempt
from .utils import generate_code

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

    query = "INSERT INTO FPL_PLAYERS (NAME, TEAM_NAME, PROFILE_COMPLETE, BUDGET, FAVOURITE_CLUB, EMAIL, USER_ID, TOTAL_POINTS) VALUES ('" + name + "', '" + fplteam + "', 'Y', '1000', '" + favclub + "',  '" + email + "', '" + str(id) + "', '0')"

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
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT MAX(GW) GAMEWEEK FROM GAMEWEEK WHERE HAS_STARTED = 'Y'"
        cursor.execute(query)
        reply = dictfetchall(cursor)
        print(reply)
        current_gw = reply[0]['GAMEWEEK']
        query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, PLAYER_ID, TOTAL_POINTS, NOW_COST, TEAM FROM PLAYERS"
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
        
        cursor.execute(query)
        players = dictfetchall(cursor)
        for player in players:
            print(player['PLAYER_ID'])
            query = "SELECT GW_PRICE FROM PLAYER_STATS WHERE GW={} AND PLAYER_ID={}".format(current_gw, player['PLAYER_ID'])
            cursor.execute(query)
            reply = dictfetchall(cursor) 
            if(len(reply) != 0):
                gw_price = reply[0]
                player['NOW_COST'] = gw_price['GW_PRICE']
        return HttpResponse(json.dumps(players), content_type="application/json")

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
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT * FROM GW_TEAMS_PLAYERS WHERE FPL_PLAYER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)"
        cursor.execute(query)
        reply = dictfetchall(cursor)
        # print(reply)
        if (reply == []):
            return HttpResponse(json.dumps(reply), content_type="application/json")

        else:
            player_list = list()
            sub_list = list()
            # Make query to database about each player
            for player in reply:
                # print("all hail bangladesh", player['PLAYER_ID'])
                query = "SELECT FIRST_NAME || ' ' || SECOND_NAME FULLNAME, ELEMENT_TYPE, NOW_COST, PLAYER_ID, TEAM, TOTAL_POINTS FROM PLAYERS WHERE PLAYER_ID='" + str(player['PLAYER_ID']) + "'"
                cursor.execute(query)
                reply_element = dictfetchall(cursor)
                player_list.append(reply_element[0])
                if (player['IS_STARTING'] == 'N'):
                    sub_list.append(reply_element[0])
            query = "SELECT CAPTAIN, VICE_CAPTAIN FROM GW_TEAMS WHERE USER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)"
            cursor.execute(query)
            reply = dictfetchall(cursor)
            CAPTAIN = reply[0]['CAPTAIN']
            VICE_CAPTAIN = reply[0]['VICE_CAPTAIN']
            data = {
                "team": player_list,
                "subs": sub_list,
                "captain": CAPTAIN,
                "vice_captain": VICE_CAPTAIN,
            }
            return HttpResponse(json.dumps(data), content_type="application/json") # your code goes here
            
# def get_points(request, id, gw):
#      with connections['fpl_db'].cursor() as cursor:
#         query = "SELECT PLAYER_ID FROM GW_TEAMS_PLAYERS WHERE USER_ID='" + str(id) + "'" + " AND GW = SELECT MAX(GW) GAMEWEEK FROM FIXTURES WHERE FINISHED = 'TRUE'"
#         cursor.execute(query)
#         reply = dictfetchall(cursor)
#         player_list = list()
#         for player in reply:
#                 query = "SELECT NAME, PLAYER_ID, TEAM, TOTAL_POINTS POINTS FROM PLAYER_STATS WHERE PLAYER_ID='"+str(player.PLAYER_ID)+"'"+ " AND GW = (SELECT MAX(GW) GAMEWEEK FROM FIXTURES WHERE FINISHED = 'TRUE')"
#                 cursor.execute(query)
#                 reply = dictfetchall(cursor)
        
        

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
        query = "select MAX(GW) from GAMEWEEK where HAS_STARTED='Y'"
        cursor.execute(query)
        reply = dictfetchall(cursor)
        current_gw = int(reply[0]["MAX(GW)"])

        # populate gw_teams
        # check whether there is a team made or not
        query = "SELECT * FROM GW_TEAMS WHERE USER_ID='{}' AND GW='{}'".format(id, current_gw)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply == []:
            # if no team present team
            query = "INSERT INTO GW_TEAMS (USER_ID, GW, CAPTAIN, VICE_CAPTAIN) VALUES ('{}', '{}', '{}', '{}')".format(id, current_gw, team[5]['PLAYER_ID'], team[6]['PLAYER_ID'])
            cursor.execute(query)

        # if team present then
        # populate gw_teams_players
        query = "SELECT * FROM GW_TEAMS_PLAYERS WHERE GW='{}' AND FPL_PLAYER_ID='{}'".format(current_gw, id)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply != []:
            # if a team already exists, delete that entire team and renew
            query = "DELETE FROM GW_TEAMS_PLAYERS WHERE GW='{}' AND FPL_PLAYER_ID='{}'".format(current_gw, id)
            cursor.execute(query)
        
        # new gameweek entry
        for player in team:
            query = "INSERT INTO GW_TEAMS_PLAYERS (GW, FPL_PLAYER_ID, PLAYER_ID) VALUES ('{}', '{}', '{}')".format(current_gw, id, player['PLAYER_ID'])
            cursor.execute(query)
        # add one of each to the subs list
        s_gk = s_def = s_mid = s_fwd = False
        for player in team:
            if not s_gk and player['ELEMENT_TYPE'] == 'GK':
                s_gk = True
                query = "UPDATE GW_TEAMS_PLAYERS SET IS_STARTING='N' WHERE GW='{}' AND FPL_PLAYER_ID='{}' AND PLAYER_ID='{}'".format(current_gw, id, player['PLAYER_ID'])
                cursor.execute(query)
            
            if not s_def and player['ELEMENT_TYPE'] == 'DEF':
                s_def = True
                query = "UPDATE GW_TEAMS_PLAYERS SET IS_STARTING='N' WHERE GW='{}' AND FPL_PLAYER_ID='{}' AND PLAYER_ID='{}'".format(current_gw, id, player['PLAYER_ID'])
                cursor.execute(query)
            
            if not s_mid and player['ELEMENT_TYPE'] == 'MID':
                s_mid = True
                query = "UPDATE GW_TEAMS_PLAYERS SET IS_STARTING='N' WHERE GW='{}' AND FPL_PLAYER_ID='{}' AND PLAYER_ID='{}'".format(current_gw, id, player['PLAYER_ID'])
                cursor.execute(query)
            
            if not s_fwd and player['ELEMENT_TYPE'] == 'FWD':
                s_fwd = True
                query = "UPDATE GW_TEAMS_PLAYERS SET IS_STARTING='N' WHERE GW='{}' AND FPL_PLAYER_ID='{}' AND PLAYER_ID='{}'".format(current_gw, id, player['PLAYER_ID'])
                cursor.execute(query)

        # update gw_team entry (cost, captain, and vice captain)
        query = "SELECT CAPTAIN, VICE_CAPTAIN FROM GW_TEAMS WHERE USER_ID='{}' AND GW='{}'".format(id, current_gw)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        prev_captain_id = reply[0]['CAPTAIN']
        prev_vice_captain_id = reply[0]['VICE_CAPTAIN']
        # check whether captain is playing in newly confirmed team
        query = "SELECT * FROM GW_TEAMS_PLAYERS WHERE GW='{}' AND FPL_PLAYER_ID='{}' AND PLAYER_ID='{}'".format(current_gw, id, prev_captain_id)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply == []:
            query = "UPDATE GW_TEAMS SET CAPTAIN='{}' WHERE USER_ID='{}' AND GW='{}'".format(team[5]['PLAYER_ID'], id, current_gw)

        # check whether vice captain is playing in newly confirmed team
        query = "SELECT * FROM GW_TEAMS_PLAYERS WHERE GW='{}' AND FPL_PLAYER_ID='{}' AND PLAYER_ID='{}'".format(current_gw, id, prev_vice_captain_id)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply == []:
            query = "UPDATE GW_TEAMS SET VICE_CAPTAIN='{}' WHERE USER_ID='{}' AND GW='{}'".format(team[6]['PLAYER_ID'], id, current_gw)
        
        # update gw_points
        query = "SELECT GW_POINTS FROM GW_TEAMS WHERE USER_ID='{}' AND GW='{}'".format(id, current_gw)
        cursor.execute(query)
        gw_points = dictfetchall(cursor)[0]['GW_POINTS']
        query = "UPDATE GW_TEAMS SET GW_POINTS='{}' WHERE USER_ID='{}' AND GW='{}'".format(int(gw_points)+cost, id, current_gw)
        cursor.execute(query)

        # update fpl_player
        query = "SELECT TOTAL_POINTS FROM FPL_PLAYERS WHERE USER_ID='{}'".format(id)
        cursor.execute(query)
        total_points = dictfetchall(cursor)[0]['TOTAL_POINTS']
        query = "UPDATE FPL_PLAYERS SET BUDGET = '" + str(newBudget) + "', FREE_TRANSFERS='" + str(newFreeTransfers) + "', TOTAL_POINTS='" + str(int(total_points)+cost) + "' WHERE USER_ID='" + str(id) + "'"
        cursor.execute(query)
        query = "SELECT * FROM FPL_PLAYERS WHERE USER_ID='" + str(id) + "'"
        cursor.execute(query)
        user = dictfetchall(cursor)
        return HttpResponse(json.dumps(user), content_type="application/json")


        
        # query = "SELECT USER_ID FROM GW_TEAMS WHERE USER_ID ='" + str(id) + "'"
        # cursor.execute(query)
        # reply = dictfetchall(cursor)
        # if reply == []:
        #     # New gameweek entry
        #     query = "INSERT INTO GW_TEAMS (USER_ID, GW, GK, DEF, MID, FWD, SUBS) VALUES ('" + str(id) + "', '" + str(current_gw) + "', '" + gks.strip(",") + "', '" + defs.strip(",") + "', '" + mids.strip(",") + "', '" + fwds.strip(",") + "', '" + subs + "')"
        #     cursor.execute(query)
        # else:
        #     # Updating current gameweek entry
        #     query = "UPDATE GW_TEAMS SET GK='" + gks.strip(",") + "', DEF='" + defs.strip(",") + "', MID='" + mids.strip(",") + "', FWD='" + fwds.strip(",") + "', SUBS='" + subs + "' WHERE USER_ID='" + str(id) + "' AND GW='" + str(current_gw) + "'"
        #     cursor.execute(query)
        # query = "SELECT TOTAL_POINTS FROM FPL_PLAYERS WHERE USER_ID='" + str(id) + "'"
        # cursor.execute(query)
        # total_points = dictfetchall(cursor)[0]['TOTAL_POINTS']
        # query = "UPDATE FPL_PLAYERS SET BUDGET = '" + str(newBudget) + "', FREE_TRANSFERS='" + str(newFreeTransfers) + "', TOTAL_POINTS='" + str(int(total_points)+cost) + "' WHERE USER_ID='" + str(id) + "'"
        # cursor.execute(query)
        # query = "SELECT * FROM FPL_PLAYERS WHERE USER_ID='" + str(id) + "'"
        # cursor.execute(query)
        # user = dictfetchall(cursor)
        # return HttpResponse(json.dumps(user), content_type="application/json")


def get_user_leagues(request, id):
     with connections['fpl_db'].cursor() as cursor:
        query = "SELECT LEAGUE_ID FROM LEAGUES_FPL_PLAYERS WHERE PLAYER_ID='{}'".format(id)
        cursor.execute(query)
        league_ids = dictfetchall(cursor)
        leagues = list()
        for league_id in league_ids:
            query = "SELECT NAME, ADMIN, ID FROM LEAGUES WHERE ID='{}'".format(league_id['LEAGUE_ID'])
            cursor.execute(query)
            league = dictfetchall(cursor)
            query = "select RANK from (SELECT PLAYER_ID, POINTS, ROW_NUMBER() OVER (ORDER BY POINTS DESC) RANK FROM LEAGUES_FPL_PLAYERS WHERE LEAGUE_ID='{}') WHERE PLAYER_ID='{}'".format(league_id['LEAGUE_ID'], id)
            cursor.execute(query)
            rank = dictfetchall(cursor)[0]['RANK']
            league[0]['RANK'] = rank
            leagues.append(league[0])
        return HttpResponse(json.dumps(leagues), content_type="application/json")

def get_league(request, id):
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT * FROM LEAGUES WHERE ID='{}'".format(id)
        cursor.execute(query)
        league = dictfetchall(cursor)[0]
        return HttpResponse(json.dumps(league), content_type="application/json")
    

def create_league(request):
    body = json.loads(request.body)
    league_name = body['name']
    admin_id = body['id']
    with connections['fpl_db'].cursor() as cursor:
        invite_code = str()
        while True:
            invite_code = generate_code(6)
            query = "SELECT INVITE_CODE FROM LEAGUES WHERE INVITE_CODE='{}'".format(invite_code)
            cursor.execute(query)
            reply = dictfetchall(cursor)
            # if no code found, exit while loop
            if len(reply) == 0:
                break
        # create entry in leagues table
        # corresponding relation with player is created using trigger in database
        query = "INSERT INTO LEAGUES (NAME, ADMIN, INVITE_CODE) VALUES ('{}', '{}', '{}')".format(league_name, admin_id, invite_code)
        cursor.execute(query)
        reply = {'league_name': league_name, 'invite_code': invite_code}
        return HttpResponse(json.dumps(reply), content_type="application/json")

@csrf_exempt
def join_league(request):
    body = json.loads(request.body)
    league_code = body['code']
    player_id = body['id']
    # check whether code is valid
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT * FROM LEAGUES WHERE INVITE_CODE='{}'".format(league_code)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply == []:
            # if code invalid
            return HttpResponse("league not found")
        league_id = reply[0]['ID']
        query = "SELECT * FROM LEAGUES_FPL_PLAYERS WHERE LEAGUE_ID='{}' AND PLAYER_ID='{}'".format(league_id, player_id)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        if reply != []:
            return HttpResponse('already joined')
        query = "INSERT INTO LEAGUES_FPL_PLAYERS (LEAGUE_ID, PLAYER_ID) VALUES ('{}', '{}')".format(league_id, player_id)
        cursor.execute(query)
        return HttpResponse("join success")

def get_league_players(request, id):
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT PLAYER_ID FROM LEAGUES_FPL_PLAYERS WHERE LEAGUE_ID='{}'".format(id)
        cursor.execute(query)
        players = dictfetchall(cursor)
        player_list = list()
        for player in players:
            query = "SELECT MAX(GW) GAMEWEEK FROM GAMEWEEK WHERE HAS_STARTED = 'Y'"
            cursor.execute(query)
            gw_reply = dictfetchall(cursor)
            current_gw = int(gw_reply[0]["GAMEWEEK"])
            query = "select FPL_PLAYERS.NAME, FPL_PLAYERS.USER_ID, FPL_PLAYERS.TEAM_NAME, GW_TEAMS.GW_POINTS, LFP.POINTS TOTAL_POINTS FROM FPL_PLAYERS JOIN GW_TEAMS ON FPL_PLAYERS.USER_ID = GW_TEAMS.USER_ID JOIN LEAGUES_FPL_PLAYERS LFP on FPL_PLAYERS.USER_ID = LFP.PLAYER_ID WHERE LFP.LEAGUE_ID='{}' AND GW_TEAMS.USER_ID='{}' AND GW_TEAMS.GW='{}'".format(id, player['PLAYER_ID'], current_gw)
            print("QUERY: " + query)
            cursor.execute(query)
            reply = dictfetchall(cursor) 
            print("REPLY: ")
            print(reply)
            player_list.append(reply[0]) 
            
        return HttpResponse(json.dumps(player_list), content_type="application/json") 

@csrf_exempt
def edit_league(request, id):
    body = json.loads(request.body)
    with connections['fpl_db'].cursor() as cursor:
        if 'leagueName' in body.keys():
            query = "UPDATE LEAGUES SET NAME='{}' WHERE ID='{}'".format(body['leagueName'], id)
            cursor.execute(query)
        
        if 'newAdminId' in body.keys():
            query = "UPDATE LEAGUES SET ADMIN='{}' WHERE ID='{}'".format(body['newAdminId'], id)
            cursor.execute(query)
            return HttpResponse("admin updated")

    return HttpResponse("dummy")

@csrf_exempt
def leave_league(request, lid, pid):
    with connections['fpl_db'].cursor() as cursor:
        # make initial query about whether player is admin of current league or not
        query = "SELECT ADMIN FROM LEAGUES WHERE ID='{}'".format(lid)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        print(reply[0]['ADMIN'])
        if int(reply[0]['ADMIN']) == pid:
            return HttpResponse('Player is admin of selected league and cannot be removed.')

        query = "DELETE FROM LEAGUES_FPL_PLAYERS WHERE LEAGUE_ID='{}' AND PLAYER_ID='{}'".format(lid, pid)
        cursor.execute(query)
        return HttpResponse("user deleted", content_type="application/json")

@csrf_exempt
def delete_league(request, id):
     with connections['fpl_db'].cursor() as cursor:
        # make initial query about whether player is admin of current league or not
        query = "DELETE FROM LEAGUES WHERE ID='{}'".format(id)
        cursor.execute(query)
        return HttpResponse("league deleted")
        
@csrf_exempt
def confirm_playing_team(request, id):
    body = json.loads(request.body)
    print(body)
    team = body['teamData']
    captain = body['captainData']
    vice_captain = body['viceCaptainData']
    print(captain)
    print(vice_captain)
    with connections['fpl_db'].cursor() as cursor:
        for player in team:
            query = "UPDATE GW_TEAMS_PLAYERS SET IS_STARTING='"+str(player['IS_STARTING']) + "'" + " WHERE FPL_PLAYER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)" + " AND PLAYER_ID ='"+str(player['PLAYER_ID'])+ "'"
            cursor.execute(query)
    with connections['fpl_db'].cursor() as cursor:
            query = "UPDATE  GW_TEAMS SET CAPTAIN='"+str(captain)+"'"+ " WHERE USER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)"
            cursor.execute(query)
            query = "UPDATE  GW_TEAMS SET VICE_CAPTAIN='"+str(vice_captain)+"'"+ " WHERE USER_ID='" + str(id) + "'" + " AND GW = (SELECT MAX(GW) FROM GW_TEAMS)"                                                                                                                                                                                                                                                                                                                                                                                    
            cursor.execute(query)
    return HttpResponse(json.dumps("success"), content_type="application/json")

@csrf_exempt
def get_fixtures(request):                    
    with connections['fpl_db'].cursor() as cursor:
        query = """SELECT T1.NAME H_TEAM, T2.NAME A_TEAM FROM (SELECT HOME_TEAM, AWAY_TEAM FROM FIXTURES 
                    WHERE GW = (SELECT MAX(GW)+1 FROM GAMEWEEK WHERE HAS_FINISHED = 'Y') ) F
                    JOIN TEAMS T1
                    ON ( T1.ID = F.HOME_TEAM)
                    JOIN TEAMS T2
                    ON ( T2.ID = F.AWAY_TEAM)"""
        cursor.execute(query)
        fixtures = dictfetchall(cursor)
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT MAX(GW)+1 GAMEWEEK FROM FIXTURES WHERE FINISHED = 'TRUE'"                              
        cursor.execute(query)
        reply = dictfetchall(cursor)
        gameweek = reply[0]['GAMEWEEK']
    data = {
             "fixtures": fixtures,
             "gameweek": gameweek,
        }
    print("fixtures",data)
    return HttpResponse(json.dumps(data), content_type="application/json")

# Players API
def get_player_stats(request, id):
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT * FROM PLAYER_STATS WHERE PLAYER_ID={} ORDER BY GW".format(id)
        cursor.execute(query)
        data = dictfetchall(cursor)
        print(data[0])
        for item in data:
            query = "select MATCH_ID, HOME_TEAM_SCORE, AWAY_TEAM_SCORE, T1.SHORT_NAME HOME_TEAM_NAME, T2.SHORT_NAME AWAY_TEAM_NAME from FIXTURES join TEAMS T1 on FIXTURES.HOME_TEAM = T1.ID join TEAMS T2 ON FIXTURES.AWAY_TEAM = T2.ID WHERE MATCH_ID={}".format(item['FIXTURE'])
            cursor.execute(query)
            reply = dictfetchall(cursor)
            if item['WAS_HOME'] == 'TRUE':
                item['OPPONENT_TEAM'] = "{} (H) {} - {}".format(reply[0]['AWAY_TEAM_NAME'], reply[0]["HOME_TEAM_SCORE"], reply[0]["AWAY_TEAM_SCORE"])
            else:
                item['OPPONENT_TEAM'] = "{} (A) {} - {}".format(reply[0]['HOME_TEAM_NAME'], reply[0]["AWAY_TEAM_SCORE"], reply[0]["HOME_TEAM_SCORE"])
        return HttpResponse(json.dumps(data, default=str), content_type="application/json")


def make_player_data(name, team, position):
    player_dict ={'NAME':name, 'TEAM':team, 'POSITION':position, 'PLAYED':0, 'MINUTES':0, 'POINTS':0, 'GOALS':0, 'ASSISTS':0,
                'CS':0, 'YELLOW':0, 'RED':0, 'BONUS':0, 'PENALTIES_MISSED':0, 'PENALTIES_SAVED':0}
    return player_dict

def get_points(request, id):
     with connections['fpl_db'].cursor() as cursor:
        query = "SELECT MAX(GW) GAMEWEEK FROM GAMEWEEK WHERE HAS_FINISHED = 'Y'"                              
        cursor.execute(query)
        reply = dictfetchall(cursor)
        gw = reply[0]['GAMEWEEK']
        query = "SELECT CAPTAIN, VICE_CAPTAIN, GW_POINTS FROM GW_TEAMS WHERE USER_ID='" + str(id) + "'" + " AND GW = '"+str(gw)+"'"
        cursor.execute(query)
        reply = dictfetchall(cursor)
        print(reply[0])
        CAPTAIN = reply[0]['CAPTAIN']
        VICE_CAPTAIN = reply[0]['VICE_CAPTAIN']
        GW_POINTS = reply[0]['GW_POINTS']
        print(reply)
        query = """SELECT G.PLAYER_ID, G.IS_STARTING, (P.FIRST_NAME||' '|| P.SECOND_NAME) NAME, P.TEAM, P.ELEMENT_TYPE POSITION
                FROM (SELECT PLAYER_ID, IS_STARTING FROM GW_TEAMS_PLAYERS WHERE FPL_PLAYER_ID='{}' AND GW = '{}') G JOIN  PLAYERS P
                ON (G.PLAYER_ID = P.PLAYER_ID)
                ORDER BY IS_STARTING DESC, CASE 
                    WHEN POSITION = 'GK' THEN 1
                    WHEN POSITION = 'DEF' THEN 2
                    WHEN POSITION = 'MID' THEN 3
                    ELSE 4 END;""".format(id, gw)
        cursor.execute(query)
        reply = dictfetchall(cursor)
        print(reply)
        starter_list = list()
        subs_list = list()
        count = 0
        for player in reply:
                query = """SELECT NAME, TEAM, POSITION, COUNT(*) PLAYED, SUM(MINUTES) MINUTES, SUM(TOTAL_POINTS) POINTS, SUM(GOALS_SCORED) GOALS,
                    SUM(ASSISTS) ASSISTS, SUM(CLEAN_SHEETS) CS, SUM(YELLOW_CARD) YELLOW, SUM(RED_CARDS) RED, SUM(BONUS) BONUS, 
                    SUM(PENALTIES_MISSED) PENALTIES_MISSED, SUM(PENALTIES_SAVED) PENALTIES_SAVED
                    FROM PLAYER_STATS
                    WHERE PLAYER_ID = '{}' AND GW = '{}' GROUP BY PLAYER_ID, NAME, TEAM, POSITION""".format(player['PLAYER_ID'], gw)
                cursor.execute(query)
                reply = dictfetchall(cursor)
                print("S/n",reply)
                count = count + 1
                if reply == []:
                    player_dict = make_player_data(player['NAME'], player['TEAM'], player['POSITION'])
                    if count < 12:
                        starter_list.append(player_dict)
                    else:
                        subs_list.append(player_dict)
                else:
                    if player['PLAYER_ID'] == CAPTAIN:
                        reply[0]['POINTS'] = 2 * reply[0]['POINTS']
                    if count < 12:
                        starter_list.append(reply[0])
                    else:
                        subs_list.append(reply[0])

        
        data = {
                "gameweek": gw,
                "starter_points": starter_list,
                "subs_points": subs_list,
                "captain": CAPTAIN,
                "vice_captain": VICE_CAPTAIN,
                "gw_points": GW_POINTS,
            }
        print(data)
        return HttpResponse(json.dumps(data), content_type="application/json")


def get_results(request):                    
    with connections['fpl_db'].cursor() as cursor:
        query = "SELECT MAX(GW) GAMEWEEK FROM GAMEWEEK WHERE HAS_FINISHED = 'Y'"                              
        cursor.execute(query)
        reply = dictfetchall(cursor)
        gameweek = reply[0]['GAMEWEEK']
        query = """SELECT T1.NAME H_TEAM, F.HOME_TEAM_SCORE H_TEAM_SCORE, T2.NAME A_TEAM , F.AWAY_TEAM_SCORE A_TEAM_SCORE
                    FROM (SELECT HOME_TEAM, HOME_TEAM_SCORE, AWAY_TEAM, AWAY_TEAM_SCORE FROM FIXTURES 
                    WHERE GW = '{}' ) F
                    JOIN TEAMS T1
                    ON ( T1.ID = F.HOME_TEAM)
                    JOIN TEAMS T2
                    ON ( T2.ID = F.AWAY_TEAM)""".format(gameweek)
        cursor.execute(query)
        results = dictfetchall(cursor)
    data = {
             "results": results,
             "gameweek": gameweek,
        }
    print("fixtures",data)
    return HttpResponse(json.dumps(data), content_type="application/json")

