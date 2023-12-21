import { BackHandler, TouchableOpacity, View } from 'react-native';
import PageWrapper from '../common/PageWrapper';
import { useNavigate } from 'react-router-native';
import { Text } from 'react-native-paper';
import { useAnswers } from '../../api/answers';
import { useEvents } from '../../api/events';
import { useAppContext } from '../AppContext';
import Spinner from '../common/Spinner';
import { useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: events } = useEvents();
  const { data: answers } = useAnswers();
  const { lastEvent } = useAppContext();
  const currentEvent = events?.current;

  const [expandedAnswers, setExpandedAnswers] = useState<string[]>([]);

  const backAction = () => {
    navigate('..');
    return true;
  };

  const timeDifference = (time: string) =>
    new Date(time).getTime() - new Date(currentEvent?.time!).getTime();

  const getTimeText = (time: string) => {
    const difference = timeDifference(time);
    if (difference < 60000) return `${Math.round(difference / 1000)} s`;
    if (difference < 3600000) return `${Math.round(difference / 60000)} min`;
    return `${Math.round(difference / 3600000)} h`;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  BackHandler.addEventListener('hardwareBackPress', backAction);

  if (!answers || !events) return <Spinner />;
  if (currentEvent?.id !== lastEvent) navigate('/');

  return (
    <PageWrapper title="Etusivu">
      <View>
        <Text
          style={{ color: 'black', marginBottom: 20 }}
          variant="bodyLarge"
        >{`${currentEvent?.caller.name} soitti sinulle klo ${formatDate(
          currentEvent?.time!,
        )}!`}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'column-reverse' }}>
        {answers.map((answer, index) => (
          <TouchableOpacity
            key={answer.id}
            onPress={() =>
              setExpandedAnswers((prev) =>
                prev.includes(answer.id ?? '')
                  ? prev.filter((id) => id !== answer.id)
                  : [...prev, answer.id ?? ''],
              )
            }
          >
            <View
              style={{
                backgroundColor: index % 2 == 0 ? 'whitesmoke' : 'white',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                padding: 10,
                alignItems: 'flex-start',
                maxHeight: expandedAnswers.includes(answer.id ?? '')
                  ? 1000
                  : 42,
              }}
            >
              <Text
                style={{ flex: 2, color: answer.accepted ? 'green' : 'red' }}
                variant="labelLarge"
              >
                {answer.userName}
              </Text>
              <Text style={{ flex: 5, color: 'black' }}>{answer.comment}</Text>
              <Text style={{ flex: 1, color: 'black', textAlign: 'right' }}>
                {getTimeText(answer.created)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </PageWrapper>
  );
};

export default Dashboard;
