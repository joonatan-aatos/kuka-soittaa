import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
}

const NewEventModal = ({ isOpen, onClose }: NewEventModalProps) => {
  const { createEvent, callers } = useAppContext();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const time = new Date(`${data.date}T${data.time}`);
    const callerId = data.caller;
    try {
      const result = await createEvent({ time, callerId });
      toast.success(
        `Added event for ${new Date(result.time).toLocaleDateString()}!`,
      );
      await onClose(true);
    } catch (e: any) {
      toast.error(`Failed to add caller`);
      await onClose(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={() => onClose(false)}>
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <h2 className="p-0 m-0">Add new event</h2>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <Form.Label htmlFor="caller">Caller</Form.Label>
          <Form.Select name="caller">
            {callers.map((caller) => (
              <option value={caller.id} key={caller.id}>
                {caller.name}
              </option>
            ))}
          </Form.Select>
          <Form.Label htmlFor="time">Time</Form.Label>
          <Form.Control name="time" type="time" required />
          <Form.Label htmlFor="date">Date</Form.Label>
          <Form.Control
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NewEventModal;
