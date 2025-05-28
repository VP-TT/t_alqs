// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Hero from './components/Hero';
// import About from './components/About';
// import Services from './components/Services';
// import Contact from './components/Contact';
// import Footer from './components/Footer';
// import Summarization from './components/Summarization';
// import QuestionAnswering from './components/QuestionAnswering';
// import Auth from './components/Auth';

// function App() {
//   return (
//     <div className="min-h-screen">
//       <Navbar />
//       <Routes>
//         <Route path="/" element={
//           <>
//             <Hero />
//             <About />
//             <Services />
//             <Contact />
//           </>
//         } />
//         <Route path="/auth" element={<Auth />} />
//         <Route path="/summarization" element={<Summarization />} />
//         <Route path="/qa" element={<QuestionAnswering />} />
//       </Routes>
//       <Footer />
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Summarization from './components/Summarization';
import QuestionAnswering from './components/QuestionAnswering';
import Auth from './components/Auth';

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Always keep anchor-linked sections on the page */}
      {isHome && (
        <>
          <section id="home" className="pt-16">
            <Hero />
          </section>
          <section id="about" className="pt-15">
            <About />
          </section>
          <section id="services" className="pt-20">
            <Services />
          </section>
          <section id="contact" className="pt-20">
            <Contact />
          </section>
        </>
      )}

      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/summarization" element={<Summarization />} />
        <Route path="/qa" element={<QuestionAnswering />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
