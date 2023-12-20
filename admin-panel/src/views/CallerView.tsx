import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Container } from 'react-bootstrap';
import NewCallerModal from '../modals/NewCallerModal';
import ListHeader from '../common/ListHeader';
import DataList from '../common/DataList';
import ViewCallerModal from '../modals/ViewCallerModal';
import { Caller } from '../util/types';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const CallerView = () => {
  const [newCallerModalOpen, setNewCallerModalOpen] = useState<boolean>(false);
  const [callerToView, setCallerToView] = useState<Caller | null>(null);
  const [callerToDelete, setCallerToDelete] = useState<Caller | null>(null);

  const { callers: callerList, removeCaller } = useAppContext();

  return (
    <Container>
      <NewCallerModal
        isOpen={newCallerModalOpen}
        onClose={async () => {
          setNewCallerModalOpen(false);
        }}
      />
      <ViewCallerModal
        isOpen={callerToView !== null}
        onClose={async () => {
          setCallerToView(null);
        }}
        caller={callerToView}
      />
      <DeleteConfirmModal
        isOpen={callerToDelete !== null}
        onClose={async (success) => {
          if (success) {
            await removeCaller(callerToDelete!.id);
          }
          setCallerToDelete(null);
        }}
      />
      <ListHeader
        name="Callers"
        buttonName="Add caller"
        onButtonClick={() => setNewCallerModalOpen(true)}
      />
      <DataList
        data={callerList}
        getTitle={(caller) => caller.name}
        getKey={(caller) => caller.id}
        onShow={(caller) => setCallerToView(caller)}
        onDelete={(caller) => setCallerToDelete(caller)}
      />
    </Container>
  );
};

export default CallerView;
