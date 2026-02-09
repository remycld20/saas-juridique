import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Scale } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl mb-2 text-white">Assistant Juridique IA</h1>
          <p className="text-muted-foreground">
            Soutien juridique professionnel pour les situations du quotidien
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl mb-6 text-center text-white">
            Connectez-vous à votre compte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 text-white"
              >
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="vous@exemple.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-white"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors duration-200 mt-6"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte ?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Message */}
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-sm mx-auto">
          Vos informations sont protégées par un chiffrement de niveau bancaire. Nous ne partageons jamais vos données personnelles.
        </p>
      </div>
    </div>
  );
}