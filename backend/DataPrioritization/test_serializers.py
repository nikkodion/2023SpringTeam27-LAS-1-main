# TODO: Test many-to-many fields for bucket and rule serializers and test rule_bucket serializer

from django.test import TestCase

from .models import User, Rule, Bucket, rule_bucket
from .serializers import UserSerializer, UsersSerializer, RuleSerializer, RulesSerializer, BucketSerializer, BucketsSerializer, RuleBucketSerializer

class UserSerializerTest(TestCase):
    def setUp(self):
            self.user_attributes = {
                'id': 100,
                'name': "Bob",
                'role': 1
            }

            self.serializer_data = {
                'id': 0,
                'name': "testname",
                'role': 0
            }

            self.user = User.objects.create(**self.user_attributes)
            self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'role']))
        
    def test_id_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['id'], self.user_attributes['id'])
        
    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['name'], self.user_attributes['name'])
        
    def test_role_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['role'], self.user_attributes['role'])
        
class UsersSerializerTest(TestCase):
    def setUp(self):
            self.user_attributes = {
                'id': 100,
                'name': "Bob",
                'role': 1
            }

            self.serializer_data = {
                'id': 0,
                'name': "testname",
                'role': 0
            }

            self.user = User.objects.create(**self.user_attributes)
            self.serializer = UsersSerializer(instance=self.user)

    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'role']))
        
    def test_id_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['id'], self.user_attributes['id'])
        
    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['name'], self.user_attributes['name'])
        
    def test_role_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['role'], self.user_attributes['role'])
        
class BucketSerializerTest(TestCase):
    def setUp(self):
            self.bucket_attributes = {
                'id': 1,
                'name': "Bucket Awesome",
                'daily_size_limit': "10GB",
                'max_rule_duration': 150,
                'age_off_policy': 2
                #'rules': {}
            }

            self.serializer_data = {
                'id': 0,
                'name': "testname", 
                'daily_size_limit': "testlimit",
                'max_rule_duration': 1,
                'age_off_policy': 1
                #'rules': {}
            }

            self.bucket = Bucket.objects.create(**self.bucket_attributes)
            self.serializer = BucketSerializer(instance=self.bucket)

    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'daily_size_limit', 'max_rule_duration', 'age_off_policy', 'rules']))
        
    def test_id_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['id'], self.bucket_attributes['id'])
        
    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['name'], self.bucket_attributes['name'])
        
    def test_daily_size_limit_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['daily_size_limit'], self.bucket_attributes['daily_size_limit'])
        
    def test_max_rule_duration_content(self):
        data = self.serializer.data

        self.assertEqual(data['max_rule_duration'], self.bucket_attributes['max_rule_duration'])
        
    def test_age_off_policy_content(self):
        data = self.serializer.data

        self.assertEqual(data['age_off_policy'], self.bucket_attributes['age_off_policy'])
        
    #def test_rules_content(self):
        #data = self.serializer.data

        #self.assertEqual(data['rules'], self.bucket_attributes['rules'])
        
class BucketsSerializerTest(TestCase):
    def setUp(self):
            self.bucket_attributes = {
                'id': 1,
                'name': "Bucket Awesome",
                'daily_size_limit': "10GB",
                'max_rule_duration': 150,
                'age_off_policy': 2
                #'rules':
            }

            self.serializer_data = {
                'id': 0,
                'name': "testname", 
                'daily_size_limit': "testlimit",
                'max_rule_duration': 1,
                'age_off_policy': 1
                #'rules':
            }

            self.bucket = Bucket.objects.create(**self.bucket_attributes)
            self.serializer = BucketSerializer(instance=self.bucket)

    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'daily_size_limit', 'max_rule_duration', 'age_off_policy', 'rules']))
        
    def test_id_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['id'], self.bucket_attributes['id'])
        
    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['name'], self.bucket_attributes['name'])
        
    def test_daily_size_limit_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['daily_size_limit'], self.bucket_attributes['daily_size_limit'])
        
    def test_max_rule_duration_content(self):
        data = self.serializer.data

        self.assertEqual(data['max_rule_duration'], self.bucket_attributes['max_rule_duration'])
        
    def test_age_off_policy_content(self):
        data = self.serializer.data

        self.assertEqual(data['age_off_policy'], self.bucket_attributes['age_off_policy'])
        
    #def test_rules_content(self):
        #data = self.serializer.data

        #self.assertEqual(data['rules'], self.bucket_attributes['rules'])
        
