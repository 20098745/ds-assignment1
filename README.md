# Serverless REST Assignment 1 - Disributed Systems

Name: Daniel Keane

Demo: 

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Context

For this assignment I chose to use movie data for my API. This API is designed to create, store, and manage movie information. It contains info such as 

* id - The unique identifier for each movie
* original_title - The official name of the movie
* overview - A brief description of the movie
* release_date - the date the movie was released

and more!!!

## App API Endpoints

[ Provide a bullet-point list of the app's endpoints (excluding the Auth API) you have successfully implemented. ] e.g.

* GET /movies - Gets all movies
* GET /movies/(movieId) - Gets the movie based on the provided ID
* POST /movies - Add a new movie
* DELETE /movies/(movieId) - Delete a movie based on the provided ID
* PUT /movies/(movieId) - Update parameters of a movie based on the provided ID

