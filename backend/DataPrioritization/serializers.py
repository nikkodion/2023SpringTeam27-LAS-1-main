from rest_framework import serializers

from .models import User, Bucket, Rule, rule_bucket

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        db_table = 'users'
        model = User
        fields = '__all__'

class BucketSerializer(serializers.ModelSerializer):
    class Meta:
        db_table = 'buckets'
        model = Bucket
        fields = '__all__'


class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        db_table = 'rules'
        model = Rule
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        db_table = 'users'
        model = User
        fields = '__all__'

class BucketsSerializer(serializers.ModelSerializer):
    class Meta:
        db_table = 'buckets'
        model = Bucket
        fields = '__all__'

class RulesSerializer(serializers.ModelSerializer):

    buckets = serializers.SlugRelatedField(
        many=True,
        queryset=Bucket.objects.all(),
        slug_field='id'
    )
    class Meta:
        db_table = 'rules'
        model = Rule
        fields = '__all__'

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
        
class RuleBucketSerializer(serializers.ModelSerializer):
    queryset = rule_bucket.objects.all()
    class Meta:
        db_table = 'rule_bucket'
        model = rule_bucket
        fields = '__all__'
