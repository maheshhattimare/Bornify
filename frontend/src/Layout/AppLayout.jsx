import { Outlet, useLocation, matchPath } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../components/Common/ScrollToTop";

const AppLayout = () => {
  const location = useLocation();

  // Routes where Header and Footer should be hidden
  const hiddenLayoutRoutes = [
    "/login",
    "/signup",
    "/404",
    "/",
    "/reset-password/:token", // dynamic example
  ];

  // Check if current path matches any hidden route pattern
  const hideLayout = hiddenLayoutRoutes.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Header />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
};

export default AppLayout;
