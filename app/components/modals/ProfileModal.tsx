import { BackHandler, TouchableOpacity, View } from 'react-native';
import {
  Button,
  Card,
  Modal,
  Portal,
  TextInput,
  Text,
} from 'react-native-paper';
import { updateUser, useUser } from '../../api/users';
import { useAppContext } from '../AppContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_VERSION } from '@env';
import Clipboard from '@react-native-community/clipboard';

interface ProfileModalProps {
  visible: boolean;
  close: () => void;
}

const ProfileModal = ({ visible, close }: ProfileModalProps) => {
  const telegramUsername = '@joonatan_aatos';
  const { userId } = useAppContext();
  const { data: userData } = useUser(userId!);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    setName(userData?.name ?? name);
  }, [userData]);

  const onSave = () => {
    updateUser(userId!, name);
    close();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={close}
        contentContainerStyle={{ margin: 30 }}
      >
        <Card>
          <Card.Title title="Asetukset" />
          <Card.Content>
            <View style={{ margin: 10, gap: 20 }}>
              <TextInput
                label="Nimi"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <Button
                mode="outlined"
                onPress={() => {
                  AsyncStorage.clear();
                  BackHandler.exitApp();
                }}
              >
                Nollaa käyttäjädata
              </Button>
              <View>
                <Text>Kuka soittaa v{APP_VERSION}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Text>Kysyttävää? </Text>
                  <TouchableOpacity
                    onPress={() => Clipboard.setString(telegramUsername)}
                  >
                    <Text>{telegramUsername}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={close}>Kumoa</Button>
            <Button onPress={onSave}>Tallenna</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export default ProfileModal;
