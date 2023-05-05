from django.contrib.auth.models import AnonymousUser, User
from django.test import RequestFactory
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
import json
from django.shortcuts import get_object_or_404

from .views import *

class TestRule (APITestCase):
    
    """
        testinig if we get all user in the database.
    """
    def test_user_get(self):

        # creat a rule to add 
        u0 = { "name": "will0", "role": 0}
        
        #Creat 1 new one
        User.objects.create(**u0)
        
        user0 = User.objects.get(name=u0["name"])
        # get all users 
        respont = self.client.get(f'http://127.0.0.1:8000/Users/{user0.id}/', format='json')
        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        
        # check number, id name
        self.assertEqual(user0.id,respont_data.pop('id'))
        
        self.assertEqual(u0, respont_data)
        
    
    """
        testinig if we get all user in the database.
    """
    def test_user_gets(self):

        # creat a rule to add 
        u0 = { "name": "will0", "role": 0}
        u1 = { "name": "will1", "role": 1}
        
        #Creat 2 new one
        User.objects.create(**u0)
        User.objects.create(**u1)
        
        user0 = User.objects.get(name=u0["name"])
        user1 = User.objects.get(name=u1["name"])
        
        # get all users 
        respont = self.client.get('http://127.0.0.1:8000/Users/', format='json')
        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        
        # check number, id name
        self.assertEqual(2,len(respont_data))
        self.assertEqual(1,respont_data[0]['id'])
        self.assertEqual(2,respont_data[1]['id'])
        self.assertEqual('will0',respont_data[0]['name'])
        self.assertEqual('will1',respont_data[1]['name'])  
        self.assertEqual(u0["name"],respont_data[0]['name'])
        self.assertEqual(u1["name"],respont_data[1]['name'])    
        
    
    """
        testinig if we can add a rule in the database.Not add?
    """
    def atest_rule_post(self):

        # creat a rule to add 
        r = { "name": "69", "type": 0, "priority": 1, "status": 1, "active_time": 0, "rule": "<ip=\"47.254.146.169\", port=\"8080\">", "source": "vuldb"}
        
        respont = self.client.post('http://127.0.0.1:8000/Rules/',r, format='json')


        self.assertEqual(respont.status_code,status.HTTP_200_OK,respont.content)
        
        respont_data = json.loads(respont.content)
        
        
        respont_data.pop('id')
        #b'{"id": null, "name": "69", "type": 0, "priority": 1, "status": 1, "active_time": 0, "rule": "<ip=\\"47.254.146.169\\", port=\\"8080\\">", "source": "vuldb", "buckets": []}'
        
        self.assertEqual([],respont_data.pop('buckets'))

        self.assertEqual(r, respont_data)
        
        
        rule = Rule.objects.get(name=r["name"])
    
    """
        testinig if we can get a single rule in the database.
    """    
    def test_rule_get(self):

        r = { "name": "bucket_test_0", "type": 0, "priority": 43351, "status": 1, "active_time": 0, "rule": "<ip=\"23.250.116.0\", port=\"7001\">", "source": "vuldb"}
        
        #Creat a new one
        Rule.objects.create(**r)

        rule = Rule.objects.get(name=r["name"])

        # get rule 
        respont = self.client.get(f"http://127.0.0.1:8000/Rules/{rule.id}/",format='json')

        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        
        self.assertEqual(rule.id,respont_data.pop('id'))
        self.assertEqual(0,respont_data.pop('num_buckets'))
        self.assertEqual([],respont_data.pop('buckets'))
        
        self.assertEqual(r, respont_data)
        
    
    """
        testinig if we can get a all rule in the database.
    """    
    def test_rules_get(self):
        # check how many rule we have right now
        
        r0 = { "name": "bucket_test_0", "type": 0, "priority": 43351, "status": 1, "active_time": 0, "rule": "<ip=\"23.250.116.0\", port=\"7001\">", "source": "vuldb"}
        
        r1 = { "name": "bucket_test_1", "type": 0, "priority": 1, "status": 1, "active_time": 0, "rule": "<ip=\"23.250.116.0\", port=\"7001\">", "source": "vuldb"}
        
        #Creat a new one
        Rule.objects.create(**r0)
        Rule.objects.create(**r1)
        
        rule0 = Rule.objects.get(name=r0["name"])
        rule1 = Rule.objects.get(name=r1["name"])
        
        # get rules 
        respont = self.client.get(f"http://127.0.0.1:8000/Rules/",format='json')

        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        
        # print("77")
        # print(len(respont_data))
        # print(respont_data[0])
        # print(respont_data[1])
        # print(respont_data[0]['id'])
        
        self.assertEqual(2,len(respont_data))
        self.assertEqual(1,respont_data[0]['id'])
        self.assertEqual(2,respont_data[1]['id'])
        self.assertEqual('bucket_test_0',respont_data[0]['name'])
        self.assertEqual('bucket_test_1',respont_data[1]['name'])
        
        # test for r0
        self.assertEqual(2,len(respont_data))
        self.assertEqual(rule0.id,respont_data[0].pop('id'))
        self.assertEqual(0,respont_data[0].pop('num_buckets'))
        self.assertEqual([],respont_data[0].pop('buckets'))
        self.assertEqual(r0, respont_data[0])
        
        # test for r1
        self.assertEqual(2,len(respont_data))
        self.assertEqual(rule1.id,respont_data[1].pop('id'))
        self.assertEqual(0,respont_data[1].pop('num_buckets'))
        self.assertEqual([],respont_data[1].pop('buckets'))
        self.assertEqual(r1, respont_data[1])
        
            
    
    """
        testinig if we can deleted a rule in the database.
    """    
    def test_rules_deleted(self):
        # check how many rule we have right now
        
        r0 = { "name": "bucket_test_0", "type": 0, "priority": 43351, "status": 1, "active_time": 0, "rule": "<ip=\"23.250.116.0\", port=\"7001\">", "source": "vuldb"}
        
        r1 = { "name": "bucket_test_1", "type": 0, "priority": 1, "status": 1, "active_time": 0, "rule": "<ip=\"23.250.116.0\", port=\"7001\">", "source": "vuldb"}
        
        #Creat a new one
        Rule.objects.create(**r0)
        Rule.objects.create(**r1)
        
        rule0 = Rule.objects.get(name=r0["name"])
        rule1 = Rule.objects.get(name=r1["name"])
        
        # get rules 
        respont = self.client.get(f"http://127.0.0.1:8000/Rules/",format='json')

        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        self.assertEqual(2,len(respont_data))
        
        
        # deleted rule0 
        respont2 = self.client.delete(f"http://127.0.0.1:8000/Rules/{rule0.id}/",format='json')
        self.assertEqual(respont2.status_code,204)
        
        # get rules 
        respont = self.client.get(f"http://127.0.0.1:8000/Rules/")
        

        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        # one left
        self.assertEqual(1,len(respont_data))
     
    
    """
        testinig if we can update a rule in the database.
    """    
    def test_rules_put(self):
        # check how many rule we have right now
        
        r0 = { "name": "bucket_test_0", "type": 0, "priority": 43351, "status": 1, "active_time": 0, "rule": "<ip=\"23.250.116.0\", port=\"7001\">", "source": "vuldb"}

        #Creat a new one
        Rule.objects.create(**r0)
        
        rule0 = Rule.objects.get(name=r0["name"])
        
        # get rules 
        respont = self.client.get(f"http://127.0.0.1:8000/Rules/{rule0.id}/",format='json')

        self.assertEqual(respont.status_code,200)
        
        
        respont_data = json.loads(respont.content)
        self.assertEqual("bucket_test_0",respont_data["name"])
        
        
        respont_data["name"] = "bucket_test_00000"
        # print(respont_data)
        
        r00 = respont_data

        # update rules 
        respont = self.client.patch(f"http://127.0.0.1:8000/Rules/{rule0.id}/",r00,format='json')
        
        # # update rules 
        # respont = self.client.put(f"http://127.0.0.1:8000/Rules/{rule0.id}/",r00,format='json')

        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        self.assertEqual("bucket_test_00000",respont_data["name"])

    
    """
        testinig if we can get a single bucket in the database.pk can not get?
    """       
    
    def test_bucket_get(self):
        # check how many rule we have right now

        # creat a bucket to compare 
        b = { "name": "bucket_test", "daily_size_limit": "20TB", "max_rule_duration": 0, "age_off_policy": 0}
        
        #Creat a new one
        Bucket.objects.create(**b)

        bucket = Bucket.objects.get(name=b["name"])
        
        respont = self.client.get(f'http://127.0.0.1:8000/Buckets/{bucket.id}/', format='json')

        self.assertEqual(respont.status_code,200)  
        
        respont_data = json.loads(respont.content)
        
        # print(respont_data)
        
        self.assertEqual(bucket.id,respont_data.pop('id'))
        self.assertEqual(0,respont_data.pop('num_rules'))
        self.assertEqual([],respont_data.pop('rules'))
        
        self.assertEqual(b, respont_data)
          
    """
        testinig if we can get a all bucket in the database.
    """    
    def test_buckets_get(self):
        # check how many rule we have right now
        
        b0 = { "name": "bucket_test", "daily_size_limit": "20TB", "max_rule_duration": 0, "age_off_policy": 0}
        
        b1 = { "name": "bucket_test1", "daily_size_limit": "20TB", "max_rule_duration": 0, "age_off_policy": 0}
        
        #Creat a new one
        Bucket.objects.create(**b0)
        Bucket.objects.create(**b1)
        
        bucket0 = Bucket.objects.get(name=b0["name"])
        bucket1 = Bucket.objects.get(name=b1["name"])
        
        # get Buckets 
        respont = self.client.get(f"http://127.0.0.1:8000/Buckets/",format='json')

        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        
        # print("77")
        # print(len(respont_data))
        # print(respont_data[0])
        # print(respont_data[1])
        # print(respont_data[0]['id'])
        
        self.assertEqual(2,len(respont_data))
        self.assertEqual(1,respont_data[0]['id'])
        self.assertEqual(2,respont_data[1]['id'])
        self.assertEqual('bucket_test',respont_data[0]['name'])
        self.assertEqual('bucket_test1',respont_data[1]['name'])
        
        # test for b0
        self.assertEqual(2,len(respont_data))
        self.assertEqual(bucket0.id,respont_data[0].pop('id'))
        self.assertEqual(0,respont_data[0].pop('num_rules'))
        self.assertEqual([],respont_data[0].pop('rules'))
        self.assertEqual(b0, respont_data[0])
        
        # test for b1
        self.assertEqual(2,len(respont_data))
        self.assertEqual(bucket1.id,respont_data[1].pop('id'))
        self.assertEqual(0,respont_data[1].pop('num_rules'))
        self.assertEqual([],respont_data[1].pop('rules'))
        self.assertEqual(b1, respont_data[1])
                  
    """
        testinig if we can update a bucket in the database.
    """    
    def test_buckets_put_patch(self):
        # check how many rule we have right now
        
        b0 = { "name": "bucket_test", "daily_size_limit": "20TB", "max_rule_duration": 0, "age_off_policy": 0}
        
        #Creat a new one
        Bucket.objects.create(**b0)
        
        bucket0 = Bucket.objects.get(name=b0["name"])
        
        # get bucket0 check name
        respont = self.client.get(f"http://127.0.0.1:8000/Buckets/{bucket0.id}/",format='json')
        self.assertEqual(respont.status_code,200)
        respont_data = json.loads(respont.content)
        
        self.assertEqual("bucket_test",respont_data["name"])
        
        respont_data["name"] = "bucket_test1234"
        
        b00 = respont_data
        # update bucker 
        respont = self.client.patch(f"http://127.0.0.1:8000/Buckets/{bucket0.id}/",b00,format='json')
        self.assertEqual(respont.status_code,200)
        
        respont_data = json.loads(respont.content)
        self.assertEqual("bucket_test1234",respont_data["name"])
        
        
