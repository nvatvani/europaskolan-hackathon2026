# Customizable Pac-Man Game Specifications

This directory contains a web-based implementation of a Pac-Man game with a dynamic feature allowing the player character's sprite to be replaced with a custom user-uploaded image.

## Prompt Re-generation / Requirements
If you are an LLM or developer tasked with regenerating or expanding this code, adhere to the following specifications:

### Core Requirements
1. **Architecture**: Standard Web App (Vanilla HTML5, CSS3, JavaScript). No external frameworks required.
2. **Graphics/Rendering**: HTML5 `<canvas>` element mapped to an internal tile grid system (21x21 tiles, 20px each).
3. **Player Customization Feature**:
   - The game includes an `<input type="file" accept="image/*">` that reads a file dynamically using the JavaScript `FileReader` API.
   - The game features a "Reset to Default" button to revert to the classic canvas-drawn Pac-Man.
   - The rendering logic must cleanly toggle between the HTML5 Canvas arc-based drawing (for the default Pac-Man) and `ctx.drawImage` (for the uploaded custom image).
   - The custom image should be centered on the player's coordinate and appropriately scaled to fit the grid.
4. **Speed Control Feature**:
   - The game includes a dropdown `<select>` allowing the user to adjust the game speed (Slow for Kids Mode, Normal, Fast).
   - Speed changes dynamically update the player's current and intended movement velocity without restarting the game.

### Game Logic Details
- **Grid Map**: Represent the map as a 2D matrix where integers signify:
  - `1`: Wall (blue blocks)
  - `0`: Edible Dot (pinkish circles)
  - `2`: Empty Space
- **Movement Mechanics**:
  - The player moves using keyboard arrow keys.
  - Movement is pixel-based but constrained by collision detection against the tile map bounding boxes.
  - Basic corner-rounding/snapping logic makes turning smoother in corridors.
  - Screen wrapping (tunnels) on the left and right edges.
- **Score System**: Eating dots increases the score (+10 points per dot), dynamically updating the DOM element.

### File Structure
- `index.html`: Contains the UI layout, controls panel (score, file upload, reset button), and the main `<canvas>` element.
- `style.css`: Modern, dark-themed styling that highlights the game board and styled control buttons.
- `script.js`: Handles the core game loop (`requestAnimationFrame`), state management, input handling, and canvas rendering.

### Future Expansion Ideas for Subsequent Prompts
- **Ghost AI**: Implement Blinky, Pinky, Inky, Clyde with unique pathfinding algorithms (Chase, Scatter, Frightened modes).
- **Power Pellets**: Add large dots that temporarily make ghosts edible, enabling combo scoring.
- **Level Progression**: Implement multiple map layouts and speed scaling.
- **Customizable Assets**: Extend the custom image feature to Ghosts and Map Textures.
- **Audio Integration**: Add sound effects via the Web Audio API for movement, eating, and game over states.
