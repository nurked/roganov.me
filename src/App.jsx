import "./App.css";
import { About } from "./components/About";
import { Banner } from "./components/Banner";
// import { Client } from "./components/Clients";
import { Contact } from "./components/contact/Contact";
import { Footer } from "./components/Footter";
import { Hero } from "./components/hero/Hero";
import { NavBar } from "./components/navbar/NavBar";
import { Superhero } from "./components/Superhero";
import { SEO } from "./components/SEO";
import { Birthday } from "./components/Birthday";
import { Birthday2026 } from "./components/Birthday2026";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  useEffect(() => {
    ReactGA.initialize("G-3WR8FYRV2N");
    ReactGA.send("pageview");
  }, []);

  return (
    <Router>
      <SEO />
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <ScrollToTop />

              <NavBar />
              <Hero />
              <About />
              <Banner />
              <Superhero />
              <Contact />
              <Footer />
            </div>
          }
        />
        <Route path="/birthday-2025" element={<Birthday />} />
        <Route path="/birthday-2026" element={<Birthday2026 />} />
      </Routes>
    </Router>
  );
}

export default App;
