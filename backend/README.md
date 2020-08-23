# Time Management Core

The backend of the time management app written in Python/Django.

## Requirements

- Python3.8
- Pip3

## Installation

- `pip install pipenv`
- `pipenv shell`
- `pipenv install`
- `python manage.py migrate`
- `python manage.py createsuperuser`
- Use the following credentials
  - Email: `admin@gmail.com`
  - Password: `password`
- `python manage.py runserver`

The app will run on `http://localhost:8000/`

## Setup accounts for demo and testing

- Create the following accounts:

  - Manager account: `manager@gmail.com` / `password` / `Manager`
  - User account: `user@gmail.com` / `password` / `User`
  - Test account: `test@gmail.com` / `password` / `Tester`

  - _Method 1_: Using curl. For example: `curl -XPOST -H "Content-type: application/json" -d '{"email": "manager@gmail.com", "password": "password", "full_name":"Manager"}' 'http://localhost:8000/api/users/'`
  - _Method 2_: Sign up using frontend UI with the option to activate account by activation link.

- Activate and set roles to these accounts
  - Go to `http://localhost:8000/admin/`
  - Login with admin credentials
  - For each user, check the `Active` box and select the according role.

## Tests

- Test API Endpoints with APIClient:
  - `pipenv shell`
  - `python manage.py test`

## API References

- `http://localhost:8000/docs/`

## Notes

- For demo purpose, a `.env` file is commited along with code.
