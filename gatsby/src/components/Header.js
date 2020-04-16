import { Link } from 'gatsby';
import React from 'react';

export const Header = () => {
  return (
    <header className="site-header" style={{ height: '56px' }}>
      <nav className="navbar navbar-expand-lg navbar-dark" data-navbar="sticky">
        <div className="pl5 pb3 row">
          <div className="col-8 col-lg-2 navbar-left" style={{ paddingLeft: 0 }}>
            <button className="navbar-toggler" type="button">☰</button>
            
            <a className="navbar-brand" href="/">
              <span style={{ fontSize: '20px', color: 'black' }}>NI4AI Blog</span>
            </a>
          </div>
          <section className="col-lg-8 navbar-mobile">
            <nav className="nav nav-navbar mx-auto">
              <Link className="nav-link" to="/about">
                About
              </Link>
              
              <Link className="nav-link" to="/articles">
                Articles
              </Link>

              <a className="nav-link" href="https://ni4ai.org">
                Project Home
              </a>
            </nav>
          </section>
        </div>
      </nav>
    </header>
  )
}
