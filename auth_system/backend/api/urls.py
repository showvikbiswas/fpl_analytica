from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from . import views

urlpatterns = [
   path('employee/<int:id>', views.index, name='index'),
   path('users/', views.create_user, name='create_user'),
   path('user/', views.get_user, name='get_user'),
   path('user/finalize/', views.finalize_user, name='finalize_user'),

   # Team APIs
   path('teams/all/', views.get_teams, name='get_teams'),

   # Player APIs
   path('players/', views.get_players, name='get_players'),
   path('players/<int:id>/', views.get_player, name='get_player'),
   

   # FPL Gameweek APIs
   path('current_gw_team/<int:id>/', views.get_current_gw_team, name='get_current_gw_team'),

   # Test APIs
   path('test/', views.test, name='test')
]
