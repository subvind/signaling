signaling
========
PeerJS is a library that takes advantage of WebRTC for secure real time communication peer-to-peer. The complicated bit is distributing IDs between all the peers so that they may get that initial connection between one another; hence, the name: "signaling" server.

| Centralized                  | Coordnation               |
| ---------------------------- | ------------------------- |
| ![image](images/neurons.jpg) | ![image](images/bird.jpg) |

flow:
- every user authenticates with firebase and has an email address.
- every user may search for other users by username, displayName, photo, description, location, url, and checkMark.
- every user may call any other user.
- every user may answer any other user's call event.
- after two users connect they transfer over to using WebRTC.
- while stripe subscriptions is for users that want to have a checkMark next to their profile.
- perfect initiating.

dependents:
- https://github.com/trabur/secret-optimizer

requirements:
- https://console.firebase.google.com/project/istrav/authentication/users
- https://app.redislabs.com
- https://dashboard.pusher.com
- https://railway.app/
- https://github.com/stripe/stripe-node

## Installation
```bash
$ npm install
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```