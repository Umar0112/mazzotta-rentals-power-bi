import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import logo from '../imports/mazzotta-logo.png';
import { authService } from '../services/authService/authService';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('mazzottabi@sixlogs.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.signIn({ email, pin: password });
      navigate('/all-reservations-contracts');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 w-full max-w-md bg-card border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[var(--radius-xl)] rounded-[var(--radius-lg)] p-8 md:p-10 relative overflow-hidden backdrop-blur-xl">
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Mazzotta Equipment Rentals" className="h-14 object-contain animate-in fade-in zoom-in duration-500" />
        </div>

        <div className="text-center mb-8 animate-in slide-in-from-bottom-4 fade-in tracking-tight duration-500 delay-100">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground ml-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="flex h-11 w-full rounded-[var(--radius-md)] border border-input bg-input-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-border/80"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex h-11 w-full rounded-[var(--radius-md)] border border-input bg-input-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-border/80"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2 w-full mt-6 shadow-sm active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-xs font-medium text-muted-foreground/60 z-10 relative animate-in fade-in duration-1000 delay-500">
        &copy; {new Date().getFullYear()} Mazzotta Equipment Rentals. All rights reserved.
      </p>
    </div>
  );
}
