import React from 'react';
import './App.css';
import Search from "./containers/Search/Search";
import { RecoilRoot } from "recoil";
import 'font-awesome/css/font-awesome.min.css';
import MainScreen from "./containers/MainScreen/MainScreen";
import SearchingScreen from "./containers/SearchingScreen/SearchingScreen";
import SummarizingScreen from "./containers/SummarizingScreen/SummarizingScreen";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SummarizedScreen from "./containers/SummarizedScreen/SummarizedScreen";

function App() {
    return (
        <RecoilRoot>
            <Router>
                <Main />
            </Router>
        </RecoilRoot>
    );
}

const Main = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        const allowedPaths = ['/search', '/searching', '/summarized'];
        if (!allowedPaths.includes(location.pathname)) {
            navigate('/search');
        }
    };

    return (
        <div className="App" onClick={handleClick}>
            <header className="App-header">
                <Routes>
                    <Route path="/" element={<MainScreen text={"Empower knowledge with every search"} />} />
                    <Route path="/search" element={<MainScreen text={"Display with ease"}><Search /></MainScreen>} />
                    <Route path="/searching" element={<SearchingScreen />} />
                    <Route path="/summarized" element={<SummarizedScreen />} />
                </Routes>
            </header>
        </div>
    );
};

export default App;
