// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
// import { z } from 'zod';
// import toast from 'react-hot-toast';
// import { supabase } from '../lib/supabase';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// const signupSchema = loginSchema.extend({
//   username: z.string().min(3, 'Username must be at least 3 characters'),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// const Auth = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isLogin) {
//         // Login validation
//         loginSchema.parse(formData);
        
//         const { error } = await supabase.auth.signInWithPassword({
//           email: formData.email,
//           password: formData.password,
//         });

//         if (error) throw error;
        
//         toast.success('Successfully logged in!');
//         navigate('/');
//       } else {
//         // Signup validation
//         signupSchema.parse(formData);
        
//         const { error } = await supabase.auth.signUp({
//           email: formData.email,
//           password: formData.password,
//           options: {
//             data: {
//               username: formData.username,
//             },
//           },
//         });

//         if (error) throw error;
        
//         toast.success('Registration successful! Please check your email to verify your account.');
//         setIsLogin(true);
//       }
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         error.errors.forEach((err) => {
//           toast.error(err.message);
//         });
//       } else if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error('An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             {isLogin ? 'Sign in to your account' : 'Create your account'}
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm space-y-4">
//             {!isLogin && (
//               <div>
//                 <label htmlFor="username" className="sr-only">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     required={!isLogin}
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                     placeholder="Username"
//                   />
//                 </div>
//               </div>
//             )}
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                   placeholder="Email address"
//                 />
//               </div>
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                   placeholder="Password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             {!isLogin && (
//               <div>
//                 <label htmlFor="confirmPassword" className="sr-only">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showPassword ? 'text' : 'password'}
//                     required={!isLogin}
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="appearance-none rounded-md relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                     placeholder="Confirm Password"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {isLogin && (
//             <div className="flex items-center justify-end">
//               <div className="text-sm">
//                 <a
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toast.error('Password reset functionality coming soon!');
//                   }}
//                   className="font-medium text-green-600 hover:text-green-500"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>
//           )}

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
//                 loading ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
//             </button>
//           </div>
//         </form>

//         <div className="text-center mt-4">
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="font-medium text-green-600 hover:text-green-500"
//           >
//             {isLogin
//               ? "Don't have an account? Sign up"
//               : 'Already have an account? Sign in'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;


// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // const Auth: React.FC = () => {
// //   const [isSignup, setIsSignup] = useState(true);
// //   const [username, setUsername] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [message, setMessage] = useState('');
// //   const navigate = useNavigate();

// //   const handleToggle = () => {
// //     setIsSignup(!isSignup);
// //     setMessage('');
// //     setUsername('');
// //     setEmail('');
// //     setPassword('');
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const endpoint = isSignup ? 'signup' : 'login';
// //     const url = `http://localhost:5000/api/auth/${endpoint}`;

// //     const payload = isSignup
// //       ? { username, email, password }
// //       : { email, password };

// //     try {
// //       const res = await fetch(url, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload),
// //       });

// //       const data = await res.json();
// //       setMessage(data.message);

// //       if (res.ok) {
// //         if (!isSignup) {
// //           // Save token if needed
// //           // localStorage.setItem('token', data.token);
// //           navigate('/'); // Redirect to homepage
// //         } else {
// //           // Clear inputs on successful signup
// //           setUsername('');
// //           setEmail('');
// //           setPassword('');
// //         }
// //       }
// //     } catch (err) {
// //       setMessage('Something went wrong. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="auth-container">
// //       <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
// //       <form onSubmit={handleSubmit}>
// //         {isSignup && (
// //           <input
// //             type="text"
// //             placeholder="Username"
// //             value={username}
// //             required
// //             onChange={(e) => setUsername(e.target.value)}
// //           />
// //         )}
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           required
// //           onChange={(e) => setEmail(e.target.value)}
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           required
// //           onChange={(e) => setPassword(e.target.value)}
// //         />
// //         <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
// //       </form>
// //       <p className="toggle-text" onClick={handleToggle}>
// //         {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
// //       </p>
// //       {message && <p className="auth-message">{message}</p>}
// //     </div>
// //   );
// // };

// // export default Auth;

// //latest diii
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
// import { z } from 'zod';
// import toast from 'react-hot-toast';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// const signupSchema = loginSchema.extend({
//   username: z.string().min(3, 'Username must be at least 3 characters'),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// const Auth = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isLogin) {
//         loginSchema.parse(formData);

//         const res = await fetch('http://localhost:5000/api/auth/login', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             email: formData.email,
//             password: formData.password,
//           }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Login failed');

//         toast.success('Login successful!');
//         navigate('/'); // Redirect to homepage
//       } else {
//         signupSchema.parse(formData);

//         const res = await fetch('http://localhost:5000/api/auth/signup', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             username: formData.username,
//             email: formData.email,
//             password: formData.password,
//           }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Signup failed');

//         toast.success('Signup successful! Please log in.');
//         setIsLogin(true);
//       }
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         error.errors.forEach((err) => toast.error(err.message));
//       } else if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error('Something went wrong');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">
//           {isLogin ? 'Sign in to your account' : 'Create your account'}
//         </h2>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             {!isLogin && (
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="username"
//                   name="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full pl-10 py-2 border rounded-md"
//                   placeholder="Username"
//                   required
//                 />
//               </div>
//             )}
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full pl-10 py-2 border rounded-md"
//                 placeholder="Email address"
//                 required
//               />
//             </div>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-10 py-2 border rounded-md"
//                 placeholder="Password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5 text-gray-400" />
//                 ) : (
//                   <Eye className="h-5 w-5 text-gray-400" />
//                 )}
//               </button>
//             </div>
//             {!isLogin && (
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full pl-10 py-2 border rounded-md"
//                   placeholder="Confirm Password"
//                   required
//                 />
//               </div>
//             )}
//           </div>
//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-2 px-4 text-white rounded-md ${
//                 loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
//             </button>
//           </div>
//         </form>
//         <div className="text-center mt-4">
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-green-600 hover:underline"
//           >
//             {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        loginSchema.parse(formData);

        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        toast.success('Login successful!');
        navigate('/');
      } else {
        signupSchema.parse(formData);

        const res = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');

        toast.success('Signup successful! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-green-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
