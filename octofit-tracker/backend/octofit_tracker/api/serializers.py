from rest_framework import serializers
from django.db.models import Sum
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    team_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'password', 'team_id', 'team_name', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_team_name(self, obj):
        if obj.team_id:
            try:
                team = Team.objects.filter(id=obj.team_id).first()
                return team.name if team else None
            except:
                return None
        return None


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'member_count']
    
    def get_member_count(self, obj):
        return User.objects.filter(team_id=str(obj.id)).count()


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'user_name', 'activity_type', 'duration', 'distance', 'calories', 'date', 'created_at']
    
    def get_user_name(self, obj):
        try:
            user = User.objects.filter(id=obj.user_id).first()
            return user.name if user else 'Unknown User'
        except:
            return 'Unknown User'


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    user_name = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()
    total_calories = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'team_id', 'user_name', 'team_name', 'total_points', 'total_activities', 'total_calories', 'rank', 'updated_at']
    
    def get_user_name(self, obj):
        try:
            user = User.objects.filter(id=obj.user_id).first()
            return user.name if user else 'Unknown User'
        except:
            return 'Unknown User'
    
    def get_team_name(self, obj):
        try:
            team = Team.objects.filter(id=obj.team_id).first()
            return team.name if team else 'No Team'
        except:
            return 'No Team'
    
    def get_total_calories(self, obj):
        try:
            total = Activity.objects.filter(user_id=obj.user_id).aggregate(
                total_calories=Sum('calories')
            )['total_calories']
            return total if total else 0
        except:
            return 0


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    duration_minutes = serializers.IntegerField(source='estimated_duration', read_only=True)
    category = serializers.CharField(source='activity_type', read_only=True)
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'activity_type', 'category', 'difficulty_level', 'estimated_duration', 'duration_minutes', 'estimated_calories', 'created_at']
