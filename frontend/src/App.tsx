import "./index.css";
import NavBar from "./NavBar/NavBar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <NavBar />
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <LoginPage />,
  },
]);
function App() {
  return <RouterProvider router={appRouter}></RouterProvider>;
}

export default App;
