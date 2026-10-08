from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path('', views.index, name='index'),
    path('map/', views.portfolio_map, name='portfolio_map'),
    path('api/contact/', views.contact_form, name='contact'),
]
