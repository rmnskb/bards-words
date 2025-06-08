import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./components/Layout";
import HomePage from "./home/HomePage.tsx";
import WordPage from "./words/WordPage.tsx";
import PlayPage from "./plays/PlayPage.tsx";

/**
 * A list of ideas that can be implemented in future iterations of the application
 * TODO: Word of the day? :D
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
          element={
            <Layout/>
          }>
          <Route index element={<HomePage/>}/>
            <Route path="/words/:word" element={<WordPage/>}></Route>
              <Route
                path="/plays/:document/:indices?"
                element={<PlayPage/>}
              ></Route>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
