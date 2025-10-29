import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import FrontEndHomePage from "./HomePage/HomePage";
const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
        <ProtectedRoute>
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
    // return <RouterProvider router={appRouter}></RouterProvider>;
    return <FrontEndHomePage />
}

export default App;
