
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Validation de base
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Dans une implémentation réelle, cette fonction enverrait les données à un backend
      // qui effectuerait le hachage du mot de passe avec bcrypt et l'enregistrement dans MySQL
      // Pour l'instant, nous simulons avec localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Vérifier si l'email existe déjà
      if (existingUsers.some((user: any) => user.email === email)) {
        setError("Cet email est déjà utilisé.");
        setIsLoading(false);
        return;
      }
      
      // Simuler l'enregistrement utilisateur
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password: `hashed_${password}`, // Dans une vraie implémentation, on utiliserait bcrypt ici
        vehicles: [],
        plan: "gratuit", // Plan par défaut (gratuit)
        isActive: true   // Statut du compte (actif par défaut)
      };
      
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      
      toast.success("Inscription réussie, vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription.");
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
            <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </Button>
                
                <div className="text-center text-sm">
                  <p className="text-gray-600">
                    Vous avez déjà un compte ?{" "}
                    <a
                      href="/route-en-direct/login"
                      className="text-route-primary hover:underline"
                    >
                      Se connecter
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

export default RegisterPage;
