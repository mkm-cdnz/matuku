import { useEffect, useState } from 'react';
import { useSessionStore } from './store/sessionStore';
import { SetupScreen } from './components/SetupScreen';
import { ActiveSessionScreen } from './components/ActiveSessionScreen';
import { HistoryView } from './components/HistoryView';

function App() {
  const status = useSessionStore((state) => state.status);
  const resetSession = useSessionStore((state) => state.resetSession);
  const [tab, setTab] = useState<'log' | 'history'>('log');

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (status === 'FINISHED') {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center space-y-6">
        <h1 className="text-3xl font-bold text-emerald-400">Session Complete</h1>
        <p className="text-slate-300">Data has been exported.</p>
        <button
          onClick={resetSession}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          Start New Session
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Tab navigation */}
      <nav className="flex justify-center space-x-4 bg-slate-800 p-2">
        <button
          onClick={() => setTab('log')}
          className={`px-4 py-2 rounded ${tab === 'log' ? 'bg-emerald-600' : 'bg-slate-600'} transition`}
        >
          Log
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 rounded ${tab === 'history' ? 'bg-emerald-600' : 'bg-slate-600'} transition`}
        >
          History
        </button>
      </nav>

      {status === 'SETUP' && <SetupScreen />}
      {status === 'ACTIVE' && (
        <>
          {tab === 'log' && <ActiveSessionScreen />}
          {tab === 'history' && <HistoryView />}
        </>
      )}
    </div>
  );
}

export default App;
