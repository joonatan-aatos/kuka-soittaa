import Clipboard from '@react-native-community/clipboard';
import { BackHandler, TouchableOpacity } from 'react-native';
import { Button, Card, Modal, Portal, Text } from 'react-native-paper';

const VersionMismatchModal = () => {
  const telegramUsername = '@joonatan_aatos';

  BackHandler.addEventListener('hardwareBackPress', () => {
    BackHandler.exitApp();
    return true;
  });

  return (
    <Portal>
      <Modal visible={true} contentContainerStyle={{ margin: 30 }}>
        <Card>
          <Card.Title title="Päivitys saatavilla" />
          <Card.Content>
            <Text>
              Kuka soittaa -sovelluksesta on uusi versio! Sinun on päivitettävä
              sovellus, jotta voit jatkaa sen käyttämistä.
            </Text>
            <Text style={{ marginTop: 20 }}>
              Kysymyksiä voi laittaa Telegramissa:
            </Text>
            <TouchableOpacity
              onPress={() => Clipboard.setString(telegramUsername)}
            >
              <Text>{telegramUsername}</Text>
            </TouchableOpacity>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => BackHandler.exitApp()}>Selvä</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

export default VersionMismatchModal;
