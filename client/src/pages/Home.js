import {
  Row,
  Col,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  Image,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";
import { gql, useQuery } from "@apollo/client";

export default function Home() {
  const naviagte = useNavigate();
  const dispatch = useAuthDispatch();
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    naviagte("/login");
  };

  const GET_USERS = gql`
    query getUsers {
      getUsers {
        username
        imageUrl
        createdAt
        latestMessage {
          uuid
          from
          to
          content
          createdAt
        }
      }
    }
  `;

  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div className="d-flex p-3" key={user.username}>
        <Image
          src={user.imageUrl}
          roundedCircle
          className="me-2"
          style={{ width: 50, height: 45, objectFit: "cover" }}
        />
        <div>
          <p className="m-0">{user.username}</p>
          <p className="font-weight-bold">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected!"}
          </p>
        </div>
      </div>
    ));
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">WeShouldBeFriends</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav style={{ color: "white" }} className="ms-auto">
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register">
                Register
              </Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Row className="bg-white">
        <Col xs={4} className="p-0 bg-secondary">
          {usersMarkup}
        </Col>
        <Col xs={8}>
          <p>Messages</p>
        </Col>
      </Row>
    </>
  );
}
