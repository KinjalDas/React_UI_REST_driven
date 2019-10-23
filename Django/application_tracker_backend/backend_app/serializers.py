from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):
      class Meta:
        model = Issue
        fields = ('id', 'CRID' , 'Project' , 'Title' , 'Component' , 'Description' , 'Prog_or_Comm' , 'Open')
