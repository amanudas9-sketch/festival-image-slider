# Festival Nights in the Square - Vanilla JS Image Slider

A dependency-free, infinite-loop image slider using plain HTML, CSS and JavaScript.

## Files
- `index.html` - page and the 5 slides
- `style.css` - layout, sliding track, controls, responsive rules
- `slider.js` - `Gallery` class (loop logic, dots, arrows, swipe, autoplay)
- `images/` - `photo-1.jpg` ... `photo-5.jpg`

## Features
- Smooth sliding animation (CSS `transform`), never a fade
- Seamless infinite loop in both directions
- Previous / Next arrows, clickable dot indicators, slide counter
- Autoplay with Play / Pause button (pauses on hover)
- Keyboard arrows, touch and mouse swipe
- Responsive, respects `prefers-reduced-motion`

## Use your own photos
Put your images in `images/` and change the `<img src>` / `alt` / caption in each
`<li class="card">` in `index.html`. Add or remove `<li>` blocks freely; the dots and
counter update automatically. Photos work best at 16:9.

## Run locally
Open `index.html` in a browser.

## Deploy on GitHub Pages
1. Create a public repository on GitHub.
2. Upload `index.html`, `style.css`, `slider.js` and the `images/` folder.
3. Go to Settings -> Pages.
4. Source: Deploy from a branch -> `main` -> `/ (root)` -> Save.
5. Open the URL GitHub shows once the build finishes.
