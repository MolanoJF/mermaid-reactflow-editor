import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FlowchartEditor from "./pages/FlowchartEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flowchart" element={<FlowchartEditor />} />
      </Routes>
    </Router>
  );
}

export default App;