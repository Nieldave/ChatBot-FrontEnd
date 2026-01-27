import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Loader2, AlertCircle, Info, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, resetPassword, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setSuccess('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          setIsForgotPassword(false);
          setIsLogin(true);
          setSuccess('');
        }, 3000);
      } else if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await register(email, password, displayName);
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (mode: 'login' | 'register' | 'forgot') => {
    setError('');
    setSuccess('');
    setShowPassword(false);
    
    if (mode === 'forgot') {
      setIsForgotPassword(true);
      setIsLogin(false);
    } else if (mode === 'login') {
      setIsForgotPassword(false);
      setIsLogin(true);
    } else {
      setIsForgotPassword(false);
      setIsLogin(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">ChatBot Platform</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md animate-slide-up border-border/50 shadow-card gradient-card">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isForgotPassword
                ? 'Enter your email to receive a password reset link'
                : isLogin
                ? 'Sign in to manage your chatbots'
                : 'Get started with your AI chatbot platform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConfigured && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-accent p-4 text-sm text-accent-foreground animate-fade-in">
                <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Firebase Configuration Required</p>
                  <p className="text-muted-foreground mt-1">
                    To use authentication, add your Firebase credentials as environment variables:
                  </p>
                  <code className="block mt-2 text-xs bg-muted p-2 rounded">
                    VITE_FIREBASE_API_KEY<br/>
                    VITE_FIREBASE_AUTH_DOMAIN<br/>
                    VITE_FIREBASE_PROJECT_ID
                  </code>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 animate-fade-in">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {!isLogin && !isForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-foreground">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required={!isLogin && !isForgotPassword}
                    className="h-11 bg-background/50 border-input focus:border-primary transition-colors"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-background/50 border-input focus:border-primary transition-colors"
                />
              </div>

              {!isForgotPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => handleModeSwitch('forgot')}
                        className="text-xs text-primary hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 bg-background/50 border-input focus:border-primary transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 gradient-button text-primary-foreground font-medium shadow-soft hover:shadow-glow transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isForgotPassword
                      ? 'Sending reset link...'
                      : isLogin
                      ? 'Signing in...'
                      : 'Creating account...'}
                  </>
                ) : (
                  isForgotPassword
                    ? 'Send Reset Link'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {isForgotPassword ? (
                  <>
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('login')}
                      className="font-medium text-primary hover:underline transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch(isLogin ? 'register' : 'login')}
                      className="font-medium text-primary hover:underline transition-colors"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;