# Garage.Sys // Vehicle Archive

A 3D interactive web showcase for a personal motorcycle and car collection, featuring a sci-fi/cyberpunk garage aesthetic.

## Features
- **3D Hologram Displays**: Real-time 3D environments built with Three.js.
- **Cinematic Camera Choreography**: Scroll-driven camera movements powered by GSAP and ScrollTrigger.
- **Interactive Elements**: Custom cursors, dynamic HUD overlays, and animated specification counters.

## Project Structure
- `showcase.html`: The main structural file containing the UI and layout.
- `showcase.css`: The styling rules that bring the cyberpunk aesthetic to life.
- `showcase.js`: The application logic, including the Three.js scene setup and GSAP scroll animations.

## How to Run Locally
You can run this project locally without any complex build steps. Simply serve the directory using any static file server.

If you have Python installed, you can start a local server by running this command in your terminal from the project directory:

```bash
python3 -m http.server 8080
```

Then, open your web browser and navigate to:
**[http://localhost:8080/showcase.html](http://localhost:8080/showcase.html)**

## Technologies Used
- HTML5 / Vanilla CSS
- Vanilla JavaScript
- [Three.js](https://threejs.org/) (for 3D rendering)
- [GSAP](https://gsap.com/) (for animations and scroll tracking)
