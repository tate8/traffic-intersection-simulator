# Droplet Take Home Assignment - Intersection

### DEMO HERE: https://traffic-intersection-eight.vercel.app

**Run yourself**
* Clone this repo
* npm install
* npm run dev
**Code location**
Most of the code I wrote is in the src/components and src/models directories

# Overview
I implemented a program that models a traffic intersection. With vanilla TypeScript and React I was able to implement a solution with clear separation
of concerns. In this case, the view (a React component) doesn't have to worry about how the model (A TypeScript class) works and vice-versa.

## Approach / Implementation
My overall approach used the Model View Controller (MVC) architectural pattern to have the clearest separation of concerns possible.

### Model
The IntersectionHandler class (located in src/models/IntersectionHandler.ts) models a traffic intersection and manages the application's core logic. This class emits a signal whenever its public state changes, providing updates on the traffic lights and their statuses (e.g., "green," "yellow," "red"). Observers can listen to these signals by connecting to the public signal. This class could be used with any kind of view, it is not React specific.

The class also includes a method to toggle traffic sensors. Based on the sensors' activation order and status, the model determines a valid configuration for the traffic lights, ensuring it prioritizes older requests and avoids conflicts. For instance:

* If only the north_left and north_straight sensors are active, both will be served.
* However, if the south_straight sensor was activated before the north_left sensor, the model will prioritize south_straight and north_left.

### View
The Intersection component (located in src/components/Intersection.tsx) shows the current state of the traffic intersection and allows the user to
toggle different sensors on and off. It displays the intersection in a 3x3 grid and shows crosswalks, traffic lights, and lanes graphically.

### Features
See the demo
