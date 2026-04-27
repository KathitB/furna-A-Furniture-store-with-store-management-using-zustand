import "./App.css";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import { useAuthsStore } from "./components/store/authStore";

function App() {
  const user = useAuthsStore((state) => state.user);
  const isAuthenticated = useAuthsStore((state) => state.isAuthenticated);
  const logout = useAuthsStore((state) => state.logout);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;
