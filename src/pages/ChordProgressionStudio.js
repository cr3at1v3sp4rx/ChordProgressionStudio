import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Download, Play, Pause, Info } from "lucide-react";
import { Midi } from "@tonejs/midi";
import { saveAs } from "file-saver";
import * as Tone from "tone";

// Import UI components from shadcn/ui
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

// Musical constants
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES = ["Major", "Minor"];
const CHORD_TYPES = {
  Major: ["", "m", "m", "", "", "m", "dim"],
  Minor: ["m", "dim", "", "m", "m", "", ""],
};
const COMMON_PROGRESSIONS = {
  "I-V-vi-IV": [0, 4, 5, 3],
  "I-vi-IV-V": [0, 5, 3, 4],
  "vi-IV-I-V": [5, 3, 0, 4],
  // Add more progressions as needed
};

const ChordProgressionStudio = () => {
  // State variables
  const [key, setKey] = useState("C"); // Current musical key
  const [scale, setScale] = useState("Major"); // Current scale (Major or Minor)
  const [progression, setProgression] = useState([]); // Current chord progression
  const [isPlaying, setIsPlaying] = useState(false); // Playback state
  const [currentChordIndex, setCurrentChordIndex] = useState(-1); // Index of currently playing chord

  // Refs for Tone.js objects
  const synth = useRef(null); // Synthesizer for playing chords
  const sequenceRef = useRef(null); // Sequence for chord progression playback

  // Initialize Tone.js synth
  useEffect(() => {
    synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
    return () => {
      if (synth.current) {
        synth.current.dispose();
      }
    };
  }, []);

  // Helper function to get the notes of a chord
  const getChordNotes = useCallback((chord) => {
    const [root, ...rest] = chord.split("");
    const quality = rest.join("");
    const baseNote = root + "4"; // Use octave 4 as the base

    let intervals;
    if (quality.includes("m")) {
      intervals = [0, 3, 7]; // Minor chord
    } else if (quality.includes("dim")) {
      intervals = [0, 3, 6]; // Diminished chord
    } else {
      intervals = [0, 4, 7]; // Major chord
    }

    return intervals.map(interval => 
      Tone.Frequency(baseNote).transpose(interval).toNote()
    );
  }, []);

  // Generate a new chord progression
  const generateProgression = useCallback(() => {
    // Randomly select a progression type
    const progressionType = Object.keys(COMMON_PROGRESSIONS)[
      Math.floor(Math.random() * Object.keys(COMMON_PROGRESSIONS).length)
    ];
    let chordIndices = COMMON_PROGRESSIONS[progressionType];
    const keyIndex = KEYS.indexOf(key);

    // Ensure the progression starts with the selected key
    if (chordIndices[0] !== 0) {
      chordIndices = [0, ...chordIndices];
    }

    // Generate the new progression
    const newProgression = chordIndices.map((index) => {
      const chordRoot = KEYS[(keyIndex + index) % 12];
      const chordType = CHORD_TYPES[scale][index];
      return `${chordRoot}${chordType}`;
    });

    setProgression(newProgression);
    setCurrentChordIndex(-1); // Reset current chord index
  }, [key, scale]);

  // Play or stop the progression
  const playProgression = useCallback(() => {
    if (!isPlaying) {
      // Start playback
      Tone.start();
      const chords = progression.map(getChordNotes);
      let currentIndex = 0;

      const sequence = new Tone.Sequence(
        (time, chord) => {
          synth.current.triggerAttackRelease(chord, "4n", time);
          setCurrentChordIndex(currentIndex);
          currentIndex++;

          // Stop the sequence after playing all chords
          if (currentIndex >= chords.length) {
            Tone.Transport.stop();
            sequence.stop();
            sequence.dispose();
            setIsPlaying(false);
            setCurrentChordIndex(-1);
          }
        },
        chords,
        "4n"
      );

      sequenceRef.current = sequence;
      Tone.Transport.start();
      sequence.start(0);
      setIsPlaying(true);
    } else {
      // Stop playback
      Tone.Transport.stop();
      if (sequenceRef.current) {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
      }
      setCurrentChordIndex(-1);
      setIsPlaying(false);
    }
  }, [isPlaying, progression, getChordNotes]);

  // Download the progression as a MIDI file
  const downloadMidi = useCallback(() => {
    const midi = new Midi();
    const track = midi.addTrack();
    const chordDuration = 1; // 1 second per chord

    progression.forEach((chord, index) => {
      const chordNotes = getChordNotes(chord);
      chordNotes.forEach((note) => {
        track.addNote({
          midi: Tone.Frequency(note).toMidi(),
          time: index * chordDuration,
          duration: chordDuration,
        });
      });
    });

    const blob = new Blob([midi.toArray()], { type: "audio/midi" });
    saveAs(blob, "chord-progression.mid");
  }, [progression, getChordNotes]);

  // Get insight for each chord in the progression
  const getChordInsight = (chord, index) => {
    const insights = {
      0: "Tonic chord, provides a sense of resolution",
      1: "Builds tension, often leading back to the tonic",
      2: "Creates movement, often used in transitions",
      3: "Subdominant chord, creates anticipation",
      4: "Dominant chord, creates strong pull to the tonic",
      5: "Related to the tonic, often used for emotional effect",
      6: "Creates tension, typically resolves to the tonic",
    };
    return insights[index] || "Adds color and interest to the progression";
  };

  // Helper function for Music Theory Insights
  const getTheoryInsights = useCallback((progression) => {
    return `This chord progression (${progression.join(' - ')}) creates a unique emotional journey. 
    It starts with ${progression[0]}, which establishes the key, and ends with ${progression[progression.length - 1]}, 
    giving a sense of ${progression[progression.length - 1].includes('m') ? 'tension' : 'resolution'}.`;
  }, []);

  return (
    <TooltipProvider>
      {/* Main container with gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8"
      >
        {/* Title with animation */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-12"
        >
          Chord Progression Studio
        </motion.h1>
        {/* Main content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Chord Progression Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column: Settings and Controls */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Settings</h3>
                  <div className="space-y-4">
                    {/* Key Selection Dropdown */}
                    <Select value={key} onValueChange={(value) => setKey(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a key" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800">
                        {KEYS.map((k) => (
                          <SelectItem 
                            key={k} 
                            value={k} 
                            className="hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Scale Selection Dropdown */}
                    <Select value={scale} onValueChange={(value) => setScale(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a scale" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800">
                        {SCALES.map((s) => (
                          <SelectItem 
                            key={s} 
                            value={s} 
                            className="hover:bg-blue-600 transition-colors cursor-pointer"
                          >
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-8 space-y-4">
                    <Button onClick={generateProgression} className="w-full">
                      <Shuffle className="mr-2" /> Generate Progression
                    </Button>
                    <Button onClick={playProgression} className="w-full">
                      {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                      {isPlaying ? "Stop" : "Play"}
                    </Button>
                    <Button onClick={downloadMidi} className="w-full">
                      <Download className="mr-2" /> Download MIDI
                    </Button>
                  </div>
                </div>
                {/* Right column: Progression Display and Insights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Progression</h3>
                  <div className="space-y-4">
                    {/* Animated Chord Display */}
                    <AnimatePresence>
                      {progression.map((chord, index) => (
                        <motion.div
                          key={chord + index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
                            currentChordIndex === index
                              ? "bg-blue-700"
                              : "bg-gray-700"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold">{chord}</span>
                            {/* Chord Insight Tooltip */}
                            <Tooltip>
                              <TooltipTrigger>
                                <Info size={16} />
                              </TooltipTrigger>
                              <TooltipContent>
                                {getChordInsight(chord, index)}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {/* Music Theory Insights */}
                    {progression.length > 0 && (
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle>Music Theory Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{getTheoryInsights(progression)}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
};

export default ChordProgressionStudio;