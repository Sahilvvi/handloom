import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Check your email for confirmation link!');
            }
            navigate('/account');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: 'white', border: '1px solid #eee' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>{isLogin ? 'Login' : 'Signup'}</h2>

                {error && <div style={{ color: 'red', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>EMAIL ADDRESS</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ddd' }}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                        {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
