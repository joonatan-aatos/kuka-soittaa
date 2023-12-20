import { Button, ListGroup, Spinner } from 'react-bootstrap';

interface DataListProps<T> {
  data?: T[];
  getTitle: (data: T) => string;
  getKey: (data: T) => string;
  onShow: (data: T) => void;
  onDelete?: (data: T) => void;
}

const DataList = <T,>({
  data: dataList,
  getTitle,
  getKey,
  onShow,
  onDelete,
}: DataListProps<T>) => {
  if (dataList == null) {
    return <Spinner />;
  }
  return (
    <ListGroup>
      {dataList.map((data) => (
        <ListGroup.Item key={getKey(data)}>
          <div className="d-flex justify-content-between align-items-center">
            <span>{getTitle(data)}</span>
            <div className="d-flex gap-3">
              <Button variant="secondary" onClick={() => onShow(data)}>
                Show
              </Button>
              {onDelete && (
                <Button variant="danger" onClick={() => onDelete(data)}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default DataList;
