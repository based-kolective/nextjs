import React from 'react';

export function linkifyTweetText(text: string): string {
  // URL regex pattern to match http/https URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Stock symbol regex pattern to match $SYMBOL format (supports mixed case, up to 20 chars)
  const stockRegex = /\$([A-Za-z][A-Za-z0-9]{0,19})\b/g;
  
  let processedText = text;
  
  // Replace URLs with clickable links
  processedText = processedText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1d4ed8; text-decoration: underline;">${url}</a>`;
  });
  
  // Replace stock symbols with clickable links to X.com search
  processedText = processedText.replace(stockRegex, (match, symbol) => {
    const searchUrl = `https://x.com/search?q=%24${symbol}&src=cashtag_click`;
    return `<a href="${searchUrl}" target="_blank" rel="noopener noreferrer" style="color: #1d4ed8; text-decoration: underline;">$${symbol}</a>`;
  });
  
  return processedText;
}

// React component version for JSX
export function LinkifiedText({ text }: { text: string }) {
  const processedText = linkifyTweetText(text);
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  );
}
