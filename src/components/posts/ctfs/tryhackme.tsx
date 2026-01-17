// components/tryhackme.tsx
import "./tryhackme.css";

export default function TryHackMe() {
  return (
    <div className="tryhackme-box">
      <div className="tryhackme-iframe-wrapper">
        <iframe
          className="tryhackme-iframe"
          src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=1588317"
          title="TryHackMe Badge for khr1st"
          loading="lazy"
          scrolling="no"
          width="max"
        />
      </div>
      <p className="tryhackme-caption">This badge is live updated</p>
    </div>
);
}
