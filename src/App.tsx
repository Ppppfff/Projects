import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainContent from "./components/MainContent";
import StartScreen from './components/StartScreen';
import { UserProvider } from "./context/UserContext";
import { FilterProvider } from "./context/FilterContext";
import { Toaster } from 'sonner';




function App() {

  return (
    <>
      <UserProvider>
        <FilterProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<StartScreen />} />
              <Route path="/main" element={<MainContent />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </FilterProvider>
      </UserProvider>
      <Toaster />
    </>
  )
}

export default App
