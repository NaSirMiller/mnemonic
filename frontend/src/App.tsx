import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import "./style.css"; // Make sure your CSS file is in the same folder or adjust the path

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/auth", element: <LoginPage /> },
]);
function App() {
  return <RouterProvider router={appRouter}></RouterProvider>;
}

export default App;
