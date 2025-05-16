import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // D'abord vérifier si c'est l'admin
      const adminResult = await loginUser(email, password);
      
      if (adminResult.success) {
        toast.success("Connexion réussie, vous allez être redirigé vers le tableau de bord.");
        navigate("/admin");
        return;
      }
      
      // Si ce n'est pas l'admin, vérifier les utilisateurs enregistrés
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === email);
      
      if (user && `hashed_${password}` === user.password) {
        // Mémoriser l'utilisateur connecté
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: "user",
          plan: user.plan || "gratuit" // Ajout du plan d'abonnement
        }));
        
        toast.success("Connexion réussie, vous allez être redirigé vers votre tableau de bord.");
        navigate("/dashboard");
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@route-en-direct.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-route-primary hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
                
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    Pour la démo admin, utilisez:<br />
                    Email: admin@route-en-direct.fr<br />
                    Mot de passe: admin123
                  </p>
                  
                  <p className="text-gray-600 text-sm mt-4">
                    Pas encore de compte ?{" "}
                    <a
                      href="/route-en-direct/register"
                      className="text-route-primary hover:underline"
                    >
                      S'inscrire
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
