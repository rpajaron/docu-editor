import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage.js";
import { RoomPage } from "./pages/RoomPage.js";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/r/:roomId" element={<RoomPage />} />
    </Routes>
  );
}
