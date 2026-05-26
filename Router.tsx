import { AuthProvider } from './contexts/AuthContext';
import { Router, Route } from './components/Router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Orphanages } from './pages/Orphanages';
import { Donate } from './pages/Donate';
import { Contact } from './pages/Contact';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { RegisterOrphanage } from './pages/RegisterOrphanage';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Route path="/">
              <Home />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/orphanages">
              <Orphanages />
            </Route>
            <Route path="/donate">
              <Donate />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/register-orphanage">
              <RegisterOrphanage />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
