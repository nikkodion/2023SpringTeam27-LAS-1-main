import ast
import unicodedata
from xml.dom import ValidationErr
from django.db import models

class User(models.Model):
    """Class for a user with ID, name, and attribute fields
    Args:
        models (model): generic model source
    """
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    role = models.IntegerField()
    pwd = models.TextField()
    salt = models.TextField()
    class Meta:
        db_table = "users"
    def __str__(self):
        return self.name

class Bucket(models.Model):
    """Class for a bucket with ID, name, data size, data size limit
    per 24 hours, max rule duration limit, list of associated rules,
    and age off policy configuration
    Args:
        models (model): generic model source
    """
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    daily_size_limit = models.TextField()
    max_rule_duration = models.IntegerField()
    age_off_policy = models.IntegerField()
    rules = models.ManyToManyField('Rule', through="rule_bucket")

    class Meta:
        db_table = "buckets"
    def __str__(self):
        return self.name

class Rule(models.Model):
    """Class for a rule with ID, name, associated buckets, type (IP or IP-port pair),
    priority, status, time set, and source (RADS or TLeaves)
    Args:
        models (model): generic model source
    """
    id = models.IntegerField(primary_key=True)
    name = models.TextField()

    # 0 for IP-only, 1 for IP-port pair
    type = models.IntegerField()
    priority = models.IntegerField()

    # 0 for inactive, 1 for active
    status = models.IntegerField()
    active_time = models.IntegerField()
    rule = models.TextField()
    lat = models.TextField()
    long = models.TextField()
    buckets = models.ManyToManyField(Bucket, through="rule_bucket")
    source = models.TextField()
    class Meta:
        db_table = "rules"

class rule_bucket(models.Model):
    rule = models.ForeignKey(Rule, on_delete=models.CASCADE)
    bucket = models.ForeignKey(Bucket, on_delete=models.CASCADE)

    class Meta:
        db_table = "rule_bucket"
