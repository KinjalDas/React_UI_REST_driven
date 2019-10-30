from django.db import models

# Create your models here.
class Issue(models.Model):
    Project = models.CharField(max_length=120,null=True, blank=True)
    Component = models.CharField(max_length=120,null=True, blank=True)
    Title = models.CharField(max_length=120,null=True, blank=True)
    Description = models.TextField(null=True, blank=True)
    CRID = models.CharField(max_length=20,null=True, blank=True)
    Prog_or_Comm = models.TextField(null=True, blank=True)
    Open = models.BooleanField(default=True)

    def __str__(self):
        return self.CRID + " - " + self.Title
