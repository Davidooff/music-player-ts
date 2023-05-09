import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./View/Sections/Auth/Login";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
