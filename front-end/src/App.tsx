import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./routes/login";


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
