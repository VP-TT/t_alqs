// // import React, { useState, useEffect } from 'react';
// // import { Menu, X } from 'lucide-react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { supabase } from '../lib/supabase';
// // import toast from 'react-hot-toast';

// // const Navbar = () => {
// //   const navigate = useNavigate();
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isScrolled, setIsScrolled] = useState(false);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setIsScrolled(window.scrollY > 0);
// //     };
// //     window.addEventListener('scroll', handleScroll);

// //     // Check auth state
// //     supabase.auth.getSession().then(({ data: { session } }) => {
// //       setUser(session?.user || null);
// //     });

// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       setUser(session?.user || null);
// //     });

// //     return () => {
// //       window.removeEventListener('scroll', handleScroll);
// //       subscription.unsubscribe();
// //     };
// //   }, []);

// //   const handleLogout = async () => {
// //     try {
// //       const { error } = await supabase.auth.signOut();
// //       if (error) throw error;
// //       toast.success('Successfully logged out');
// //       navigate('/');
// //     } catch (error) {
// //       toast.error('Error logging out');
// //     }
// //   };

// //   return (
// //     <nav className="fixed w-full z-50 bg-white shadow-md">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between h-16 items-center">
// //           <div className="flex-shrink-0">
// //             <Link to="/" className="text-2xl font-bold text-black">
// //               TALQS
// //             </Link>
// //           </div>
          
// //           <div className="hidden md:block">
// //             <div className="ml-10 flex items-center space-x-8">
// //               <Link
// //                 to="/"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Home
// //               </Link>
// //               <a
// //                 href="#about"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 About
// //               </a>
// //               <a
// //                 href="#services"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Services
// //               </a>
// //               <a
// //                 href="#contact"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Contact
// //               </a>
// //               {user ? (
// //                 <button
// //                   onClick={handleLogout}
// //                   className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //                 >
// //                   Logout
// //                 </button>
// //               ) : (
// //                 <Link
// //                   to="/auth"
// //                   className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //                 >
// //                   Sign In
// //                 </Link>
// //               )}
// //             </div>
// //           </div>

// //           <div className="md:hidden">
// //             <button
// //               onClick={() => setIsOpen(!isOpen)}
// //               className="text-gray-900 hover:text-green-600 focus:outline-none"
// //             >
// //               {isOpen ? <X size={24} /> : <Menu size={24} />}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile menu */}
// //       {isOpen && (
// //         <div className="md:hidden bg-white">
// //           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
// //             <Link
// //               to="/"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               Home
// //             </Link>
// //             <a
// //               href="#about"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               About
// //             </a>
// //             <a
// //               href="#services"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               Services
// //             </a>
// //             <a
// //               href="#contact"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               Contact
// //             </a>
// //             {user ? (
// //               <button
// //                 onClick={() => {
// //                   handleLogout();
// //                   setIsOpen(false);
// //                 }}
// //                 className="block w-full text-left px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Logout
// //               </button>
// //             ) : (
// //               <Link
// //                 to="/auth"
// //                 className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //                 onClick={() => setIsOpen(false)}
// //               >
// //                 Sign In
// //               </Link>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // };

// // export default Navbar;


// // import React, { useState, useEffect } from 'react';
// // import { Menu, X } from 'lucide-react';
// // import { supabase } from '../lib/supabase';
// // import toast from 'react-hot-toast';

// // const Navbar = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isScrolled, setIsScrolled] = useState(false);
// //   const [user, setUser] = useState(null);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setIsScrolled(window.scrollY > 0);
// //     };
// //     window.addEventListener('scroll', handleScroll);

// //     supabase.auth.getSession().then(({ data: { session } }) => {
// //       setUser(session?.user || null);
// //     });

// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       setUser(session?.user || null);
// //     });

// //     return () => {
// //       window.removeEventListener('scroll', handleScroll);
// //       subscription.unsubscribe();
// //     };
// //   }, []);

// //   const handleLogout = async () => {
// //     try {
// //       const { error } = await supabase.auth.signOut();
// //       if (error) throw error;
// //       toast.success('Successfully logged out');
// //       window.location.href = '#home'; // navigate to top
// //     } catch (error) {
// //       toast.error('Error logging out');
// //     }
// //   };

// //   return (
// //     <nav className="fixed w-full z-50 bg-white shadow-md h-16">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between h-16 items-center">
// //           <div className="flex-shrink-0">
// //             <a href="#home" className="text-2xl font-bold text-black">
// //               TALQS
// //             </a>
// //           </div>

