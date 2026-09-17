import { useEffect, useMemo, useRef, useState } from 'react';
import { getAssistantEmbedConfig } from '../config/assistantEmbedConfig.js';
import {
  ASSISTANT_MESSAGE_TYPES,
  handleAssistantBridgeEvent,
  postStorefrontBridgeMessage
} from '../services/assistantBridge.js';
import { useCart } from '../context/CartContext.jsx';

export default function AssistantView() {
  const iframeRef = useRef(null);
  const readyRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState('idle');
  const config = useMemo(() => getAssistantEmbedConfig(), []);
  const { applyBridgeCartRequest, getCartItemCount } = useCart();

  useEffect(() => {
    if (!config.valid) return undefined;
    let active = true;

    function postMessageToAssistant({ type, requestId, payload }) {
      return postStorefrontBridgeMessage({
        targetWindow: iframeRef.current?.contentWindow,
        targetOrigin: config.allowedOrigin,
        type,
        requestId,
        payload
      });
    }

    async function handleMessage(event) {
      const result = await handleAssistantBridgeEvent({
        event,
        allowedOrigin: config.allowedOrigin,
        iframeWindow: iframeRef.current?.contentWindow,
        addManyToCart: applyBridgeCartRequest,
        getCartItemCount,
        postMessageToAssistant
      });

      if (!active || !result.handled) return;

      if (event.data?.type === ASSISTANT_MESSAGE_TYPES.READY) {
        if (result.deliveryStatus === 'delivered') {
          readyRef.current = true;
          setBridgeStatus('connected');
        }
        return;
      }

      if (!readyRef.current) return;
      if (result.reason === 'REQUEST_ID_CONFLICT') setBridgeStatus('conflict');
      else if (result.mutatedCart && result.deliveryStatus === 'failed') setBridgeStatus('delivery_failed');
      else if (result.mutatedCart) setBridgeStatus('added');
      else setBridgeStatus('connected');
    }

    window.addEventListener('message', handleMessage);
    return () => {
      active = false;
      window.removeEventListener('message', handleMessage);
    };
  }, [applyBridgeCartRequest, config, getCartItemCount]);

  const statusText = bridgeStatus === 'connecting'
    ? 'Connecting securely to the Assistant…'
    : bridgeStatus === 'added'
      ? 'Items added to your cart.'
      : bridgeStatus === 'delivery_failed'
        ? 'Your cart was updated, but the Assistant did not receive confirmation. You can safely try again.'
        : bridgeStatus === 'conflict'
          ? 'We couldn’t retry that action because the request no longer matches the original. Please try again from the Assistant.'
          : null;

  if (!config.valid) {
    return (
      <div className="assistant-view assistant-view--fallback" role="status">
        The AI Shopping Assistant is unavailable right now. Please try again later.
      </div>
    );
  }

  return (
    <div className="assistant-view" aria-label="AI Shopping Assistant">
      {!isLoaded ? <div className="assistant-view__loading">Loading Assistant…</div> : null}
      <iframe
        ref={iframeRef}
        className="assistant-view__frame"
        title="AI Shopping Assistant"
        src={config.embedUrl}
        onLoad={() => {
          readyRef.current = false;
          setIsLoaded(true);
          setBridgeStatus('connecting');
        }}
        allow="microphone"
        sandbox="allow-forms allow-scripts allow-same-origin"
      />
      {statusText ? (
        <div className="assistant-view__status" data-status={bridgeStatus} role="status">
          {statusText}
        </div>
      ) : null}
    </div>
  );
}
