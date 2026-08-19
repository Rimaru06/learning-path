import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { DashboardPage } from "./pages/DashboardPage";
import { GoalsPage } from "./pages/GoalsPage";
import { LearningPathPage } from "./pages/LearningPathPage";
import { TopicsPage } from "./pages/TopicsPage";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Nav />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/learning-path" element={<LearningPathPage />} />
              <Route path="/topics" element={<TopicsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}
