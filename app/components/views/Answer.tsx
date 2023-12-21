import { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { createAnswer } from '../../api/answers';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-native';
import { useEvents } from '../../api/events';
import Spinner from '../common/Spinner';

interface AnswerProps {
  accepted: boolean;
}

const Answer = ({ accepted }: AnswerProps) => {
  const [text, setText] = useState<string>('');
  const { userId, setLastEvent } = useAppContext();
  const { data: events } = useEvents();
  const navigate = useNavigate();

  const onDone = async () => {
    await createAnswer(userId!, accepted, text);
    setLastEvent(events?.current?.id!);
    navigate('/dashboard');
  };

  if (!events) return <Spinner />;

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: accepted ? 'green' : 'red',
        justifyContent: 'center',
      }}
    >
      <Card style={{ margin: 30 }}>
        <Card.Title
          title={accepted ? 'Vastasit puhelimeen!' : 'Et vastannut :('}
        />
        <Card.Content>
          <TextInput
            label="Kommentti"
            value={text}
            onChangeText={(text) => setText(text)}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigate('/')}>Takaisin</Button>
          <Button onPress={onDone}>Valmis</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default Answer;
