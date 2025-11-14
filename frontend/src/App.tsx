import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage.tsx";
import { ProtectedRoute } from "./components/login/ProtectedRoute.tsx";
import TaskPage from "./pages/tasks/TaskPage.tsx";
import HomePage from "./pages/home/HomePage.tsx";
import NavBar from "./components/navbar/NavBar.tsx";
import { AuthProvider } from "./components/context/AuthContext.tsx";

function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/auth";

  return (
    <div className="page">
      {!hideNav && <NavBar />}
      <Outlet />
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tasks",
        element: (
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth",
        element: <LoginPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}

export default App;
