import React from 'react';
import './Login.scss'

const Login = () => {
    return (
        <div id="login">
            <div className="auth-overlay" id="auth-overlay">
                <div className="auth-modal" id="auth-modal">
                    <button className="modal-close auth-close" id="auth-close-btn" aria-label="Close auth modal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="auth-tab" id="login-tab">
                        <h2 data-i18n="auth.welcomeBack">Welcome Back</h2>
                        <p className="auth-subtitle" data-i18n="auth.signInSubtitle">Sign in to your KhoBau Digital account</p>
                        <form id="login-form" className="auth-form" autoComplete={"off"}>
                            <div className="form-group">
                                <label htmlFor="login-email" data-i18n="auth.email">Email</label>
                                <input type="email" id="login-email" placeholder="your@email.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password" data-i18n="auth.password">Password</label>
                                <input type="password" id="login-password" placeholder="Your password" required minLength={6} />
                            </div>
                            <p className="auth-error" id="login-error"></p>
                            <button type="submit" className="btn-primary auth-submit" data-i18n="auth.signIn">Sign In</button>
                        </form>
                        <p className="auth-switch"><span data-i18n="auth.noAccount">Don't have an account?</span> <a href="#" id="show-register" data-i18n="auth.createOne">Create one</a></p>
                    </div>
                    <div className="auth-tab" id="register-tab" style={{display: "none"}}>
                        <h2 data-i18n="auth.createAccount">Create Account</h2>
                        <p className="auth-subtitle" data-i18n="auth.registerSubtitle">Join KhoBau Digital for premium subscriptions</p>
                        <form id="register-form" className="auth-form" autoComplete={"off"}>
                            <div className="form-group">
                                <label htmlFor="register-email" data-i18n="auth.email">Email</label>
                                <input type="email" id="register-email" placeholder="your@email.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="register-password" data-i18n="auth.password">Password</label>
                                <input type="password" id="register-password" placeholder="Min 6 characters" required minLength={6} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="register-confirm" data-i18n="auth.confirmPassword">Confirm Password</label>
                                <input type="password" id="register-confirm" placeholder="Repeat password" required minLength={6} />
                            </div>
                            <p className="auth-error" id="register-error"></p>
                            <button type="submit" className="btn-primary auth-submit" data-i18n="auth.createAccount">Create Account</button>
                        </form>
                        <p className="auth-switch"><span data-i18n="auth.hasAccount">Already have an account?</span> <a href="#" id="show-login" data-i18n="auth.signInLink">Sign in</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;