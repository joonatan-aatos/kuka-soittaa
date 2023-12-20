import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';

interface NewAudioModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
}

const NewAudioModal = ({ isOpen, onClose }: NewAudioModalProps) => {
  const { createAudio } = useAppContext();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createAudio(formData);
    toast.success(`Added audio ${result}!`);
    await onClose(true);
  };

  return (
    <Modal show={isOpen} onHide={() => onClose(false)}>
      <Form onSubmit={onSubmit}>
        <Modal.Header>
          <h2 className="p-0 m-0">Add new audio</h2>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <Form.Control name="name" placeholder="Name" required />
          <Form.Label htmlFor="audio">Audio</Form.Label>
          <Form.Control name="audio" type="file" required></Form.Control>
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

export default NewAudioModal;
