import {BrowserRouter, Routes, Route} from "react-router";

import HomePage from "./home/HomePage.tsx";
import WordPage from "./words/WordPage.tsx";
import PlayPage from "./plays/PlayPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/words/:word" element={<WordPage/>}></Route>
                <Route
                    path="/plays/:document/:indices?"
                    element={<PlayPage/>}
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
