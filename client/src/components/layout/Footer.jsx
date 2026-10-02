import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-slate-300 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">Skill Hub<span className="text-blue-500">.</span></h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Master the digital skills of tomorrow with our professional e-learning platform. We bridge the gap between theory and industry application.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon
                icon={<FaFacebook />}
                href="https://www.facebook.com/saminuaminubenzema.asara"
                ariaLabel="Skill Hub Facebook"
              />
              <SocialIcon icon={<FaTwitter />} href="#" ariaLabel="Twitter" />
              <SocialIcon
                icon={<FaLinkedin />}
                href="https://www.linkedin.com/in/saminu-aminu-ba86232ab/"
                ariaLabel="Skill Hub LinkedIn"
              />
              <SocialIcon
                icon={<FaInstagram />}
                href="https://www.instagram.com/_official_sameen/"
                ariaLabel="Skill Hub Instagram"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/courses" text="Browse Courses" />
              <FooterLink to="/resources" text="Resources & Blog" />
              <FooterLink to="/about" text="About Us" />
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/contact" text="Help Center" />
              <FooterLink to="/contact" text="Contact Support" />
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-blue-500" />
                <span>Sokoto State, <br /> Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <span>support@skillhub.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-500" />
                <span>08157955410</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Skill Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href = '#', ariaLabel = '' }) => {
  const handleClick = (event) => {
    if (!href || href === '#') {
      event.preventDefault();
      return;
    }

    // Direct navigation is more reliable for some mobile browsers/webviews.
    event.preventDefault();
    window.location.assign(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 touch-manipulation dark:bg-slate-800"
    >
      {icon}
    </a>
  );
};

const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="hover:text-blue-400 transition-colors duration-200 block">
      {text}
    </Link>
  </li>
);

export default Footer;