import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="pt-16 pb-8 text-white transition-colors duration-300 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 shadow-lg rounded-t-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-3xl font-extrabold tracking-tight">Skill Hub <span className="text-yellow-300">•</span></h3>
            <p className="text-sm leading-relaxed text-blue-100/90">
              Master new skills for a better future — great vibes, practical learning, and career-ready courses.
            </p>
            <div className="mt-2">
              <span className="inline-block bg-yellow-300/10 text-yellow-200 text-xs font-semibold px-3 py-1 rounded-full">Great vibes</span>
            </div>
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

const SocialIcon = ({ icon, href = '#', ariaLabel = '' }) => (
  <a
    href={href}
    aria-label={ariaLabel}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-blue-800 text-lg transition-transform duration-300 transform hover:scale-110 shadow-sm"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link to={to} className="hover:text-blue-400 transition-colors duration-200 block">
      {text}
    </Link>
  </li>
);

export default Footer;