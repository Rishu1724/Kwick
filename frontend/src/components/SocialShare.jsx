import React from 'react';

const SocialShare = ({ url, title }) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${shareTitle}%20${shareUrl}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="social-share">
      <h3>Share this ad:</h3>
      <div className="share-buttons">
        <button className="share-button facebook" onClick={shareOnFacebook}>
          Facebook
        </button>
        <button className="share-button twitter" onClick={shareOnTwitter}>
          Twitter
        </button>
        <button className="share-button whatsapp" onClick={shareOnWhatsApp}>
          WhatsApp
        </button>
        <button className="share-button copy" onClick={copyToClipboard}>
          Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;