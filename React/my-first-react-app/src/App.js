import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Table,Nav,Navbar,Form,FormControl,Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes } from '@fortawesome/free-solid-svg-icons';

class App extends Component {

   state = {
      issues: [],
      show:false,
      setShow:false,
      issue: null,
      loggedin: false,
      showlogin: true,
      username: null,
      password: null
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/api/issues/')
    .then(res => res.json())
    .then((data) => {
      this.setState({ issues: data });
      console.log(data);
    })
    .catch(console.log)
  }

  handleShow = (issue) => {
    console.log(issue);
    this.setState({issue:issue,show:true,setShow:true})
  }

  handleClose = () => {
    this.setState({show:false,setShow:false})
  }

  closelogin = () => {
    this.setState({showlogin:false,username:null,password:null})
  }

  login = () => {
    //add login code here from login modal
    this.setState({showlogin:false,username:"",password:""})
  }

  showlogin = () => {
    this.setState({showlogin:true})
  }

  render(){
    return (
      <div className="App">
      <Modal show={this.state.showlogin} onHide={this.closelogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Login
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closelogin}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => this.login()}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
        <Navbar bg="dark" variant="dark" expang="lg">
          <Navbar.Brand href="#home">Issue Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link><Button>Add Issue</Button></Nav.Link>
              <Nav.Link><Button onClick={this.showlogin}>Login</Button></Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-bg-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Table striped bordered condensed="True" hover>
          <thead>
            <tr>
              <th>#</th>
              <th>CR ID</th>
              <th>TITLE</th>
              <th>Component</th>
              <th>Open</th>
              </tr>
          </thead>
          <tbody>
          {
            this.state.issues.map((issues) => (
            <tr key={issues.id}>
              <td><Button variant="primary" onClick={(e) => this.handleShow(issues)}>{issues.id}</Button></td>
              <td>{issues.CRID}</td>
              <td>{issues.Title}</td>
              <td>{issues.Component}</td>
              <td>{issues.Open?<FontAwesomeIcon icon={faCheck}/>:<FontAwesomeIcon icon={faTimes}/>}</td>
            </tr>
          ))
          }
          </tbody>
        </Table>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Issue # {this.state.issue?this.state.issue.id:-1}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          CR ID : {this.state.issue?this.state.issue.CRID:-1}<br/>
          Title : {this.state.issue?this.state.issue.Title:""}<br/>
          Project : {this.state.issue?this.state.issue.Project:""}<br/>
          Component : {this.state.issue?this.state.issue.Component:""}<br/>
          Description : {this.state.issue?this.state.issue.Description:""}<br/>
          Progress/Comments : {this.state.issue?this.state.issue.CRID:""}<br/>
          Open? : {this.state.issue?[(this.state.issues.Open?<FontAwesomeIcon icon={faCheck}/>:null),<FontAwesomeIcon key="false" icon={faTimes}/>]:<FontAwesomeIcon key="false" icon={faTimes}/>}<br/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
     );
  }
}

export default App;
