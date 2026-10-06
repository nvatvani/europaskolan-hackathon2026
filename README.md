# europaskolan-hackathon2026

## Hackathon Ideas

### Project 1: **Customizable Pac-Man Game**
- The game includes an `<input type="file" accept="image/*">` that reads a file dynamically using the JavaScript `FileReader` API.
- The game features a "Reset to Default" button to revert to the classic canvas-drawn Pac-Man.
- The rendering logic must cleanly toggle between the HTML5 Canvas arc-based drawing (for the default Pac-Man) and `ctx.drawImage` (for the uploaded custom image).
- The custom image should be centered on the player's coordinate and appropriately scaled to fit the grid.

Link to [Pacman](./1-pacman/index.html)