// //           <div className="hidden md:block">
// //             <div className="ml-10 flex items-center space-x-8">
// //               <a
// //                 href="#home"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Home
// //               </a>
// //               <a
// //                 href="#about"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 About
// //               </a>
// //               <a
// //                 href="#services"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Services
// //               </a>
// //               <a
// //                 href="#contact"
// //                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Contact
// //               </a>
// //               {user ? (
// //                 <button
// //                   onClick={handleLogout}
// //                   className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //                 >
// //                   Logout
// //                 </button>
// //               ) : (
// //                 <a
// //                   href="/auth"
// //                   className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //                 >
// //                   Sign In
// //                 </a>
// //               )}
// //             </div>
// //           </div>

// //           <div className="md:hidden">
// //             <button
// //               onClick={() => setIsOpen(!isOpen)}
// //               className="text-gray-900 hover:text-green-600 focus:outline-none"
// //             >
// //               {isOpen ? <X size={24} /> : <Menu size={24} />}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile menu */}
// //       {isOpen && (
// //         <div className="md:hidden bg-white">
// //           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
// //             <a
// //               href="#home"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               Home
// //             </a>
// //             <a
// //               href="#about"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               About
// //             </a>
// //             <a
// //               href="#services"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               Services
// //             </a>
// //             <a
// //               href="#contact"
// //               className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               onClick={() => setIsOpen(false)}
// //             >
// //               Contact
// //             </a>
// //             {user ? (
// //               <button
// //                 onClick={() => {
// //                   handleLogout();
// //                   setIsOpen(false);
// //                 }}
// //                 className="block w-full text-left px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //               >
// //                 Logout
// //               </button>
// //             ) : (
// //               <a
// //                 href="/auth"
// //                 className="block px-3 py-2 text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
// //                 onClick={() => setIsOpen(false)}
// //               >
// //                 Sign In
// //               </a>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </nav>
// //   );
// // };

// // export default Navbar;


// import React, { useState, useEffect } from 'react';
// import { Menu, X } from 'lucide-react';
// import { supabase } from '../lib/supabase';
// import toast from 'react-hot-toast';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       // Optional: can add scroll styling logic
//     };
//     window.addEventListener('scroll', handleScroll);

//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user || null);
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       subscription.unsubscribe();
//     };
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       toast.success('Successfully logged out');
//       window.location.href = '#home';
//     } catch (error) {
//       toast.error('Error logging out');
//     }
//   };

//   return (
//     <nav className="fixed w-full z-50 bg-white shadow-md h-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           <a href="#home" className="text-2xl font-bold text-black">
//             TALQS
//           </a>

//           <div className="hidden md:flex items-center space-x-8">
//             {['hero', 'about', 'services', 'contact'].map((section) => (
//               <a
//                 key={section}
//                 href={`#${section}`}
//                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
//               >
//                 {section.charAt(0).toUpperCase() + section.slice(1)}
//               </a>
//             ))}
//             {user ? (
//               <button
//                 onClick={handleLogout}
//                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
//               >
//                 Logout
//               </button>
//             ) : (
//               <a
//                 href="/auth"
//                 className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
//               >
//                 Sign In
//               </a>
//             )}
//           </div>

//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-900 hover:text-green-600 focus:outline-none"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="md:hidden bg-white shadow-md">
//           <div className="px-4 pt-4 pb-4 space-y-2">
//             {['home', 'about', 'services', 'contact'].map((section) => (
//               <a
//                 key={section}
//                 href={`#${section}`}
//                 onClick={() => setIsOpen(false)}
//                 className="block text-gray-900 hover:text-green-600 transition font-medium"
//               >
//                 {section.charAt(0).toUpperCase() + section.slice(1)}
//               </a>
//             ))}
//             {user ? (
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setIsOpen(false);
//                 }}
//                 className="block w-full text-left text-gray-900 hover:text-green-600 font-medium"
//               >
//                 Logout
//               </button>
//             ) : (
//               <a
//                 href="/auth"
//                 onClick={() => setIsOpen(false)}
//                 className="block text-gray-900 hover:text-green-600 font-medium"
//               >
//                 Sign In
//               </a>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      // Optional: can add scroll styling logic
    };
    window.addEventListener('scroll', handleScroll);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully logged out');
      window.location.href = '#hero';
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <a href="#hero" className="text-2xl font-bold text-black">
            TALQS
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'contact', label: 'Contact' }
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                {label}
              </a>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                Logout
              </button>
            ) : (
              <a
                href="/auth"
                className="text-gray-900 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                Sign In
              </a>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'contact', label: 'Contact' }
            ].map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setIsOpen(false)}
                className="block text-gray-900 hover:text-green-600 transition font-medium"
              >
                {label}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-900 hover:text-green-600 font-medium"
              >
                Logout
              </button>
            ) : (
              <a
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="block text-gray-900 hover:text-green-600 font-medium"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

