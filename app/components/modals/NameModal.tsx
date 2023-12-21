import { useState } from 'react';
import { BackHandler } from 'react-native';
import { Button, Card, Modal, Portal, TextInput } from 'react-native-paper';

interface NameModalProps {
  onDone: (name: string) => void;
}

const NameModal = ({ onDone }: NameModalProps) => {
  const [name, setName] = useState('');

  BackHandler.addEventListener('hardwareBackPress', () => {
    BackHandler.exitApp();
    return true;
  });

  return (
    <Portal>
      <Modal visible={true} contentContainerStyle={{ margin: 30 }}>
        <Card>
          <Card.Title title="Mikä sinun nimesi on?" />
          <Card.Content>
            <TextInput onChangeText={(text) => setName(text)} value={name} />
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => BackHandler.exitApp()}>Poistu</Button>
            <Button
              onPress={() => {
                if (name && name.length != 0) {
                  onDone(name);
                }
              }}
            >
              Tallenna
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export default NameModal;
