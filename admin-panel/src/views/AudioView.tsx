import { Container } from 'react-bootstrap';
import ListHeader from '../common/ListHeader';
import { useState } from 'react';
import NewAudioModal from '../modals/NewAudioModal';
import { useAppContext } from '../context/AppContext';
import DataList from '../common/DataList';
import { backendUrl } from '../util/api';

const AudioView = () => {
  const [newAudioModalOpen, setNewAudioModalOpen] = useState<boolean>(false);

  const { audio: audioList } = useAppContext();

  return (
    <Container>
      <NewAudioModal
        isOpen={newAudioModalOpen}
        onClose={async () => {
          setNewAudioModalOpen(false);
        }}
      />
      <ListHeader
        name="Audio"
        buttonName="Add audio"
        onButtonClick={() => setNewAudioModalOpen(true)}
      />
      <DataList
        data={audioList}
        getTitle={(audio) => audio}
        getKey={(audio) => audio}
        onShow={(audio) =>
          window.open(`${backendUrl}/audio/${audio}`, '_blank')
        }
      />
    </Container>
  );
};

export default AudioView;
