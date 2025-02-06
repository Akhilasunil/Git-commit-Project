import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Page from "./Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/repositories/:owner/:repo/commits/:commitOid" element={<Page/>} />
      </Routes>
    </Router>
  );
}

export default App;