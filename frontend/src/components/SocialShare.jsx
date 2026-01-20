import React from 'react';

const SocialShare = ({ url, title }) => {
  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="social-share">
      <h3>Share this equipment</h3>
      <div className="share-buttons">
        <button 
          className="share-btn facebook" 
          onClick={() => handleShare('facebook')}
          title="Share on Facebook"
        >
          <span>📱</span>
        </button>
        <button 
          className="share-btn twitter" 
          onClick={() => handleShare('twitter')}
          title="Share on Twitter"
        >
          <span>🐦</span>
        </button>
        <button 
          className="share-btn linkedin" 
          onClick={() => handleShare('linkedin')}
          title="Share on LinkedIn"
        >
          <span>💼</span>
        </button>
        <button 
          className="share-btn whatsapp" 
          onClick={() => handleShare('whatsapp')}
          title="Share on WhatsApp"
        >
          <span>💬</span>
        </button>
        <button 
          className="share-btn copy" 
          onClick={() => handleShare('copy')}
          title="Copy Link"
        >
          <span>🔗</span>
        </button>
      </div>
    </div>
  );
};

export default SocialShare;