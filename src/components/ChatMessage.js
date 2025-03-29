import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import config from '../config';

const ChatMessage = ({ message }) => {
  const [routing, setRouting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRerouteStatus = (event, { success, error }) => {
      setRouting(false);
      if (!success) {
        setError(error);
      }
    };

    ipcRenderer.on('reroute-status', handleRerouteStatus);

    return () => {
      ipcRenderer.removeListener('reroute-status', handleRerouteStatus);
    };
  }, []);

  const handleReroute = (targetProviderId) => {
    setRouting(true);
    setError(null);
    ipcRenderer.send('reroute-ai-output', {
      sourceMessageId: message.id,
      textContent: message.content,
      targetProviderId,
    });
  };

  if (message.role !== 'assistant') {
    return null;
  }

  const routableProviders = config.noi_ask.filter(
    (providerId) => providerId !== message.providerId
  );

  return (
    <div className="chat-message">
      <div className="message-content">{message.content}</div>
      <div className="microbuttons-container">
        {routableProviders.map((providerId) => (
          <button
            key={providerId}
            onClick={() => handleReroute(providerId)}
            disabled={routing}
          >
            {providerId}
          </button>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ChatMessage;
