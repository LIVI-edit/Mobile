import { useState } from 'react';
import AssistantView from './components/AssistantView.jsx';
import CartView from './components/CartView.jsx';
import { CartProvider } from './context/CartContext.jsx';

const VALID_VIEWS = new Set(['assistant', 'cart']);

function getInitialView() {
  const requestedView = new URLSearchParams(window.location.search).get('view');
  return VALID_VIEWS.has(requestedView) ? requestedView : 'assistant';
}

function RuntimeContent() {
  const [view, setView] = useState(getInitialView);

  return (
    <main className="browser-runtime" data-view={view}>
      <section
        className={`runtime-view runtime-view--assistant${view === 'assistant' ? ' runtime-view--active' : ''}`}
        aria-hidden={view !== 'assistant'}
      >
        <AssistantView />
      </section>

      <section
        className={`runtime-view runtime-view--cart${view === 'cart' ? ' runtime-view--active' : ''}`}
        aria-hidden={view !== 'cart'}
      >
        <CartView />
      </section>

      {import.meta.env.DEV === true ? (
        <div className="task-switch" aria-label="Task 03A development view switch">
          <strong>Task 03A</strong>
          <button
            type="button"
            className={view === 'assistant' ? 'is-active' : ''}
            onClick={() => setView('assistant')}
          >
            Assistant
          </button>
          <button
            type="button"
            className={view === 'cart' ? 'is-active' : ''}
            onClick={() => setView('cart')}
          >
            Cart
          </button>
        </div>
      ) : null}
    </main>
  );
}

export default function BrowserRuntimeApp() {
  return (
    <CartProvider>
      <RuntimeContent />
    </CartProvider>
  );
}
