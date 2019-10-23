from django.db import models

# Create your models here.
class Issue(models.Model):
    Project = models.CharField(max_length=120)
    Component = models.CharField(max_length=120)
    Title = models.CharField(max_length=120)
    Description = models.TextField()
    CRID = models.CharField(max_length=20)
    Prog_or_Comm = models.TextField()
    Open = models.BooleanField(default=False)

    def __str__(self):
        return self.CRID + " - " + self.Title
