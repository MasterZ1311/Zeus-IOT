import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Pay from './pages/Pay';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Report from './pages/Report';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Support from './pages/Support';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="pay" element={<Pay />} />
          <Route path="report" element={<Report />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
