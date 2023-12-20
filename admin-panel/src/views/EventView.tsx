import { Container } from 'react-bootstrap';
import { useAppContext } from '../context/AppContext';
import ListHeader from '../common/ListHeader';
import { useState } from 'react';
import DataList from '../common/DataList';
import NewEventModal from '../modals/NewEventModal';
import { Caller, Event } from '../util/types';
import ViewCallerModal from '../modals/ViewCallerModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const EventView = () => {
  const { events: eventList, callers, removeEvent } = useAppContext();

  const [newEventModalOpen, setNewEventModalOpen] = useState<boolean>(false);
  const [callerToView, setCallerToView] = useState<Caller | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  return (
    <Container>
      <NewEventModal
        isOpen={newEventModalOpen}
        onClose={async (success) => {
          setNewEventModalOpen(false);
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
        isOpen={eventToDelete !== null}
        onClose={async (success) => {
          if (success) {
            await removeEvent(eventToDelete!.id);
          }
          setEventToDelete(null);
        }}
      />
      <ListHeader
        name="Events"
        buttonName="Add event"
        onButtonClick={() => setNewEventModalOpen(true)}
      />
      <DataList
        data={eventList}
        getTitle={(event) =>
          `${
            callers.find((caller) => caller.id === event.callerId)?.name ??
            'Unknown'
          } - ${new Date(event.time).toLocaleString()}`
        }
        getKey={(event) => event.id}
        onDelete={(event) => setEventToDelete(event)}
        onShow={(event) =>
          setCallerToView(
            callers.find((caller) => caller.id === event.callerId) ?? null,
          )
        }
      />
    </Container>
  );
};

export default EventView;
