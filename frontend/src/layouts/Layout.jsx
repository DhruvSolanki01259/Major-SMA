import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  // Define routes that should display Header and Footer
  const layoutRoutes = ["/", "/profile", "/content-studio"];

  // Define routes that should NOT display Header and Footer
  const excludedRoutes = ["/login", "/signup"];

  // Determine if the current path is one of the valid layout routes
  const isLayoutRoute = layoutRoutes.includes(pathname);

  // Determine if the current path is excluded (auth routes)
  const isExcludedRoute = excludedRoutes.includes(pathname);

  // If it's not in layoutRoutes or is excluded, hide Header/Footer
  const showLayout = isLayoutRoute && !isExcludedRoute;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      {/* Show Navbar only for allowed routes */}
      {showLayout && <Navbar />}

      {/* Main content */}
      <main
        className={`flex-grow ${
          showLayout ? "pt-20 px-4 md:px-8 lg:px-16" : ""
        }`}
      >
        {children}
      </main>

      {/* Show Footer only for allowed routes */}
      {showLayout && <Footer />}
    </div>
  );
};

export default Layout;
