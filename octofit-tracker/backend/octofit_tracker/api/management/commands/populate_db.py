from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import User, Team, Activity, Leaderboard, Workout
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write('Creating teams...')
        
        # Create teams
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes'
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League United'
        )
        
        self.stdout.write('Creating users...')
        
        # Create Marvel superheroes
        marvel_heroes = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'password': 'arc_reactor_3000'},
            {'name': 'Steve Rogers', 'email': 'captainamerica@marvel.com', 'password': 'shield_vibranium'},
            {'name': 'Thor Odinson', 'email': 'thor@asgard.com', 'password': 'mjolnir_worthy'},
            {'name': 'Bruce Banner', 'email': 'hulk@marvel.com', 'password': 'gamma_smash'},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'password': 'red_room_spy'},
            {'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'password': 'web_slinger'},
        ]
        
        # Create DC superheroes
        dc_heroes = [
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'password': 'krypton_power'},
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'password': 'gotham_knight'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'password': 'themyscira_warrior'},
            {'name': 'Barry Allen', 'email': 'flash@dc.com', 'password': 'speed_force'},
            {'name': 'Arthur Curry', 'email': 'aquaman@dc.com', 'password': 'atlantis_king'},
            {'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'password': 'willpower_ring'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_marvel.id)
            )
            marvel_users.append(user)
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_dc.id)
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        self.stdout.write('Creating activities...')
        
        # Create activities
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing']
        
        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                distance = round(random.uniform(1.0, 20.0), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = duration * random.randint(5, 15)
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_id=str(user.id),
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories,
                    date=timezone.now() - timedelta(days=days_ago)
                )
        
        self.stdout.write('Creating leaderboard entries...')
        
        # Create leaderboard entries
        for user in all_users:
            user_activities = Activity.objects.filter(user_id=str(user.id))
            total_points = sum(activity.calories for activity in user_activities)
            total_activities_count = user_activities.count()
            
            Leaderboard.objects.create(
                user_id=str(user.id),
                team_id=user.team_id,
                total_points=total_points,
                total_activities=total_activities_count,
                rank=0  # Will be calculated based on total_points
            )
        
        # Update ranks
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_points')
        for idx, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = idx
            entry.save()
        
        self.stdout.write('Creating workouts...')
        
        # Create workout suggestions
        workouts = [
            {
                'name': 'Super Soldier Circuit',
                'description': 'High-intensity full-body workout inspired by Captain America\'s training',
                'activity_type': 'Weightlifting',
                'difficulty_level': 'Advanced',
                'estimated_duration': 60,
                'estimated_calories': 600
            },
            {
                'name': 'Speed Force Sprint',
                'description': 'Lightning-fast interval running workout',
                'activity_type': 'Running',
                'difficulty_level': 'Intermediate',
                'estimated_duration': 30,
                'estimated_calories': 400
            },
            {
                'name': 'Amazonian Warrior Training',
                'description': 'Combat-focused strength and agility workout',
                'activity_type': 'Boxing',
                'difficulty_level': 'Advanced',
                'estimated_duration': 45,
                'estimated_calories': 500
            },
            {
                'name': 'Web-Slinger Flexibility',
                'description': 'Flexibility and balance training for agility',
                'activity_type': 'Yoga',
                'difficulty_level': 'Beginner',
                'estimated_duration': 40,
                'estimated_calories': 200
            },
            {
                'name': 'Atlantean Swimming',
                'description': 'Underwater endurance and strength building',
                'activity_type': 'Swimming',
                'difficulty_level': 'Intermediate',
                'estimated_duration': 50,
                'estimated_calories': 450
            },
            {
                'name': 'Arc Reactor Cycling',
                'description': 'High-tech stationary bike intervals',
                'activity_type': 'Cycling',
                'difficulty_level': 'Intermediate',
                'estimated_duration': 45,
                'estimated_calories': 500
            },
            {
                'name': 'Kryptonian Strength',
                'description': 'Maximum power weightlifting routine',
                'activity_type': 'Weightlifting',
                'difficulty_level': 'Advanced',
                'estimated_duration': 75,
                'estimated_calories': 700
            },
            {
                'name': 'Asgardian Hammer Throw',
                'description': 'Functional strength and power training',
                'activity_type': 'Weightlifting',
                'difficulty_level': 'Advanced',
                'estimated_duration': 60,
                'estimated_calories': 650
            },
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS('Successfully populated the database!'))
        self.stdout.write(f'Created {Team.objects.count()} teams')
        self.stdout.write(f'Created {User.objects.count()} users')
        self.stdout.write(f'Created {Activity.objects.count()} activities')
        self.stdout.write(f'Created {Leaderboard.objects.count()} leaderboard entries')
        self.stdout.write(f'Created {Workout.objects.count()} workouts')
