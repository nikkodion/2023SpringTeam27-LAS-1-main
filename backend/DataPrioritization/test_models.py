from django.test import TestCase
from DataPrioritization.models import User
from DataPrioritization.models import Rule
from DataPrioritization.models import Bucket
from django.utils import timezone
from django.urls import reverse

# models test
class UserTest(TestCase):

    def create_whatever(self, id=0, name="testname", role=0):
        return User.objects.create(id=id, name=name, role=role)

    def test_whatever_creation(self):
        u = self.create_whatever()
        self.assertTrue(isinstance(u, User))
        self.assertEqual(0, u.id)
        self.assertEqual("testname", u.name)
        self.assertEqual(0, u.role)

class RuleTest(TestCase):

    def create_whatever(self, id=0, name="testname", type=0, priority=1, status=0, active_time=1, rule="testrule", source=0):
        return Rule.objects.create(id=id, name=name, type=type, priority=priority, status=status, active_time=active_time, rule=rule, source=source)

    def test_whatever_creation(self):
        r = self.create_whatever()
        self.assertTrue(isinstance(r, Rule))
        self.assertEqual(0, r.id)
        self.assertEqual("testname", r.name)
        self.assertEqual(0, r.type)
        self.assertEqual(1, r.priority)
        self.assertEqual(0, r.status)
        self.assertEqual(1, r.active_time)
        self.assertEqual("testrule", r.rule)
        self.assertEqual(0, r.source)


class BucketTest(TestCase):

    def create_whatever(self, id=0, name="testname", daily_size_limit="testlimit", max_rule_duration=1, age_off_policy=1):
        return Bucket.objects.create(id=id, name=name, daily_size_limit=daily_size_limit, max_rule_duration=max_rule_duration, age_off_policy=age_off_policy)

    def test_whatever_creation(self):
        b = self.create_whatever()
        self.assertTrue(isinstance(b, Bucket))
        self.assertEqual(0, b.id)
        self.assertEqual("testname", b.name)
        self.assertEqual("testlimit", b.daily_size_limit)
        self.assertEqual(1, b.max_rule_duration)
        self.assertEqual(1, b.age_off_policy)

class ForeignKeyCase(TestCase):
    def create_rule(self, id=0, name="testrulename", type=0, priority=1, status=0, active_time=1, rule="testrule", source=0):
        return Rule.objects.create(id=id, name=name, type=type, priority=priority, status=status, active_time=active_time, rule=rule, source=source)
    
    def create_bucket(self, id=0, name="testbucketname", daily_size_limit="testlimit", max_rule_duration=1, age_off_policy=1):
        return Bucket.objects.create(id=id, name=name, daily_size_limit=daily_size_limit, max_rule_duration=max_rule_duration, age_off_policy=age_off_policy)

    def create_bucket2(self, id=1, name="testbucketname2", daily_size_limit="testlimit2", max_rule_duration=2, age_off_policy=0):
        return Bucket.objects.create(id=id, name=name, daily_size_limit=daily_size_limit, max_rule_duration=max_rule_duration, age_off_policy=age_off_policy)
    
    def test_fields_author_name(self):
        b = self.create_bucket()
        r = self.create_rule()

        self.assertTrue(isinstance(b, Bucket))
        self.assertEqual(0, b.id)
        self.assertEqual("testbucketname", b.name)
        self.assertEqual("testlimit", b.daily_size_limit)
        self.assertEqual(1, b.max_rule_duration)
        self.assertEqual(1, b.age_off_policy)

        self.assertTrue(isinstance(r, Rule))
        self.assertEqual(0, r.id)
        self.assertEqual("testrulename", r.name)
        self.assertEqual(0, r.type)
        self.assertEqual(1, r.priority)
        self.assertEqual(0, r.status)
        self.assertEqual(1, r.active_time)
        self.assertEqual("testrule", r.rule)
        self.assertEqual(0, r.source)

        try:
            b.rules.get(name="testrulename").name
        except:
            print("doesnotexist")

        b.rules.add(r)
        r.buckets.add(b)
        b.save()
        r.save()

        # testing if the rules and buckets were added
        self.assertEqual(b.rules.get(name="testrulename").name, "testrulename") 
        self.assertEqual(b.rules.get(name="testrulename").type, 0)   
        self.assertEqual(b.rules.get(name="testrulename").priority, 1) 

        self.assertEqual(r.buckets.get(name="testbucketname").name, "testbucketname") 
        self.assertEqual(r.buckets.get(name="testbucketname").max_rule_duration, 1) 
        self.assertEqual(r.buckets.get(name="testbucketname").daily_size_limit, "testlimit")

        #testing is a second bucket can be added
        b2 = self.create_bucket2()

        self.assertTrue(isinstance(b2, Bucket))
        self.assertEqual(1, b2.id)
        self.assertEqual("testbucketname2", b2.name)
        self.assertEqual("testlimit2", b2.daily_size_limit)
        self.assertEqual(2, b2.max_rule_duration)
        self.assertEqual(0, b2.age_off_policy)

        r.buckets.add(b2)
        r.save()

        self.assertEqual(r.buckets.get(name="testbucketname").name, "testbucketname") 
        self.assertEqual(r.buckets.get(name="testbucketname").max_rule_duration, 1) 
        self.assertEqual(r.buckets.get(name="testbucketname").daily_size_limit, "testlimit")

        self.assertEqual(r.buckets.get(name="testbucketname2").name, "testbucketname2") 
        self.assertEqual(r.buckets.get(name="testbucketname2").max_rule_duration, 2) 
        self.assertEqual(r.buckets.get(name="testbucketname2").daily_size_limit, "testlimit2")

        # testing removing a bucket
        r.buckets.remove(b2)
        try:
            r.buckets.get(name="testbucketname2")
        except:
            "b2 doesnotexist"

        self.assertEqual(r.buckets.get(name="testbucketname").name, "testbucketname")


        