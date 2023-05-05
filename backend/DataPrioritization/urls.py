from django.urls import path, re_path
from DataPrioritization import views

urlpatterns = [
    path("Users/", views.Users_list),
    path("Users/<int:pk>/", views.User_detail),
    path("Buckets/", views.Buckets_list),
    path("Buckets/<int:pk>/", views.Bucket_detail),
    path("Rules/", views.Rules_list),
    path("Rules/<int:pk>/", views.Rule_detail),
    path("RuleExists/<int:pk>/", views.Rule_exists),
    path("Import/<str:pk>/", views.import_rules_and_buckets),
    path("Export/<str:pk>/", views.export_rules_and_buckets),
    path("Login/", views.authenticate)
]
