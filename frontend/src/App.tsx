import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import WordPage from "./pages/WordPage";
import PlayPage from "./pages/PlayPage";
import WordlePage from "./pages/WordlePage";

/**
 * A list of ideas that can be implemented in future iterations of the application
 * TODO: Word of the day? :D -> Wordle
 */

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/words/:word" element={<WordPage />}></Route>
          <Route
            path="/plays/:document/:indices?"
            element={<PlayPage />}
          ></Route>
          <Route path="/wordle" element={<WordlePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
