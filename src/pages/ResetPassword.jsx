import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { auth } from "@/api/firebaseClient";
import { confirmPasswordReset } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!oobCode) {
      setError("Invalid or missing reset code.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setError("");
    setMessage("");
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password has been reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
          <h2 className="text-3xl font-heading mb-6 tracking-wide">NEW PASSWORD</h2>
          {error && <p className="text-destructive font-mono text-sm mb-4 bg-destructive/10 p-3 brutal-border">{error}</p>}
          {message && <p className="text-green-600 font-mono text-sm mb-4 bg-green-100 p-3 brutal-border">{message}</p>}
          
          {!oobCode && !error && !message && (
             <p className="text-destructive font-mono text-sm mb-4 bg-destructive/10 p-3 brutal-border">Invalid password reset link. Please request a new one.</p>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <Label htmlFor="password" className="font-mono uppercase text-muted-foreground text-xs font-bold tracking-wider mb-2 block">New Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={!oobCode} className="brutal-border bg-white rounded-none h-12 font-mono text-base focus-visible:ring-brutal-teal focus-visible:ring-2 focus-visible:ring-offset-0" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="font-mono uppercase text-muted-foreground text-xs font-bold tracking-wider mb-2 block">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={!oobCode} className="brutal-border bg-white rounded-none h-12 font-mono text-base focus-visible:ring-brutal-teal focus-visible:ring-2 focus-visible:ring-offset-0" />
            </div>
            <Button type="submit" className="w-full brutal-btn bg-brutal-teal text-black hover:bg-brutal-teal/90 font-display tracking-widest text-xl h-14 rounded-none mt-2" disabled={isLoading || !oobCode}>
              {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
            </Button>
          </form>
          <p className="font-mono text-sm text-center mt-8 text-muted-foreground uppercase">
            <Link to="/login" className="font-bold text-foreground hover:text-brutal-teal hover:underline transition-colors">Return to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
