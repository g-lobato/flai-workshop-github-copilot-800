from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email="test@example.com",
            name="Test User",
            password="testpass123"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, "test@example.com")
        self.assertEqual(self.user.name, "Test User")
        self.assertIsNotNone(self.user.created_at)


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            description="A test team"
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.description, "A test team")
        self.assertIsNotNone(self.team.created_at)


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id="1",
            activity_type="Running",
            duration=30,
            distance=5.0,
            calories=300,
            date=timezone.now()
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.activity_type, "Running")
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            user_id="1",
            team_id="1",
            total_points=100,
            total_activities=5,
            rank=1
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.total_points, 100)
        self.assertEqual(self.leaderboard.total_activities, 5)
        self.assertEqual(self.leaderboard.rank, 1)


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name="Morning Run",
            description="A refreshing morning run",
            activity_type="Running",
            difficulty_level="Medium",
            estimated_duration=30,
            estimated_calories=300
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, "Morning Run")
        self.assertEqual(self.workout.difficulty_level, "Medium")
        self.assertEqual(self.workout.estimated_duration, 30)


class UserAPITest(APITestCase):
    def test_create_user(self):
        data = {
            "email": "newuser@example.com",
            "name": "New User",
            "password": "newpass123"
        }
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)


class TeamAPITest(APITestCase):
    def test_create_team(self):
        data = {
            "name": "New Team",
            "description": "A new team for testing"
        }
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)


class ActivityAPITest(APITestCase):
    def test_create_activity(self):
        data = {
            "user_id": "1",
            "activity_type": "Cycling",
            "duration": 45,
            "distance": 15.0,
            "calories": 400,
            "date": timezone.now().isoformat()
        }
        response = self.client.post('/api/activities/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 1)


class WorkoutAPITest(APITestCase):
    def test_create_workout(self):
        data = {
            "name": "Evening Yoga",
            "description": "Relaxing yoga session",
            "activity_type": "Yoga",
            "difficulty_level": "Easy",
            "estimated_duration": 60,
            "estimated_calories": 200
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Workout.objects.count(), 1)
