import './App.css'
import { About } from './components/About'
import { Banner } from './components/Banner'
import { Client } from './components/Clients'
import { Contact } from './components/contact/Contact'
import { Footer } from './components/Footter'

import { Hero } from './components/hero/Hero'
import { NavBar } from './components/navbar/NavBar'
import {Superhero} from './components/Superhero'




function App() {


  return (
    <>
    <NavBar/>
    <Hero />
    <About />
    <Banner />
    <Superhero/>
    {/* <Client/> */}
    <Contact />
    <Footer/>
  
   
    </>
  )
}

export default App
