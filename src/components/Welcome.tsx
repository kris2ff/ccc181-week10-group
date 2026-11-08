import type { User } from '../types';

interface WelcomeProps {
  user: User;
  onLogout: () => void;
}

export default function Welcome({ user, onLogout }: WelcomeProps) {
  return (
    <section className="welcome-card" aria-labelledby="welcome-name">
      <h2 id="welcome-name" className="welcome-card__title">
        Welcome, {user.name}
      </h2>
      <p className="welcome-card__email">{user.email}</p>
      <button type="button" className="btn btn--primary" onClick={onLogout}>
        Log out
      </button>
    </section>
  );
}
