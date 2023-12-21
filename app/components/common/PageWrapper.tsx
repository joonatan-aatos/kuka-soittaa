import { ScrollView, View } from 'react-native';
import { useNavigate } from 'react-router-native';
import ProfileModal from '../modals/ProfileModal';
import { useState } from 'react';
import { Appbar } from 'react-native-paper';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
}

const PageWrapper = ({ children, title }: PageWrapperProps) => {
  const navigate = useNavigate();
  const [profileVisible, setProfileVisible] = useState<boolean>(false);

  const onProfilePress = () => {
    setProfileVisible(!profileVisible);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigate('..')} />
        <Appbar.Content title={title} />
        <Appbar.Action icon="account" onPress={onProfilePress} />
      </Appbar.Header>
      <ProfileModal visible={profileVisible} close={onProfilePress} />
      <ScrollView style={{ flexGrow: 1 }}>
        <View style={{ margin: 20 }}>{children}</View>
      </ScrollView>
    </>
  );
};

export default PageWrapper;
