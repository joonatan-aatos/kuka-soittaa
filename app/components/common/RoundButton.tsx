import { TouchableOpacity, ViewStyle } from 'react-native';

interface RoundButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: ViewStyle;
}

const RoundButton = ({ children, style, onClick }: RoundButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 1000,
        backgroundColor: 'green',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default RoundButton;
