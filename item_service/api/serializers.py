from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.Serializer):
    item_id=serializers.IntegerField(read_only=True)
    name=serializers.CharField(max_length=100)
    description=serializers.CharField(max_length=100)
    price=serializers.IntegerField()

    def create(self, validated_data):
        return Item(**validated_data).save()