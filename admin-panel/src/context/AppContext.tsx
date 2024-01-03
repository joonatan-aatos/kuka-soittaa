import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Caller, Event } from '../util/types';
import {
  checkAdminToken,
  deleteAudio,
  deleteCaller,
  deleteEvent,
  getAudioList,
  getCallerList,
  getEventList,
  postAudio,
  postCaller,
  postEvent,
} from '../util/routes';
import LoginView from '../views/LoginView';
import { toast } from 'react-toastify';
import { setApiToken } from '../util/api';

interface AppContextInterface {
  adminToken?: string;

  callers: Caller[];
  events: Event[];
  audio: string[];

  fetchCallers: () => Promise<Caller[]>;
  createCaller: (caller: FormData) => Promise<Caller>;
  removeCaller: (id: string) => Promise<void>;

  fetchEvents: () => Promise<Event[]>;
  createEvent: (event: object) => Promise<Event>;
  removeEvent: (id: string) => Promise<void>;

  fetchAudio: () => Promise<string[]>;
  createAudio: (audio: FormData) => Promise<string>;
  removeAudio: (id: string) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultFunction = (): any =>
  console.warn('AppContext function not implemented');

const AppContext = createContext<AppContextInterface>({
  adminToken: undefined,
  callers: [],
  events: [],
  audio: [],
  fetchCallers: defaultFunction,
  createCaller: defaultFunction,
  removeCaller: defaultFunction,
  fetchEvents: defaultFunction,
  createEvent: defaultFunction,
  removeEvent: defaultFunction,
  fetchAudio: defaultFunction,
  createAudio: defaultFunction,
  removeAudio: defaultFunction,
});

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [callers, setCallers] = useState<Caller[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [audio, setAudio] = useState<string[]>([]);
  const [adminToken, setAdminToken] = useState<string | undefined>(undefined);

  const fetchCallers = useCallback(async () => {
    const callers = await getCallerList();
    setCallers(callers);
    return callers;
  }, []);
  const createCaller = async (caller: FormData) => {
    const newCaller = await postCaller(caller);
    setCallers([...callers, newCaller].sort());
    return newCaller;
  };
  const removeCaller = async (id: string) => {
    await deleteCaller(id);
    setCallers(callers.filter((caller) => caller.id !== id));
  };

  const fetchEvents = useCallback(async () => {
    const events = await getEventList();
    setEvents(events);
    return events;
  }, []);
  const createEvent = async (event: object) => {
    const newEvent = await postEvent(event);
    setEvents(
      [...events, newEvent].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
      ),
    );
    return newEvent;
  };
  const removeEvent = async (id: string) => {
    await deleteEvent(id);
    setEvents(events.filter((event) => event.id !== id));
  };

  const fetchAudio = useCallback(async () => {
    const audio = await getAudioList();
    setAudio(audio);
    return audio;
  }, []);
  const createAudio = async (audioData: FormData) => {
    const newAudio = await postAudio(audioData);
    setAudio([...audio, newAudio].sort());
    return newAudio;
  };
  const removeAudio = async (id: string) => {
    await deleteAudio(id);
    setAudio(audio.filter((audio) => audio !== id));
  };

  const [fetched, setFetched] = useState<boolean>(false);
  useEffect(() => {
    if (!fetched && adminToken) {
      fetchCallers();
      fetchEvents();
      fetchAudio();
      setFetched(true);
    }
  }, [fetchCallers, fetchEvents, fetchAudio, fetched, adminToken]);

  if (!adminToken) {
    return (
      <LoginView
        tryLogin={async (token: string) => {
          if (await checkAdminToken(token)) {
            setAdminToken(token);
            setApiToken(token);
          } else {
            toast.error('Invalid login');
          }
        }}
      />
    );
  }

  return (
    <AppContext.Provider
      value={{
        adminToken,
        callers,
        events,
        audio,
        fetchCallers,
        createCaller,
        removeCaller,
        fetchEvents,
        createEvent,
        removeEvent,
        fetchAudio,
        createAudio,
        removeAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};

export { useAppContext, AppContextProvider };
