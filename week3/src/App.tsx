import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Calendar from "./pages/Calendar";
import Kanban from "./pages/Kanban";
import Settings from "./pages/Settings";

function App() {
	return (
		<ThemeProvider>
			<DataProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/tables" element={<Tables />} />
							<Route path="/calendar" element={<Calendar />} />
							<Route path="/kanban" element={<Kanban />} />
							<Route path="/settings" element={<Settings />} />
						</Routes>
					</Layout>
				</Router>
			</DataProvider>
		</ThemeProvider>
	);
}

export default App;