class RuleSerializerTest(TestCase):
    def setUp(self):
            self.rule_attributes = {
                'id': 100,
                'name': "Test Rule",
                'type': 1,
                'priority': 1,
                'status': 1,
                'active_time': 30,
                'rule': "Data Rule",
                #'buckets':
                'source': "RADS"
            }

            self.serializer_data = {
                'id': 0,
                'name': "testname",
                'type': 0,
                'priority': 0,
                'status': 0,
                'active_time': 0,
                'rule': "testrule",
                #'buckets':
                'source': "testsource"
            }

            self.rule = Rule.objects.create(**self.rule_attributes)
            self.serializer = RuleSerializer(instance=self.rule)

    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'type', 'priority', 'status', 'active_time', 'rule', 'buckets', 'source']))
        
    def test_id_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['id'], self.rule_attributes['id'])
        
    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['name'], self.rule_attributes['name'])
        
    def test_type_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['type'], self.rule_attributes['type'])
        
    def test_priority_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['priority'], self.rule_attributes['priority'])
        
    def test_status_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['status'], self.rule_attributes['status'])
        
    def test_active_time_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['active_time'], self.rule_attributes['active_time'])
        
    def test_rule_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['rule'], self.rule_attributes['rule'])
        
    #def test_buckets_field_content(self):
        #data = self.serializer.data

        #self.assertEqual(data['buckets'], self.rule_attributes['buckets'])
        
    def test_source_content(self):
        data = self.serializer.data

        self.assertEqual(data['source'], self.rule_attributes['source'])
        
class RulesSerializerTest(TestCase):
    def setUp(self):
            self.rule_attributes = {
                'id': 100,
                'name': "Test Rule",
                'type': 1,
                'priority': 1,
                'status': 1,
                'active_time': 30,
                'rule': "Data Rule",
                #'buckets':
                'source': "RADS"
            }

            self.serializer_data = {
                'id': 0,
                'name': "testname",
                'type': 0,
                'priority': 0,
                'status': 0,
                'active_time': 0,
                'rule': "testrule",
                #'buckets':
                'source': "testsource"
            }

            self.rule = Rule.objects.create(**self.rule_attributes)
            self.serializer = RulesSerializer(instance=self.rule)

    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'type', 'priority', 'status', 'active_time', 'rule', 'buckets', 'source']))
        
    def test_id_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['id'], self.rule_attributes['id'])
        
    def test_name_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['name'], self.rule_attributes['name'])
        
    def test_type_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['type'], self.rule_attributes['type'])
        
    def test_priority_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['priority'], self.rule_attributes['priority'])
        
    def test_status_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['status'], self.rule_attributes['status'])
        
    def test_active_time_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['active_time'], self.rule_attributes['active_time'])
        
    def test_rule_field_content(self):
        data = self.serializer.data

        self.assertEqual(data['rule'], self.rule_attributes['rule'])
        
    #def test_buckets_field_content(self):
        #data = self.serializer.data

        #self.assertEqual(data['buckets'], self.rule_attributes['buckets'])
        
    def test_source_content(self):
        data = self.serializer.data

        self.assertEqual(data['source'], self.rule_attributes['source'])
        
class RuleBucketSerializerTest(TestCase):
    def setUp(self):
            r1 = Rule.objects.create(id=0, name="testname", type=0, priority=0, status=0, active_time=0, rule="testrule", source="testsource")
            b1 = Bucket.objects.create(id=0, name="testname", daily_size_limit="testlimit", max_rule_duration=1, age_off_policy=1)
            r2 = Rule.objects.create(id=100, name="Test Rule", type=1, priority=1, status=1, active_time=30, rule="Data Rule", source="RADS")
            b2 = Bucket.objects.create(id=1, name="Bucket Awesome", daily_size_limit="10GB", max_rule_duration=150, age_off_policy=2)
            self.rule_bucket_attributes = {
                'rule': r2,
                'bucket': b2
            }

            self.serializer_data = {
                'rule': r1,
                'bucket': b1
            }

            self.rule_bucket = rule_bucket.objects.create(**self.rule_bucket_attributes)
            self.serializer = RuleBucketSerializer(instance=self.rule_bucket)
            
    def test_contains_expected_values(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'bucket', 'rule']))
        
    def test_rule_field_content(self):
        data = self.serializer.data
        #self.assertEqual(data['rule'], self.rule_bucket_attributes['rule'])
        
    def test_bucket_field_content(self):
        data = self.serializer.data
        #self.assertEqual(data['bucket'], self.rule_bucket_attributes['bucket'])