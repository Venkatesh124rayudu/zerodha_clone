import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import { AuthProvider } from "./components/AuthContext";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {/* Nothing renders until the session is confirmed; logged-out users go to the login page. */}
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
