from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from . import views

urlpatterns = [
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
   path('confirm_gw_team/<int:id>/', views.confirm_gw_team, name='confirm_gw_team'),

   # League APIs
   path('leagues/user/<int:id>/', views.get_user_leagues, name='get_user_leagues'),
   path('leagues/league/<int:id>/', views.get_league, name='get_league'),
   path('leagues/create/', views.create_league, name='create_league'),
   path('leagues/join/', views.join_league, name='join_league'),
   path('leagues/players/<int:id>/', views.get_league_players, name='get_league_players'),
   path('leagues/edit/<int:id>/', views.edit_league, name='edit_league'),
   path('leagues/<int:lid>/leave/<int:pid>/', views.leave_league, name='leave_league'),
   path('leagues/delete/<int:id>/', views.delete_league, name='delete_league'),

   # Test APIs
   path('test/', views.test, name='test')
]
