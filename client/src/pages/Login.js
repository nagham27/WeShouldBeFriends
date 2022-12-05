import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
// Define mutation
const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Login(props) {
  const navigate = useNavigate();
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError(err) {
      console.log(err);
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      navigate("/");
    },
  });

  function submitLoginForm(e) {
    e.preventDefault();
    console.log(variables);
    loginUser({ variables });
  }
  console.log(errors, "errors");
  console.log(errors.username, "errors.username");
  return (
    <Container className="pt-5">
      <Row className="card py-5 flex-row  justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Login</h1>
          <Form onSubmit={submitLoginForm}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label className={errors.username && "text-danger"}>
                {errors.username ?? "Username"}
              </Form.Label>
              <Form.Control
                className={errors.username && "is-invalid"}
                type="text"
                placeholder="Enter username"
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className={errors.password && "text-danger"}>
                {errors.password ?? "Password"}
              </Form.Label>
              <Form.Control
                className={errors.password && "is-invalid"}
                type="password"
                placeholder="Enter password"
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="mb-2"
              >
                {loading ? "Loading.." : "Login"}
              </Button>
              <br />
              <small>
                Don't have an account? <Link to="/register">Register</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
