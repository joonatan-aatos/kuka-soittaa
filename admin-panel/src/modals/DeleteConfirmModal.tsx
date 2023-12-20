import { Button, Modal } from 'react-bootstrap';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
}

const DeleteConfirmModal = ({ isOpen, onClose }: DeleteConfirmModalProps) => {
  return (
    <Modal show={isOpen} onHide={() => onClose(false)}>
      <Modal.Header>
        <h2 className="p-0 m-0">Are you sure?</h2>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        <p>This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onClose(true)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmModal;
