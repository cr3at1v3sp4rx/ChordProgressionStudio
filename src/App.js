import React from "react";
import { HashRouter  as Router, Route, Routes } from "react-router-dom";
import ChordProgressionStudio from "./pages/ChordProgressionStudio";





const App = () => {
  return (

        <Router>
                        <Routes>
                          <Route path="/" element={<ChordProgressionStudio />} />

                        </Routes>
                     
        </Router>

  );
};

export default App;
