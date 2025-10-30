import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TaskPage from "./TaskPage/TaskPage.tsx";
import HomePage from "./HomePage/HomePage.tsx";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: (
            // <ProtectedRoute>
                <HomePage />
            // </ProtectedRoute>
        ),
    },
    {
        path: "/auth",
        element: <LoginPage />,
    },
    {
        path: "/tasks",
        element: <TaskPage />,
    },
]);

function App() {
    return <RouterProvider router={appRouter} />;
    // return <FrontEndHomePage />;
    // return <TaskPage />;
}

export default App;
