from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fotoPerfil = models.ImageField(upload_to='fotosPerfis', null=True, blank=True)

    def __str__(self):
        return f'{self.user.username} Perfil'