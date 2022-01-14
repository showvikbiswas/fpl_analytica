from django.shortcuts import render
from django.http import HttpResponse
from django.db import connections

# Create your views here.

def index(request, id):
    with connections['hr_db'].cursor() as cursor:
        cursor.execute(f'SELECT * from EMPLOYEES')
        return HttpResponse(dictfetchall(cursor))

def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]