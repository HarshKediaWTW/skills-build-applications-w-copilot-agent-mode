from django.contrib.auth.models import AbstractUser
from djongo import models

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'teams'

class User(AbstractUser):
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'users'

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    duration = models.IntegerField()  # in minutes
    calories = models.IntegerField()
    
    def __str__(self):
        return f"{self.user.username} - {self.type}"
    
    class Meta:
        db_table = 'activities'

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField()  # in minutes
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'workouts'

class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField()
    
    def __str__(self):
        return f"{self.user.username}: {self.points}"
    
    class Meta:
        db_table = 'leaderboard'
