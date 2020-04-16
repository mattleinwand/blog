import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row gap-y align-items-center">
          <div className="col-6 col-lg-3">
            <a href="https://www.pingthings.ai"
            ><img src="/assets/img/logo-dark.png" alt="logo"
              /></a>
          </div>

          <div className="col-6 col-lg-3 text-right order-lg-last">
            <div className="social">
              <a className="social-twitter" href="https://twitter.com/pingthingsio"
              ><i className="fa fa-twitter-square"></i
              ></a>
              <a
                className="social-linkedin"
                href="https://www.linkedin.com/company/pingthings/about/"
              ><i className="fa fa-linkedin-square"></i
              ></a>
            </div>
          </div>

          <div className="col-lg-6 text-center">
            <small>© 2019. All rights reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  )
}