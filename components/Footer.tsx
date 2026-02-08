// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="social-links footer-social-links">
        <a href="https://www.instagram.com/angelmm__/" target="_blank" rel="noopener noreferrer">
          <img src="Instagram_icon.png" className="social-logo" alt="Instagram" />
        </a>
        <a href="https://orcid.org/my-orcid?orcid=0009-0002-8944-5403" target="_blank" rel="noopener noreferrer">
          <img src="ORCID_iD.svg.png" className="social-logo" alt="ORCID" />
        </a>
        <a href="https://www.researchgate.net/profile/Angel-Martinez-Munoz?ev=hdr_xprf" target="_blank" rel="noopener noreferrer">
          <img src="researcg_gate.png" className="social-logo" alt="ResearchGate" />
        </a>
        <a href="https://scholar.google.com/citations?user=rC-onNMAAAAJ&hl=es" target="_blank" rel="noopener noreferrer">
          <img src="Google_Scholar_logo.svg.png" className="social-logo" alt="Google Scholar" />
        </a>
        <a href="https://arxiv.org/a/martinezmunoz_a_1.html" target="_blank" rel="noopener noreferrer">
          <img src="ArXiv_logo_2022.png" className="social-logo" alt="arXiv" />
        </a>
      </div>
      <p className="email-text footer-email">e-mail: angel.martinezm(at)urv.cat</p>
    </footer>
  );
};

export default Footer;
