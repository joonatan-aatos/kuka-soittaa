import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import RoundButton from '../common/RoundButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigate } from 'react-router-native';
import { useAppContext } from '../AppContext';
import { useEvents } from '../../api/events';
import { getCallerAudioSrc, getCallerImageSrc } from '../../util/caller';
import DefaultImage from '../../assets/logo.png';
import Spinner from '../common/Spinner';

const Call = () => {
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const { lastEvent } = useAppContext();
  const { data: events } = useEvents();
  const answered = !events || lastEvent == events?.current?.id;

  const navigate = useNavigate();

  const playSound = async () => {
    const sound = new Audio.Sound();
    await sound.loadAsync({
      uri: getCallerAudioSrc(events?.current?.callerId!),
    });
    setSound(sound);
    sound.setIsLoopingAsync(true);
    await sound.playAsync();
  };

  useEffect(() => {
    if (!events || !events.current) {
      return;
    }
    if (!sound) playSound();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound, events]);

  const onAnswer = async (accpeted: boolean) => {
    if (answered) {
      navigate('/dashboard');
      return;
    }
    sound && sound.unloadAsync();
    navigate(accpeted ? '/accepted' : '/declined');
  };

  const callerId = events?.current?.callerId;
  const caller = callerId ? getCallerImageSrc(callerId) : undefined;

  if (!events || !events.current) {
    return <Spinner />;
  }

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Image
        source={
          caller
            ? {
                uri: caller,
              }
            : DefaultImage
        }
        style={{
          height: '100%',
          width: '100%',
          resizeMode: 'contain',
          position: 'absolute',
        }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={{
          height: '35%',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: '15%',
        }}
      >
        <RoundButton
          style={{
            width: 100,
            height: 100,
            backgroundColor: answered ? 'gray' : 'red',
          }}
          onClick={() => onAnswer(false)}
        >
          <MaterialCommunityIcons name="phone-hangup" size={40} color="white" />
        </RoundButton>
        <RoundButton
          style={{
            width: 100,
            height: 100,
            backgroundColor: answered ? 'gray' : 'green',
          }}
          onClick={() => onAnswer(true)}
        >
          <MaterialCommunityIcons name="phone" size={40} color="white" />
        </RoundButton>
      </LinearGradient>
    </View>
  );
};

export default Call;
