from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from . import views

urlpatterns = [
   path('employee/<int:id>', views.index, name='index')
]
