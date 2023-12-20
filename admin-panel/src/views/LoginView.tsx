import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';

interface LoginViewProps {
  tryLogin(token: string): void;
}

const LoginView = ({ tryLogin }: LoginViewProps) => {
  const [input, setInput] = useState<string>('');

  return (
    <Container>
      <h1 className="my-4">Admin panel</h1>
      <div className="d-flex flex-column gap-3 align-items-center">
        <Form.Control
          type="password"
          placeholder="Admin token"
          className="w-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={() => tryLogin(input)}>Submit</Button>
      </div>
    </Container>
  );
};

export default LoginView;
