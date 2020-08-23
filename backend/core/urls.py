from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenRefreshView,)
from core import views
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),

    path('token/', views.CustomTokenObtainPairView.as_view(),
         name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('activate/<slug:uidb64>/<slug:token>/',
         views.Activate.as_view(), name='activate'),
    path('docs/', include_docs_urls(title='My API title'))

]
