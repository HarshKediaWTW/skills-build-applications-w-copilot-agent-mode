from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete all data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Team Marvel')
        dc = Team.objects.create(name='Team DC')

        # Create superhero users for Marvel
        tony = User.objects.create_user(
            username='ironman', 
            email='tony@marvel.com', 
            password='password123',
            first_name='Tony', 
            last_name='Stark', 
        )
        tony.team = marvel
        tony.save()
        
        steve = User.objects.create_user(
            username='cap', 
            email='steve@marvel.com', 
            password='password123',
            first_name='Steve', 
            last_name='Rogers', 
        )
        steve.team = marvel
        steve.save()
        
        thor = User.objects.create_user(
            username='thor', 
            email='thor@marvel.com', 
            password='password123',
            first_name='Thor', 
            last_name='Odinson', 
        )
        thor.team = marvel
        thor.save()

        # Create superhero users for DC
        bruce = User.objects.create_user(
            username='batman', 
            email='bruce@dc.com', 
            password='password123',
            first_name='Bruce', 
            last_name='Wayne', 
        )
        bruce.team = dc
        bruce.save()
        
        clark = User.objects.create_user(
            username='superman', 
            email='clark@dc.com', 
            password='password123',
            first_name='Clark', 
            last_name='Kent', 
        )
        clark.team = dc
        clark.save()
        
        diana = User.objects.create_user(
            username='wonderwoman', 
            email='diana@dc.com', 
            password='password123',
            first_name='Diana', 
            last_name='Prince', 
        )
        diana.team = dc
        diana.save()

        # Create activities for each user
        Activity.objects.create(user=tony, type='Run', duration=30, calories=300)
        Activity.objects.create(user=tony, type='Strength Training', duration=45, calories=400)
        
        Activity.objects.create(user=steve, type='Swim', duration=45, calories=400)
        Activity.objects.create(user=steve, type='Cycling', duration=60, calories=500)
        
        Activity.objects.create(user=thor, type='Weight Lifting', duration=50, calories=450)
        Activity.objects.create(user=thor, type='HIIT', duration=30, calories=350)
        
        Activity.objects.create(user=bruce, type='Martial Arts', duration=60, calories=500)
        Activity.objects.create(user=bruce, type='Running', duration=40, calories=350)
        
        Activity.objects.create(user=clark, type='Flying', duration=90, calories=600)
        Activity.objects.create(user=clark, type='Yoga', duration=50, calories=250)
        
        Activity.objects.create(user=diana, type='Sword Training', duration=55, calories=480)
        Activity.objects.create(user=diana, type='Parkour', duration=45, calories=400)

        # Create workouts
        morning_cardio = Workout.objects.create(
            name='Morning Cardio', 
            description='Cardio training for all heroes', 
            duration=40
        )
        strength_training = Workout.objects.create(
            name='Strength Training', 
            description='Strength training for all heroes', 
            duration=60
        )
        yoga = Workout.objects.create(
            name='Yoga & Flexibility', 
            description='Yoga and flexibility training for all heroes', 
            duration=50
        )

        # Create leaderboard entries with superhero-themed points
        Leaderboard.objects.create(user=tony, points=1500)  # Iron Man
        Leaderboard.objects.create(user=steve, points=1400)  # Captain America
        Leaderboard.objects.create(user=thor, points=1600)  # Thor
        Leaderboard.objects.create(user=clark, points=1700)  # Superman
        Leaderboard.objects.create(user=diana, points=1650)  # Wonder Woman
        Leaderboard.objects.create(user=bruce, points=1550)  # Batman

        self.stdout.write(self.style.SUCCESS('Successfully populated octofit_db database with test data.'))
