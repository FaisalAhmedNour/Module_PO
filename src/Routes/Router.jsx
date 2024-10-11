import { createMemoryRouter } from "react-router-dom";
import Main from "../Layouts/Main/Main";
import POExtraction from "../pages/POExtraction/POExtraction";

export const router = createMemoryRouter([
    {
        path: "/",
        element:<Main />,
        // errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <POExtraction />
            },
        ]
    }
]);