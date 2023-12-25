import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { createUser, useUser } from '../api/users';
import NameModal from './modals/NameModal';
import { useEvents } from '../api/events';
import Spinner from './common/Spinner';
import { Text } from 'react-native-paper';
import {
  getAllScheduledNotificationsAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
} from 'expo-notifications';
import { View } from 'react-native';
import VersionMismatchModal from './modals/VersionMismatchModal';

interface AppContextType {
  userId?: string;
  lastEvent?: string;
  setLastEvent: (id: string) => void;
}

interface AppContextProviderProps {
  children: React.ReactNode;
}

const AppContext = createContext<AppContextType>({
  setLastEvent: () => {
    throw new Error();
  },
});

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [userId, setUserId] = useState<string>();
  const [lastEvent, setLastEvent] = useState<string>();
  const [promptForName, setPromptForName] = useState<boolean>(false);
  const [appVersionMismatch, setAppVersionMismatch] = useState<boolean>(false);
  const { data: events, error } = useEvents();
  const {
    isLoading: userLoading,
    error: userError,
    status: userStatus,
  } = useUser(userId!);

  const updateLastEvent = (id: string) => {
    setLastEvent(id);
    AsyncStorage.setItem('lastEvent', id);
  };

  useEffect(() => {
    if (error === 'App version mismatch') {
      setAppVersionMismatch(true);
    }
  }, [error]);

  useEffect(() => {
    if (userLoading) {
      return;
    }
    if (userError && userStatus === 404) {
      setPromptForName(true);
    } else {
      AsyncStorage.getItem('userId').then((id) => {
        if (id) {
          setUserId(id);
        } else {
          setPromptForName(true);
        }
      });
      AsyncStorage.getItem('lastEvent').then((id) => {
        setLastEvent(id ?? 'none');
      });
    }
  }, [userError, userLoading]);

  useEffect(() => {
    if (!events || !events.next) {
      return;
    }
    getAllScheduledNotificationsAsync().then((notifications) => {
      if (
        notifications.some(
          (notification) => notification.identifier === events.next?.id,
        )
      ) {
        return;
      }
      scheduleNotificationAsync({
        identifier: events.next?.id,
        content: {
          title: 'Kuka soittaa?',
        },
        trigger: {
          date: new Date(events.next?.time!),
        },
      });
    });
  }, [events]);

  useEffect(() => {
    getPermissionsAsync().then(async (permissions) => {
      if (permissions.granted) {
        return;
      }
      requestPermissionsAsync().then((permissions) => {
        if (!permissions.granted) {
          // TODO
        }
      });
    });
  }, []);

  const promptDone = (name: string) => {
    setPromptForName(false);
    createUser(name).then((user) => {
      if (user?.id) {
        setUserId(user.id);
        AsyncStorage.setItem('userId', user.id);
      }
    });
  };

  if (appVersionMismatch) {
    return <VersionMismatchModal />;
  }

  if (promptForName) {
    return <NameModal onDone={promptDone} />;
  }

  if (error) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>{error.toString()}</Text>
      </View>
    );
  }

  if (!userId || !lastEvent || !events) {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={{ userId, lastEvent, setLastEvent: updateLastEvent }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
