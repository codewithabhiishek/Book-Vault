import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/api/firebaseClient";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Google registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <BookOpen className="w-10 h-10 text-brutal-teal" />
          <h1 className="text-4xl md:text-5xl font-heading tracking-wide">BOOK VAULT</h1>
        </div>
        <div className="brutal-border brutal-shadow-lg bg-white p-8">
          <h2 className="text-3xl font-heading mb-6 tracking-wide">CREATE ACCOUNT</h2>
          {error && <p className="text-destructive font-mono text-sm mb-4 bg-destructive/10 p-3 brutal-border">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label htmlFor="email" className="font-mono uppercase text-muted-foreground text-xs font-bold tracking-wider mb-2 block">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="brutal-border bg-white rounded-none h-12 font-mono text-base focus-visible:ring-brutal-teal focus-visible:ring-2 focus-visible:ring-offset-0" />
            </div>
            <div>
              <Label htmlFor="password" className="font-mono uppercase text-muted-foreground text-xs font-bold tracking-wider mb-2 block">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="brutal-border bg-white rounded-none h-12 font-mono text-base focus-visible:ring-brutal-teal focus-visible:ring-2 focus-visible:ring-offset-0" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="font-mono uppercase text-muted-foreground text-xs font-bold tracking-wider mb-2 block">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="brutal-border bg-white rounded-none h-12 font-mono text-base focus-visible:ring-brutal-teal focus-visible:ring-2 focus-visible:ring-offset-0" />
            </div>
            <Button type="submit" className="w-full brutal-btn bg-brutal-teal text-black hover:bg-brutal-teal/90 font-display tracking-widest text-xl h-14 rounded-none mt-2" disabled={isLoading}>
              {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
            </Button>
          </form>
          <div className="mt-5">
            <Button variant="outline" className="w-full brutal-btn bg-brutal-yellow text-black hover:bg-brutal-yellow/90 font-display tracking-widest text-lg h-14 rounded-none border-none" onClick={handleGoogleLogin} disabled={isLoading}>
              <GoogleIcon className="w-5 h-5 mr-3" /> CONTINUE WITH GOOGLE
            </Button>
          </div>
          <p className="font-mono text-sm text-center mt-8 text-muted-foreground uppercase">
            Already have an account? <Link to="/login" className="font-bold text-foreground hover:text-brutal-teal hover:underline transition-colors ml-2">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
