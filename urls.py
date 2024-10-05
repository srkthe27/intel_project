"""
URL configuration for bdend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from .views import sign_up, sign_in, career_guidance_chatbot,generate_avatar,generate_content,generate_quiz_api,generate_scenario_api,generate_story_api#,capture_interaction
from .views import submit_quiz

def homepage(request):
    return HttpResponse("Welcome to the API")
urlpatterns = [
    path('admin/', admin.site.urls),  # Admin route
    path('api/sign-up/', sign_up, name='sign-up'),
    path('api/sign-in/', sign_in, name='sign-in'),
    path('api/submit-quiz/', submit_quiz, name='submit_quiz'),
    path('api/career-guidance/', career_guidance_chatbot, name='career_guidance'),
    #path('api/capture-interaction/',capture_interaction, name='capture_interaction'),
    path('api/generate-quiz/',  generate_quiz_api, name='generate_quiz_api'),
    path('api/generate-content/', generate_content, name='generate_content'),
    path('api/generate-scenario/', generate_scenario_api, name='generate_scenario_api') , 
    path('api/generate-story/', generate_story_api, name='generate_story') , 
    path('api/generate_avatar',generate_avatar,name='generate_avatar'),
    #path('api/get-insights/',get_insights, name='get_insights'),
    path('', homepage),
]
