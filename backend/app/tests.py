from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from . import models, views
from core import views as core_views
import json


class AbstractTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Admin
        cls.admin = models.User.objects.create(
            email="admin@test.com",
            full_name="Test Admin",
            is_active=True,
            is_staff=True,
            role=models.User.ADMIN
        )
        cls.admin.set_password('admin')

        # Manager
        cls.manager = models.User.objects.create(
            email='manager@test.com',
            password='manager',
            full_name="Test Manager",
            is_active=True,
            role=models.User.MANAGER
        )
        cls.manager.set_password('manager')

        # User
        cls.user = models.User.objects.create(
            email="user@test.com",
            full_name="Test User",
            is_active=True,
            role=models.User.MEMBER
        )
        cls.user.set_password('user')


class LoginTestCase(AbstractTestCase):
    def setUp(self):
        self.client.post(
            '/api/users/', {'email': 'azurebean@test.com', 'password': 'azurebean', 'full_name': 'AzureBean'}, format='json')
        user = models.User.objects.get(email='azurebean@test.com')
        user.is_active = True
        user.save()

    def test__login_with_wrong_credentials(self):
        self.client.force_authenticate()
        response = self.client.post(
            '/token/', {'email': 'admin@test.com', 'password': 'wrong_password'}, format='json')
        self.assertEqual(response.status_code, 401)

    def test__login(self):
        response = self.client.post(
            '/token/', {'email': 'azurebean@test.com', 'password': 'azurebean'}, format='json')
        self.assertEqual(response.status_code, 200)


class UserTestCase(AbstractTestCase):
    def test__signup(self):
        response = self.client.post(
            '/api/users/', {'email': 'azurebean@test.com', 'password': 'azurebean', 'full_name': 'AzureBean'}, format='json')
        self.assertEqual(response.status_code, 201)

    def test__profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/profile/')
        self.assertEqual(response.status_code, 200)

    def test__user_list_no_authentication(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 401)

    def test__user_list_role_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 403)

    def test__user_list_role_manager(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)

    def test__user_list_role_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)

    def test__user_get(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/users/{str(self.user.uuid)}/')
        self.assertEqual(response.status_code, 200)

    def test__user_get_manager(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/users/{str(self.manager.uuid)}/')
        self.assertEqual(response.status_code, 403)

    def test__user_update(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            f'/api/users/{str(self.user.uuid)}/', {'name': "New name"})
        self.assertEqual(response.status_code, 200)

    def test__manager_update_user(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(
            f'/api/users/{str(self.user.uuid)}/', {'name': "New name"})
        self.assertEqual(response.status_code, 200)

    def test__admin_update_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f'/api/users/{str(self.user.uuid)}/', {'name': "New name"})
        self.assertEqual(response.status_code, 200)

    def test__user_delete_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f'/api/users/{str(self.user.uuid)}/')
        self.assertEqual(response.status_code, 403)

    def test__manager_delete_user(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.delete(f'/api/users/{str(self.user.uuid)}/')
        self.assertEqual(response.status_code, 204)

    def test__admin_delete_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/users/{str(self.user.uuid)}/')
        self.assertEqual(response.status_code, 204)


class TaskTestCase(AbstractTestCase):
    def setUp(self):
        models.Task.objects.create(
            name="User task",
            duration=8,
            assignee=self.user,
            creator=self.user,
            date="2020-08-15"
        )
        models.Task.objects.create(
            name="User task",
            duration=8,
            assignee=self.user,
            creator=self.user,
            date="2020-07-01"
        )
        models.Task.objects.create(
            name="User task",
            duration=8,
            assignee=self.user,
            creator=self.user,
            date="2020-07-15"
        )
        models.Task.objects.create(
            name="User task",
            duration=8,
            assignee=self.user,
            creator=self.user,
            date="2020-07-31"
        )
        models.Task.objects.create(
            name="User task",
            duration=8,
            assignee=self.user,
            creator=self.user,
            date="2020-06-15"
        )
        self.task_data = {
            'name': 'Sample Task',
            'duration': 2,
            'date': '2020-08-11',
            'note': 'Task Note'
        }

    def test__list_tasks_no_authentication(self):
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 401)

    def test__list_my_tasks_role_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data),
                         models.Task.objects.filter(assignee=self.user).count())

    def test__list_my_tasks_role_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data),
                         models.Task.objects.filter(assignee=self.admin).count())

    def test__manager_list_tasks_of_others(self):
        self.client.force_authenticate(user=self.manager)
        user_uuid = str(self.user.uuid)
        response = self.client.get(f'/api/tasks/?assignee={user_uuid}')
        self.assertEqual(response.status_code, 403)

    def test__admin_list_tasks_of_others(self):
        self.client.force_authenticate(user=self.admin)
        user_uuid = str(self.user.uuid)
        response = self.client.get(f'/api/tasks/?assignee={user_uuid}')
        self.assertEqual(response.status_code, 200)

    def test__filter_my_tasks_role_user(self):
        self.client.force_authenticate(user=self.user)
        user_uuid = str(self.user.uuid)
        start_date = "2020-07-01"
        end_date = "2020-07-31"
        num_july_tasks = models.Task.objects.filter(
            assignee=self.user, date__gte=start_date, date__lte=end_date).count()
        response = self.client.get(
            f'/api/tasks/?assignee={user_uuid}&from={start_date}&to={end_date}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), num_july_tasks)

    def test__create_task(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            '/api/tasks/', self.task_data, format='json')
        self.assertEqual(response.status_code, 201)

    def test__get_task(self):
        self.client.force_authenticate(user=self.user)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.get(
            f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, 200)

    def test__update_task(self):
        self.client.force_authenticate(user=self.user)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.patch(
            f'/api/tasks/{task.id}/', self.task_data, format='json')
        self.assertEqual(response.status_code, 200)

    def test__manager_update_task_user(self):
        self.client.force_authenticate(user=self.manager)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.patch(
            f'/api/tasks/{task.id}/', self.task_data, format='json')
        self.assertEqual(response.status_code, 403)

    def test__admin_update_task_user(self):
        self.client.force_authenticate(user=self.admin)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.patch(
            f'/api/tasks/{task.id}/', self.task_data, format='json')
        self.assertEqual(response.status_code, 200)

    def test__delete_task(self):
        self.client.force_authenticate(user=self.user)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.delete(
            f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, 204)

    def test__manager_delete_task(self):
        self.client.force_authenticate(user=self.manager)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.delete(
            f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, 403)

    def test__admin_delete_task(self):
        self.client.force_authenticate(user=self.admin)
        task = models.Task.objects.filter(assignee=self.user).last()
        response = self.client.delete(
            f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, 204)
