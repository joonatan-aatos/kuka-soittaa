import { BackHandler, View } from 'react-native';
import PageWrapper from '../common/PageWrapper';
import { useNavigate } from 'react-router-native';
import { Text } from 'react-native-paper';
import { useAnswers } from '../../api/answers';
import { useEvents } from '../../api/events';
import { useAppContext } from '../AppContext';
import Spinner from '../common/Spinner';
import Comment from '../common/Comment';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: events } = useEvents();
  const { data: answers } = useAnswers();
  const { lastEvent } = useAppContext();
  const currentEvent = events?.current;

  const backAction = () => {
    navigate('..');
    return true;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  BackHandler.addEventListener('hardwareBackPress', backAction);

  if (!answers || !events || !currentEvent) return <Spinner />;
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
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        {answers.map((answer, index) => (
          <Comment
            key={answer.id}
            index={index}
            answer={answer}
            currentEvent={currentEvent}
          />
        ))}
      </View>
    </PageWrapper>
  );
};

export default Dashboard;
