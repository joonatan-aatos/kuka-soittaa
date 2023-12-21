import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Spinner = () => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Spinner;
