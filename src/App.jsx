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
import ReactGA from "react-ga4";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    ReactGA.initialize("G-3WR8FYRV2N");
    ReactGA.send("pageview");
  }, []);

  return (
    <>
      <SEO />
      <div className="min-h-screen">
        {" "}
        {/* Apply overflow-x-hidden here */}
        <NavBar /> {/* Navigation bar */}
        <Hero /> {/* Hero section */}
        <About /> {/* About section */}
        <Banner /> {/* Banner section */}
        <Superhero /> {/* Superhero section */}
        {/* <Client /> {/* Uncomment to include Clients section */}
        <Contact /> {/* Contact section */}
        <Footer /> {/* Footer section */}
      </div>
    </>
  );
}

export default App;
