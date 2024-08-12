Here's a `README.md` file for your project. It includes a brief overview, installation instructions, usage information, and a list of dependencies.

```markdown
# Chord Progression Studio

Chord Progression Studio is a React application designed to help musicians and music enthusiasts generate and play chord progressions. The application allows users to select a musical key and scale, generate random chord progressions, and download them as MIDI files for further use in music production.

## Features

- **Key and Scale Selection**: Choose from a variety of musical keys and scales (Major or Minor).
- **Chord Progression Generation**: Generate random chord progressions using common progression patterns.
- **Chord Playback**: Play back generated chord progressions with real-time audio synthesis using Tone.js.
- **Download as MIDI**: Save chord progressions as MIDI files for use in DAWs and music software.
- **Music Theory Insights**: Get insights into the chord progressions and their musical significance.

## Installation

To run this application locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/chord-progression-studio.git
   cd chord-progression-studio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   This will launch the application in your default web browser at `http://localhost:3000`.

## Usage

- **Select Key and Scale**: Use the dropdown menus to select your desired key and scale.
- **Generate Progression**: Click the "Generate Progression" button to create a new chord progression.
- **Play Progression**: Click the "Play" button to listen to the generated progression. Click again to stop playback.
- **Download MIDI**: Click the "Download MIDI" button to save the progression as a MIDI file.

## Project Structure

The main component of the application is `ChordProgressionStudio`, which handles the user interface and logic for generating and playing chord progressions. The project uses several UI components from the `shadcn/ui` library for styling and interaction.

## Dependencies

This project relies on the following libraries:

- **React**: ^18.3.1
- **Tone.js**: ^15.0.4 for audio synthesis
- **Framer Motion**: ^11.3.24 for animations
- **Lucide-react**: ^0.427.0 for icons
- **File-saver**: ^2.0.5 for downloading files
- **Tailwind CSS**: Used for styling
- **Radix UI**: For accessible components like Select and Tooltip

### Full List of Dependencies

```json
"dependencies": {
  "@radix-ui/react-select": "^2.1.1",
  "@radix-ui/react-tooltip": "^1.1.2",
  "@testing-library/jest-dom": "^5.17.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/user-event": "^13.5.0",
  "@tonejs/midi": "^2.0.28",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.1",
  "file-saver": "^2.0.5",
  "framer-motion": "^11.3.24",
  "lucide-react": "^0.427.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.0",
  "react-scripts": "5.0.1",
  "tailwind-merge": "^2.5.0",
  "tailwindcss-animate": "^1.0.7",
  "tone": "^15.0.4",
  "web-vitals": "^2.1.4"
}
```

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Acknowledgements

Special thanks to the developers of Tone.js, Framer Motion, and Radix UI for their amazing libraries that made this project possible.

```

This `README.md` provides an overview of the project, instructions for setting it up, usage guidelines, and information about its dependencies. Adjust the repository URL, license, and any other specific details to fit your project's needs.
