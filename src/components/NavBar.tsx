
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated, logoutUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-route-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-semibold">Route En Direct</span>
          </Link>
          
          {/* Navigation pour desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-gray-600 hover:text-route-primary">
              Accueil
            </Link>
            {authenticated ? (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-route-primary">
                  Administration
                </Link>
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  className="text-route-primary border-route-primary hover:bg-route-primary hover:text-white"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="text-route-primary border-route-primary hover:bg-route-primary hover:text-white"
              >
                Connexion
              </Button>
            )}
          </div>
          
          {/* Menu burger pour mobile */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="h-6 w-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-route-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              {authenticated ? (
                <>
                  <Link 
                    to="/admin" 
                    className="text-gray-600 hover:text-route-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administration
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-route-primary border-route-primary hover:bg-route-primary hover:text-white w-full"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="text-route-primary border-route-primary hover:bg-route-primary hover:text-white w-full"
                >
                  Connexion
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
