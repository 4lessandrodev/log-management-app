# Testing - TS-LOG

Testing ts-log lib to manage logs

---

## How to run this app

- Install deps `yarn`
- Run the app `yarn dev`

---

## Logs by domain

### Simulate a not throw route log

- Generate log on file in root folder /logs/domain
- Show logs on terminal

```sh

curl --location --request POST 'http://localhost:3000/domain' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "valid@email.com", 
    "password": "12345", 
    "id": "1"
}'

```

### Simulate internal server error log

Generate a log from `stackLog` middleware

- Write log on file
- Send log to client (browser)
- Show log on terminal

```sh

curl --location --request GET 'http://localhost:3000/fail'

```

### Simulate empty log

Generate a log from `stackLog` middleware

- Send log to client (browser)

```sh

curl --location --request GET 'http://localhost:3000/ok'

```