import { Button } from 'react-bootstrap';

interface ListHeaderProps {
  name: string;
  buttonName: string;
  onButtonClick: () => void;
}

const ListHeader = ({ name, buttonName, onButtonClick }: ListHeaderProps) => (
  <div className="d-flex py-3 px-1 justify-content-between align-items-center">
    <h3>{name}</h3>
    <Button variant="success" onClick={onButtonClick}>
      {buttonName}
    </Button>
  </div>
);

export default ListHeader;
