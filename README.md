# ThrowTrack

ThrowTrack is a web-based application designed for tracking pitching sessions, specifically for baseball pitchers. It allows users to monitor their pitch count, ball/strike count, and the number of pitches thrown in different strike zones during each session. The application is built with **HTML**, **CSS**, and **JavaScript** for the front-end, and **EJS** templating to render dynamic content from a Node.js server.

## Features

- **Pitch Count**: Increment or decrement the pitch count with + or - buttons.
- **Ball and Strike Counter**: Track balls and strikes during a pitching session.
- **Strike Zone Tracker**: Visualize and track pitch counts in each zone of the strike zone layout.
- **Past Sessions**: View past pitching sessions with detailed statistics, including pitch count, ball/strike counts, and strike zone data.
- **Session Management**: End a session and save its data for future reference.

## Future Features

### Graphs and Charts

To enhance the user experience and provide deeper insights into pitching performance, I plan to integrate **graphs** and **charts**. This will allow users to visualize their pitching trends over time, making it easier to analyze their progress.

#### Possible Graphs and Charts:

1. **Pitch Count Over Time**: A line graph showing how pitch counts have evolved during different sessions.
2. **Ball vs. Strike Chart**: A pie chart or bar graph comparing the total number of balls versus strikes thrown in each session.
3. **Strike Zone Distribution**: A heat map or bar chart visualizing how often pitches land in each of the 9 strike zones.

### How to Implement:

- **Chart.js** will be used to create various types of charts such as line charts, pie charts, and bar graphs. This JavaScript library is easy to implement and ideal for this purpose.
- To track historical data for charting purposes, I'll need to store session data in a database (e.g., MongoDB) to query and visualize trends over time.
- **D3.js** could be another potential library for creating more dynamic and complex visualizations like a heat map to show the distribution of pitches in the strike zone.

## Installation

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Steps to Get Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/throwtrack.git


### URL
<a href="web-production-6f765.up.railway.app">throwtrack.com</a>
