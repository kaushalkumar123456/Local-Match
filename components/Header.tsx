"use client";

export default function Header() {
    return (
        <header className="header">
            <div className="header-inner">
                <a href="/" className="logo">
                    <span className="logo-mark">L</span>

                    <span>
                        <strong>LocalMatch</strong>
                        <small>Smart local decisions</small>
                    </span>
                </a>

                <nav>
                    <a href="/">Search</a>
                    <a href="/compare">Compare</a>
                </nav>
            </div>
        </header>
    );
}