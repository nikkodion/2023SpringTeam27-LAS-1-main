from django.contrib import admin
from .models import User, Bucket, Rule

admin.site.register(User)
admin.site.register(Bucket)
admin.site.register(Rule)