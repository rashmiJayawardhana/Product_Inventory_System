from django.urls import path
from .views import ItemListCreateAPIView, ItemDetailView

urlpatterns=[
    path('api/items/',ItemListCreateAPIView.as_view(),name='item-list-create'),
    path('api/items/<str:pk>/',ItemDetailView.as_view(),name='item-detail')
]