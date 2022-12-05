import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

// Define mutation
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

export default function Register(props) {
  const navigate = useNavigate();
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER, {
    update(cache, res) {
      console.log(res);
      navigate("/login");
    },
    onError(err) {
      console.log(err);
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  function submitRegisterForm(e) {
    e.preventDefault();
    console.log(variables);
    registerUser({ variables });
  }

  return (
    <Container className="pt-5">
      <Row className="card py-5 flex-row  justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className={errors.email && "text-danger"}>
                {errors.email ?? "Email address"}
              </Form.Label>
              <Form.Control
                className={errors.email && "is-invalid"}
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
            </Form.Group>
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
            <Form.Group className="mb-3" controlId="formBasicPassword2">
              <Form.Label className={errors.confirmPasword && "text-danger"}>
                {errors.confirmPassword ?? "Confirm password"}
              </Form.Label>
              <Form.Control
                className={errors.confirmPassword && "is-invalid"}
                type="password"
                placeholder="Enter password"
                onChange={(e) =>
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Loading.." : "Register"}
              </Button>
              <br />
              <small>
                Already have an account? <Link to="/login">Login</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
