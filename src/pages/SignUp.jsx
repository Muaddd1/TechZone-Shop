import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
];

function RuleRow({ rule, passed }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${passed ? 'bg-black' : 'bg-gray-300'}`}>
        {passed ? '✓' : ''}
      </div>
      <span className={passed ? 'text-black font-medium' : 'text-gray-400'}>{rule.label}</span>
    </li>
  );
}

function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordOk = RULES.every((r) => r.test(form.password));
  const formValid = form.name.trim() && form.email.includes('@') && passwordOk;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Sign up:', form);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome, {form.name.split(' ')[0]}!</h1>
          <p className="text-gray-500">Your account has been created. Check your email to verify it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-500">Join TechZone and start shopping smarter.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="Muad"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="Create a strong password"
              required
            />
            {form.password.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {RULES.map((rule) => (
                  <RuleRow key={rule.id} rule={rule} passed={rule.test(form.password)} />
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={!formValid || loading}
            className={`mt-2 flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold transition-all ${
              formValid && !loading
                ? 'bg-black text-white shadow-xl shadow-black/20 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <NavLink to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
