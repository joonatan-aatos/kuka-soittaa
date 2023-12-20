import { Container, Nav } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Container>
      <div className="d-flex py-4 justify-content-between align-items-center">
        <h1>Admin panel</h1>
      </div>
      <Nav fill variant="tabs" defaultActiveKey={location.pathname}>
        <Nav.Item>
          <Nav.Link eventKey="/callers" onClick={() => navigate('callers')}>
            Callers
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/events" onClick={() => navigate('events')}>
            Events
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/audio" onClick={() => navigate('audio')}>
            Audio
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
};

export default App;
