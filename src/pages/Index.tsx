
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TrackingForm from "../components/TrackingForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Section Héro */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Suivez vos livraisons en temps réel
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Route En Direct vous offre une visibilité complète sur vos transports routiers, de l'expédition à la livraison.
                </p>
                <div className="space-x-4">
                  <Link to="/login">
                    <Button className="bg-route-primary hover:bg-blue-700">
                      Espace transporteur
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                  <TrackingForm />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section Fonctionnalités */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Route En Direct ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-route-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Suivi en temps réel</h3>
                <p className="text-gray-600">
                  Visualisez la position exacte de vos véhicules sur une carte interactive avec mises à jour toutes les 30 secondes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-route-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">ETA précis</h3>
                <p className="text-gray-600">
                  Estimations d'arrivée dynamiques qui prennent en compte le trafic, les temps de repos et les contraintes douanières.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-route-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Interface client</h3>
                <p className="text-gray-600">
                  Offrez à vos clients une vision claire et transparente de leur livraison avec une timeline intuitive des étapes du transport.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section Call to Action */}
        <section className="bg-route-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à améliorer la visibilité de vos transports ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez les transporteurs qui font confiance à Route En Direct pour optimiser leur suivi logistique.
            </p>
            <Link to="/login">
              <Button className="bg-white text-route-primary hover:bg-blue-50">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
