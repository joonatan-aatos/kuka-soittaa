import { TouchableOpacity, View } from 'react-native';
import {
  Answer,
  likeAnswer,
  unlikeAnswer,
  useLikedAnswers,
} from '../../api/answers';
import { Event } from '../../api/events';
import { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { useAppContext } from '../AppContext';

interface CommentProps {
  index: number;
  answer: Answer;
  currentEvent: Event;
}

const Comment = ({ index, answer, currentEvent }: CommentProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeDisabled, setLikeDisabled] = useState<boolean>(false);
  const [nofLikes, setNofLikes] = useState<number>(answer.likes);
  const { userId } = useAppContext();
  const { data: likedAnswers } = useLikedAnswers(userId!);

  useEffect(() => {
    if (likedAnswers) {
      setLiked(likedAnswers.includes(answer.id));
    }
  }, [likedAnswers]);

  const onLikeClicked = async () => {
    setLiked((liked) => !liked);
    setNofLikes((nofLikes) => nofLikes + (liked ? -1 : 1));
    setLikeDisabled(true);
    await (liked ? unlikeAnswer : likeAnswer)(userId!, answer.id);
    setLikeDisabled(false);
  };

  const timeDifference = (time: string) =>
    new Date(time).getTime() - new Date(currentEvent.time!).getTime();

  const getTimeText = (time: string) => {
    const difference = timeDifference(time);
    if (difference < 60000) return `${Math.round(difference / 1000)} s`;
    if (difference < 3600000) return `${Math.round(difference / 60000)} min`;
    return `${Math.round(difference / 3600000)} h`;
  };

  const backgroundColor = index % 2 == 0 ? 'whitesmoke' : 'white';
  const borderColor = 'lightgray';

  return (
    <View
      style={{
        backgroundColor,
        width: '100%',
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        key={answer.id}
        onPress={() => setExpanded((expanded) => !expanded)}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            maxHeight: expanded ? 1000 : 42,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{ flex: 5, color: answer.accepted ? 'green' : 'red' }}
            variant="labelLarge"
          >
            {answer.userName}
          </Text>
          <Text style={{ flex: 12, color: 'black' }}>{answer.comment}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Button
          icon={liked ? 'heart' : 'heart-outline'}
          style={{
            marginHorizontal: -10,
            marginVertical: -4,
          }}
          onPress={onLikeClicked}
          disabled={likeDisabled}
        >
          <Text>{nofLikes}</Text>
        </Button>
        <Text style={{ flex: 3, color: 'black', textAlign: 'right' }}>
          {getTimeText(answer.created)}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
