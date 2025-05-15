
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-route-light py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-route-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-semibold">Route En Direct</span>
            </Link>
            <p className="mt-4 text-gray-600">
              La solution de suivi de transport routier en temps réel pour vous et vos clients.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-route-primary">Accueil</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-route-primary">Connexion</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>123 Rue du Transport</li>
              <li>75001 Paris, France</li>
              <li>contact@route-en-direct.fr</li>
              <li>+33 1 23 45 67 89</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-route-primary">Conditions d'utilisation</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-route-primary">Politique de confidentialité</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Route En Direct. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
