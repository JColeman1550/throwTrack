# ThrowTrack

ThrowTrack is a web-based application designed for tracking pitching sessions, specifically for baseball pitchers. It allows users to monitor their pitch count, ball/strike count, and the number of pitches thrown in different strike zones during each session. The application is built with **HTML**, **CSS**, and **JavaScript** for the front-end, and **EJS** templating to render dynamic content from a Node.js server.

## Why ThrowTrack?

ThrowTrack was created to help address the growing concern of overuse injuries in youth baseball pitchers. By providing a tool that allows coaches and parents to monitor pitch counts and performance data, ThrowTrack empowers them to make informed decisions about a pitcher's workload and ensure their long-term health and safety. With easy-to-use tracking features, ThrowTrack aims to foster a culture of responsible pitching management at the youth level.

## Features

- **Pitch Count**: Increment or decrement the pitch count with + or - buttons.
- **Ball and Strike Counter**: Track balls and strikes during a pitching session.
- **Strike Zone Tracker**: Visualize and track pitch counts in each zone of the strike zone layout.
- **Past Sessions**: View past pitching sessions with detailed statistics, including pitch count, ball/strike counts, and strike zone data.
- **Session Management**: End a session and save its data for future reference.

## Screenshots

### Home Page
![Home Page](https://github.com/JColeman1550/throwTrack/blob/main/tt-home-mobile.jpeg?raw=true)

### Login Page
![Login Page](https://github.com/JColeman1550/throwTrack/blob/main/tt-login-mobile.jpeg?raw=true)

### Signup Page
![Signup Page](https://github.com/JColeman1550/throwTrack/blob/main/tt-signup-mobile.jpeg?raw=true)

### Past Sessions
![Past Sessions](https://github.com/JColeman1550/throwTrack/blob/main/tt-past-mobile.jpeg?raw=true)

### Strike Zone Data
![Strike Zone Data](https://github.com/JColeman1550/throwTrack/blob/main/tt-szdata-mobile.jpeg?raw=true)

### Tracker Page
![Tracker Page](https://github.com/JColeman1550/throwTrack/blob/main/tt-tracker-phone.jpeg?raw=true)

## Future Features

### Graphs and Charts

To enhance the user experience and provide deeper insights into pitching performance, I plan to integrate **graphs** and **charts** that allow users to track and analyze their data over time.

#### Planned Integrations:

1. **Pitch Count Over Time**:
   - A line graph showing the evolution of pitch counts across different sessions.
   - Helps pitchers understand workload trends.

2. **Ball vs. Strike Comparison**:
   - A pie chart or bar graph to visualize the ratio of balls to strikes in each session.
   - Useful for identifying patterns in pitching accuracy.

3. **Strike Zone Distribution**:
   - A heat map or bar chart to display the frequency of pitches landing in each of the 14 strike zones.
   - Provides a clear visualization of pitching precision and control.

#### Implementation Plans:

- **Chart.js**: This library will be used to create interactive and visually appealing charts such as line graphs, pie charts, and bar graphs.
- **Historical Data Storage**: A database (e.g., MongoDB) will store session data, enabling detailed analysis and visualization of trends over time.
- **D3.js**: For more dynamic and advanced visualizations like heat maps, showcasing strike zone distribution.


## Installation

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Steps to Get Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/throwtrack.git
   ```

## URL

<a href="https://web-production-6f765.up.railway.app/">throwtrack.com</a>
