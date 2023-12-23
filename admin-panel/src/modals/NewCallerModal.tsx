import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

interface NewCallerModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
}

const NewCallerModal = ({ isOpen, onClose }: NewCallerModalProps) => {
  const { createCaller, audio } = useAppContext();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const result = await createCaller(formData);
      toast.success(`Added caller ${result.name}!`);
      await onClose(true);
    } catch (e: unknown) {
      toast.error(`Failed to add caller`);
      await onClose(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={() => onClose(false)}>
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <h2 className="p-0 m-0">Add new caller</h2>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <Form.Control name="name" placeholder="Name" required />
          <Form.Label htmlFor="image">Image</Form.Label>
          <Form.Control name="image" type="file" required></Form.Control>
          <Form.Label htmlFor="audio">Audio</Form.Label>
          <Form.Select name="audio">
            <option value="">Default</option>
            {audio.map((audio) => (
              <option value={audio} key={audio}>
                {audio}
              </option>
            ))}
          </Form.Select>
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

export default NewCallerModal;
