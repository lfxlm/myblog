# Generated by Django 2.2.5 on 2020-07-04 07:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0004_art_channel_art_class_channel_classify'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='art_channel',
            options={'verbose_name': '标签表', 'verbose_name_plural': '标签表'},
        ),
        migrations.AlterModelOptions(
            name='art_class',
            options={'verbose_name': '标签表', 'verbose_name_plural': '标签表'},
        ),
        migrations.AlterModelOptions(
            name='classify',
            options={'verbose_name': '标签表', 'verbose_name_plural': '标签表'},
        ),
        migrations.AlterModelTable(
            name='art_channel',
            table='t_art_channel',
        ),
        migrations.AlterModelTable(
            name='art_class',
            table='t_art_classify',
        ),
        migrations.AlterModelTable(
            name='classify',
            table='t_classify',
        ),
    ]
