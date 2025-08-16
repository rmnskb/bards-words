import { BrowserRouter, Route, Routes } from "react-router";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import WordlePage from "./pages/WordlePage";
import WordPage from "./pages/WordPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/words/:word" element={<WordPage />}></Route>
          <Route path="/wordle" element={<WordlePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
