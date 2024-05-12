import React from "react";
import { useSelector } from "react-redux";
import '../styles/Footer.css';

const Footer = () => {
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-10 max-md:px-0">
      <aside>
        <p className="text-2xl max-sm:text-sm text-accent-content">
          Copyright © 2024 - Sania's Shop
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
