import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

import Login from './pages/user_authentication/Login';
import Register from './pages/user_authentication/Register';
import ResetPassword from './pages/user_authentication/ResetPasswordPage';
import VerifiedAccount from './pages/user_authentication/VerifiedAccountPage';

import VenuePosting from './pages/VenuePosting';
import EventPosting from './pages/EventPosting';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* You can add more pages later like this: */}
        {/* <Route path="/about" element={<About />} /> */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account-verified" element={<VerifiedAccount />} />


        <Route path="/post-your-venue" element={<VenuePosting />} />
        <Route path='/host-your-event' element={<EventPosting />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
