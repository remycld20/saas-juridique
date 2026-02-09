import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/root-layout";
import { LoginPage } from "./pages/login";
import { SignUpPage } from "./pages/signup";
import { DashboardPage } from "./pages/dashboard";
import { CasePage } from "./pages/case";
import { NewCasePage } from "./pages/new-case";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LoginPage },
      { path: "signup", Component: SignUpPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "dashboard/new-case", Component: NewCasePage },
      { path: "case/:caseId", Component: CasePage },
    ],
  },
]);