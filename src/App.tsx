import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, BottomNavigation, BottomNavigationAction, Paper, Box } from '@mui/material';
import { theme } from './theme';
import { SetupScreen } from './components/SetupScreen';
import { ActiveSessionScreen } from './components/ActiveSessionScreen';
import { HistoryView } from './components/HistoryView';
import { useSessionStore } from './store/sessionStore';
import { Loader2, Mic, History } from 'lucide-react';

function App() {
  const status = useSessionStore((state) => state.status);
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-4 animate-in fade-in duration-700">
            <h1 className="text-4xl font-bold text-emerald-500 tracking-tight">Matuku</h1>
            <p className="text-slate-400 text-lg">Australasian Bittern Field Logger</p>
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mt-8" />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'background.default' }}>
        {status === 'SETUP' ? (
          <SetupScreen />
        ) : (
          <>
            {tab === 0 && <ActiveSessionScreen />}
            {tab === 1 && <HistoryView />}

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
              <BottomNavigation
                showLabels
                value={tab}
                onChange={(_, newValue) => setTab(newValue)}
                sx={{ bgcolor: 'background.paper', borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                <BottomNavigationAction label="Log" icon={<Mic />} />
                <BottomNavigationAction label="History" icon={<History />} />
              </BottomNavigation>
            </Paper>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
