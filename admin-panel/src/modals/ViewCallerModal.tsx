import { Button, Image, Modal } from 'react-bootstrap';
import { Caller } from '../util/types';
import { backendUrl } from '../util/api';

interface ViewCallerModalProps {
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
  caller: Caller | null;
}

const ViewCallerModal = ({ isOpen, onClose, caller }: ViewCallerModalProps) => {
  if (!caller) {
    return null;
  }
  return (
    <Modal show={isOpen} onHide={() => onClose(false)}>
      <Modal.Header>
        <h2 className="p-0 m-0">Caller: {caller.name}</h2>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-3">
        <Image src={`${backendUrl}/caller/${caller.id}/image`} thumbnail />
        <audio controls src={`${backendUrl}/caller/${caller.id}/audio`} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewCallerModal;
