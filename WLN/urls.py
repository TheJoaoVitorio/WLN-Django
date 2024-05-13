from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('landingpage.urls')),
    path('usuarios/', include('usuarios.urls')),
    path('app/', include('app.urls')),
]