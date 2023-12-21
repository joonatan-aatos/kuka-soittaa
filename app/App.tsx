import { StatusBar } from 'expo-status-bar';
import { NativeRouter, Navigate, Route, Routes } from 'react-router-native';
import Call from './components/views/Call';
import Dashboard from './components/views/Dashboard';
import { PaperProvider } from 'react-native-paper';
import { AppContextProvider } from './components/AppContext';
import Answer from './components/views/Answer';

export default function App() {
  return (
    <PaperProvider>
      <AppContextProvider>
        <NativeRouter>
          <Routes>
            <Route path="/" element={<Call />} />
            <Route path="/accepted" element={<Answer accepted={true} />} />
            <Route path="/declined" element={<Answer accepted={false} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          <StatusBar style="auto" />
        </NativeRouter>
      </AppContextProvider>
    </PaperProvider>
  );
}
