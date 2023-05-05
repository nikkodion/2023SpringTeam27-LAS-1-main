from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .serializers import *
from rest_framework import viewsets
from .models import *
from rest_framework import viewsets

import os
from rest_framework.parsers import MultiPartParser, FormParser
from io import StringIO
import pandas as pd
import csv
from django.core.cache import cache
from rest_framework.decorators import api_view
from time import time
from django.core.cache import cache
import json
import bcrypt
import datetime
import copy
import geoip2.database


@api_view(['GET'])
@csrf_exempt
def Users_list(request):
    """
    List all users
    """

    if request.method == 'GET':
        items = User.objects.all()
        serializer = UsersSerializer(items, many=True)

        return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@csrf_exempt
def User_detail(request, pk):
    """
    Get a single user.
    """
    try:
        item = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UserSerializer(item)
        return JsonResponse(serializer.data)

@api_view(['GET'])
@csrf_exempt
def Buckets_list(request):
    """
    List all bucket
    """
    if request.method == 'GET':
        data = cache.get('bucketsAll')
        if data is None:
            items = Bucket.objects.all().prefetch_related('rules')
            serializer = BucketsSerializer(items, many=True)
            data = serializer.data
            for i in range(len(data)):
                data[i]['num_rules'] = len(data[i]['rules'])
        cache.set('bucketsAll', data, 60*60*24*7)

        return JsonResponse(data, safe=False)

