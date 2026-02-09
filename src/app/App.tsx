import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CasesProvider } from "./contexts/cases-context";

export default function App() {
  return (
    <CasesProvider>
      <RouterProvider router={router} />
    </CasesProvider>
  );
}