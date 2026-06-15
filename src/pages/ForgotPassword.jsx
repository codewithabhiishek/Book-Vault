import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/api/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
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
          <h2 className="text-3xl font-heading mb-6 tracking-wide">RESET PASSWORD</h2>
          {error && <p className="text-destructive font-mono text-sm mb-4 bg-destructive/10 p-3 brutal-border">{error}</p>}
          {message && <p className="text-green-600 font-mono text-sm mb-4 bg-green-100 p-3 brutal-border">{message}</p>}
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <Label htmlFor="email" className="font-mono uppercase text-muted-foreground text-xs font-bold tracking-wider mb-2 block">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="brutal-border bg-white rounded-none h-12 font-mono text-base focus-visible:ring-brutal-teal focus-visible:ring-2 focus-visible:ring-offset-0" />
            </div>
            <Button type="submit" className="w-full brutal-btn bg-brutal-teal text-black hover:bg-brutal-teal/90 font-display tracking-widest text-xl h-14 rounded-none mt-2" disabled={isLoading}>
              {isLoading ? "SENDING..." : "SEND RESET LINK"}
            </Button>
          </form>
          <p className="font-mono text-sm text-center mt-8 text-muted-foreground uppercase">
            Remembered your password? <Link to="/login" className="font-bold text-foreground hover:text-brutal-teal hover:underline transition-colors ml-2">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
