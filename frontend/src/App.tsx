import {BrowserRouter, Routes, Route} from "react-router";

import HomePage from "./home/HomePage.tsx";
import WordPage from "./words/WordPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/words" element={<WordPage/>}></Route>
                <Route path="/words/:word" element={<WordPage/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
