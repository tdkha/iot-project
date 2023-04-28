# IoT Supermarket Project
This is a web application for displaying products scanned by a scanner and managing a supermarket inventory.
The project contains a scanner built with Arduino board. However, it is made possible to use request sending software like Thunder Client or Postman. 

## Technology stack
The Supermarket App is built using the following technologies:

[![My Skills](https://skillicons.dev/icons?i=js,mysql,nodejs,react,css,docker)](https://skillicons.dev)
- React: A popular JavaScript library for building user interfaces.
- Redux: A state management library for JavaScript applications.
- Axios: A popular HTTP client for making API requests.
- Node.js: A JavaScript runtime for building server-side applications.
- Express: A popular web framework for Node.js.
- MySQL: Relational Datbase 

## Getting Started
To run the application locally, you will need to have Node.js and npm installed. Clone the repository and run the following commands in the project directory:

Initializing Front end:
```bash
cd ./iot-project
cd ./iot-frontend

npm run start
```
This will start the front end and open the app in your default browser at http://localhost:3000.

Initializing Back end:
```bash
cd ./iot-project
cd ./iot-backend

node server.js
```
This will start the back end and open the server in your default browser at http://localhost:8000.

Sending request including product barcode and scanner identification to the server:
```bash
{
  "qr_code": "FIzOVHpv9DFf9FJ96z",
  "scanner_id":2
}
```