@api_view(['GET', 'POST'])
@csrf_exempt
def Rules_list(request):
    """
    List all bucket
    """
    
    if request.method == 'GET':
        data = cache.get('rulesAll')
        if data is None:
            items = Rule.objects.all().prefetch_related('buckets')

            serializer = RulesSerializer(items, many=True)
            data = serializer.data
            for i in range(len(data)):
                data[i]['num_buckets'] = len(data[i]['buckets'])
       
        
        cache.set('rulesAll', data, 60*60*24*7)
        return JsonResponse(data, safe=False)

    if request.method == 'POST':
        # request.body is a raw text did not parsed to json, need deserializers ourself
        # serializer = RulesSerializer(data=request.body)
        print(request.body)
        serializer = RulesSerializer(data=JSONParser().parse(request))
        
        print(RulesSerializer(Rule.objects.get(pk=718)).data)
        if serializer.is_valid():
            serializer.save()
            allRules = cache.get('rulesAll')
            data = serializer.data
            data['num_buckets'] = len(data['buckets'])
            allRules.append(data)
            cache.set('rulesAll', allRules, 60*60*24*7)
            for bucket in data['buckets']:
                bucket_data = cache.get('bucket_%s' % bucket)
                if bucket_data is not None:
                    bucket_data['rules'].append(data)
                    cache.set('bucket_%s' % bucket, bucket_data)
            return JsonResponse(serializer.data)
        
        return JsonResponse(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@csrf_exempt
def Rule_detail(request, pk):
    """
    Get a single Rule.
    """
    
    
    
    try:
        
        item = Rule.objects.get(pk=pk)
    
    except Rule.DoesNotExist:
        
        return HttpResponse(status=404)
    
    

    if request.method == 'GET':
        data = cache.get('rule_%s' % pk)
        if data is None:
            serializer = RuleSerializer(item)
            data = serializer.data
            
            bucket_list = []
            i = 0
            for bucket in data['buckets']:
                bucket_list.append(BucketSerializer(Bucket.objects.get(pk=bucket)).data)
                bucket_list[i]['num_rules'] = len(bucket_list[i]['rules'])
                i += 1
            
            data['buckets'] = bucket_list
            data['num_buckets'] = len(data['buckets'])
            cache.set('rule_%s' % pk, data, 60*60*24*7)
        return JsonResponse(data)

    if request.method == 'PUT':
        if type(request.body) == bytes:
            json_data = JSONParser().parse(request)
            
        #print(json_data)
        #print(RuleSerializer(Rule.objects.get(pk=pk)).data)
        try:
            if type(request.body) == bytes:
                
                serializer = RuleSerializer(item, data=json_data)
                
            else:
                serializer = RuleSerializer(item, data=request.body)
        except:
            if type(request.body) == bytes:
                
                serializer = RuleSerializer(data=json_data)
            else:
                serializer = RuleSerializer(data=request.body)
        if serializer.is_valid():
            
            serializer.save()
            rule_ = Rule.objects.get(pk=pk)
            buckets = list(json_data['buckets'])
            rule_.buckets.clear()
            for bucket in buckets:
                rule_.buckets.add(bucket)
                rule_.save()
            data = RuleSerializer(rule_).data

            bucket_list = []
            i = 0
            for bucket in data['buckets']:
                bucket_data = cache.get('bucket_%s' % bucket)
                if bucket_data is not None:
                    for i in range(0, len(bucket_data['rules'])):
                        if data['id'] == bucket_data['rules'][i]['id']:
                            bucket_data['rules'][i] = data
                cache.set('bucket_%s' % bucket, bucket_data)
                bucket_list.append(BucketSerializer(Bucket.objects.get(pk=bucket)).data)
                
            data['buckets'] = bucket_list
            data['num_buckets'] = len(data['buckets'])
            if cache.get('rule_%s' % pk) is not None:
                cache.set('rule_%s' % pk, data, 60*60*24*7)
            return JsonResponse(data)
            
        return HttpResponse(serializer.errors, status=400)

    if request.method == 'PATCH':
        if type(request.body) == bytes:
                serializer = RuleSerializer(item, data=json.loads(request.body), partial=True)
        else:
                serializer = RuleSerializer(item, data=request.body, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return HttpResponse(serializer.errors, status=400)


    if request.method == 'DELETE':
        
        item.delete()
        
        
        return HttpResponse(status=204)

@api_view(['GET'])
@csrf_exempt
def Rule_exists(request, pk):
    """
    Check if a rule exists
    """
    if request.method == 'GET':
        try:
            item = Rule.objects.get(pk=pk)
        except Rule.DoesNotExist:
            return HttpResponse(status=404)
        return HttpResponse(status=200)


@api_view(['GET', 'PATCH'])
@csrf_exempt

def Bucket_detail(request, pk):
    """
    Get a single Bucket.
    """
    try:
        if request.method != 'PUT':
            
            item = Bucket.objects.get(pk=pk)
                

    except Bucket.DoesNotExist:
        return HttpResponse(status=404)



    if request.method == 'GET':
        data = cache.get('bucket_%s' % pk)
        if data is None:
            serializer = BucketSerializer(item)
            data = serializer.data

            rule_list = []
            for rule in data['rules']:
                rule_list.append(RuleSerializer(Rule.objects.get(pk=rule)).data)
            
            data['rules'] = rule_list
            data['num_rules'] = len(data['rules'])
            cache.set('bucket_%s' % pk, data, 60*60*24*7)
        return JsonResponse(data)

    if request.method == 'PUT':
        serializer = BucketSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return HttpResponse(serializer.errors, status=400)

    if request.method == 'PATCH':
        serializer = BucketSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return HttpResponse(serializer.errors, status=400)
    return


@api_view(['POST'])
@csrf_exempt
def import_rules_and_buckets(request, pk):

    if request.method == 'POST':
        #serializer = FileUploadSerializer(request.body)
        #serializer.is_valid(raise_exception=True)
        #file = serializer.validated_data['file']
        reader = pd.read_csv(request.FILES['file'])


        if 'rule' in reader.columns:
        
            
            for _, row in reader.iterrows():
                new_rule = Rule.objects.get_or_create(
                    id=row['id'])
                print(row['id'])
                new_rule_ = Rule.objects.get(id=row['id'])
                new_rule_.name= row['name']
                new_rule_.type= row['type']
                new_rule_.priority= row['priority']
                new_rule_.status= row['status']
                new_rule_.active_time= row['active_time']
                new_rule_.source= row['source']
                new_rule_.rule= row['rule']
                new_rule_.save()
                buckets_ = row['buckets'].strip('{').strip('}').split(',')
                new_rule_.save()
                try:
                    new_rule_.lat= row['lat']
                    new_rule_.long= row['long']
                except:
                    ip = row['rule'].strip('>').strip('<').split(',')[0].split('=')[1].strip('"')
                    dir_path = os.path.dirname(os.path.realpath(__file__))
                    with geoip2.database.Reader(dir_path + '\\IP2Location_Database\\GeoLite2-City.mmdb') as reader:
                        try:
                            response = reader.city(ip)
                            new_rule_.lat = response.location.latitude
                            new_rule_.long = response.location.longitude
                        except:
                            new_rule_.lat = -84
                            new_rule_.long = 98
                
                new_rule_.save()
                #print(RuleSerializer(Rule.objects.get(id=row['id'])).data)
                for bucket in buckets_:
                    
                    new_rule_.buckets.add(Bucket.objects.get(name=bucket.strip()))
                    
                    new_rule_.save()

                    bucket_data = cache.get('bucket_%s' % bucket)
                    if bucket_data is not None:
                        data = RuleSerializer(new_rule_).data
                        for i in range(0, len(bucket_data['rules'])):
                            if data['id'] == bucket_data['rules'][i]['id']:
                                bucket_data['rules'][i] = data
                    cache.set('bucket_%s' % bucket, bucket_data)
                if cache.get('rulesAll') is not None:
                    
                    allRules = cache.get('rulesAll')
                    data = RuleSerializer(new_rule_).data
                    data['num_buckets'] = len(data['buckets'])
                    allRules.append(data)
                    cache.set('rulesAll', allRules, 60*60*24*7)
                    
                    
                    
            return HttpResponse(status=201)
        elif 'max_rule_duration' in reader.columns:
            
            for _, row in reader.iterrows():
                print(row['id'])
                new_bucket = Bucket.objects.get_or_create(
                    id=row['id'])
                    #name=row['name'],
                    #max_rule_duration=row['max_rule_duration'],
                    #age_off_policy=row['age_off_policy'],
                    #daily_size_limit=row['daily_size_limit'])
                print(BucketSerializer(Bucket.objects.all(), many = True).data)
                new_bucket_ = Bucket.objects.get(id=row['id'])
                print(row)
                new_bucket_.name= row['name']
                new_bucket_.max_rule_duration= row['max_rule_duration']
                new_bucket_.age_off_policy= row['age_off_policy']
                new_bucket_.daily_size_limit= row['daily_size_limit']
                rules_ = row['rules'].strip('{').strip('}').split(',')
                new_bucket_.save()
                for rule in rules_:
                    if rule == '':
                        continue
                    new_bucket_.rules.add(Rule.objects.get(name=rule))
                    if cache.get('rule_%s' % rule) is not None:
                        rule_data = cache.get('rule_%s' % rule)
                        data = BucketSerializer(new_bucket_).data
                        for i in range(0, len(rule_data['buckets'])):
                            if data['id'] == rule_data['buckets'][i]['id']:
                                rule_data['buckets'][i] = data
                        cache.set('rule_%s' % rule, rule_data, 60*60*24*7)
                    new_bucket_.save()
                
                print(BucketSerializer(new_bucket_).data)
                print(BucketSerializer(Bucket.objects.get(id=row['id'])).data)

                allBuckets = cache.get('bucketsAll')
                if allBuckets is not None:
                    data = BucketSerializer(new_bucket_).data
                    data['num_rules'] = len(data['rules'])
                    allBuckets.append(data)
                    cache.set('bucketsAll', allBuckets, 60*60*24*7)
            return HttpResponse(status=201)
        else:
            return HttpResponse(status=400)

@api_view(['GET'])
@csrf_exempt
def export_rules_and_buckets(request, pk):

    if request.method == "GET":
        if pk == 'rules':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="rules.csv"'

            writer = csv.writer(response)
            writer.writerow(['id', 'name', 'type', 'priority', 'status', 'active_time', 'source', 'rule', 'buckets'])

            rules = Rule.objects.all().values_list('id', 'name', 'type', 'priority', 'status', 'active_time', 'source', 'rule', 'buckets')
            for rule in rules:
                writer.writerow(rule)

            return response
        elif pk == 'buckets': 
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="buckets.csv"'

            writer = csv.writer(response)
            writer.writerow(['id', 'name', 'max_rule_duration', 'age_off_policy', 'daily_size_limit', 'rules'])

            buckets = Bucket.objects.all().values_list('id', 'name', 'max_rule_duration', 'age_off_policy', 'daily_size_limit', 'rules')
            for bucket in buckets:
                writer.writerow(bucket)

            return response
        else:
            return HttpResponse(status=400)

@api_view(['POST'])     
@csrf_exempt
def authenticate(request):
    if request.method == "POST":
        jsonData = json.loads(request.body)
        if User.objects.get(name=jsonData['username']) == None:
            return JsonResponse({'worked': False})
        validPW = bcrypt.checkpw(jsonData['password'].encode('utf-8'), User.objects.get(name=jsonData['username']).pwd.encode('utf-8'))
        if validPW:
            return JsonResponse({'worked': True, 'permissions': User.objects.get(name=jsonData['username']).role})
        return JsonResponse({'worked': False}) 