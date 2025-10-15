# How to run application
## Start application (frontend and backend)
`docker compose up --build`

## Close application
1. ctrl + c in terminal
2. `docker compose down`

## Run tests in backend
firebase emulators:exec "npm --prefix backend test" --project project-id-in-backend-env
