import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import BrandPanel from './components/BrandPanel';
import LoginForm from './components/LoginForm';
import Welcome from './components/Welcome';
import Footer from './components/Footer';
import { AuthError, clearToken, getMe, loadToken } from './api/auth';
import type { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  // "checking" while we ask the API if a saved token is still good
  const [checking, setChecking] = useState<boolean>(() => loadToken() !== null);

  // Stay logged in on refresh: if a token exists, ask GET /users/me.
  useEffect(() => {
    const token = loadToken();
    if (!token) return;
    let active = true;
    getMe(token)
      .then((me) => {
        if (active) setUser(me); // 200: Welcome screen
      })
      .catch((error: unknown) => {
        if (error instanceof AuthError && error.kind === 'unauthorized') {
          clearToken(); // 401: delete the token, show the login form
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleLogout() {
    clearToken(); // the API is stateless: no API call needed
    setUser(null);
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="login-layout">
          <BrandPanel />
          {checking ? (
            <p className="auth-checking" role="status">
              Checking your session...
            </p>
          ) : user ? (
            <Welcome user={user} onLogout={handleLogout} />
          ) : (
            <LoginForm onLoggedIn={setUser} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
