import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Table,Nav,Navbar,Form,FormControl,Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faPlus,faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class App extends Component {

   state = {
      issues: [],
      show:false,
      issue: null,
      loggedin: false,
      showlogin: false, //true when implemented
      username: null,
      password: null,
      addissue: null,
      showaddissue:false,
      editissue: null,
      showeditissue: null,
      changesdetected: null
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
    this.setState({issue:issue,show:true})
  }

  handleClose = () => {
    this.setState({show:false})
  }

  showaddissue = () => {
    this.setState({showaddissue:true})
  }

  closeaddissue = () => {
    this.setState({showaddissue:false,addissue:null})
  }

  showeditissue = (issue) => {
    console.log(issue);
    this.setState({issue:issue,show:false,showeditissue:true,changesdetected:false})
  }

  closeeditissue = () => {
    this.setState({showeditissue:false,editissue:null,changesdetected:null})
  }

  async deleteissue(issue){
    console.log("deleting:" + JSON.stringify(issue));
    await fetch('http://127.0.0.1:8000/api/issues/'+issue.id,{method:"DELETE"})
    .then(res => console.log(res))
    .catch(console.log);
    window.location.reload();
    this.setState({show:false})
  }

  async addissue(formobject){
    var obj = {};
    obj.CRID = formobject.CRID.value;
    obj.Project = formobject.Project.value;
    obj.Title = formobject.Title.value;
    obj.Component = formobject.Component.value;
    obj.Description = formobject.Description.value;
    obj.Prog_or_Comm = formobject.Prog_or_Comm.value;
    obj.Open = formobject.Open.checked;
    console.log("adding:" + JSON.stringify(obj));
    await fetch('http://127.0.0.1:8000/api/issues/',
    {
      method:"POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body:JSON.stringify(obj)
    })
    .then(res => console.log(res))
    .catch(console.log);
    this.setState({showaddissue:false,addissue:obj});
    window.location.reload();
  }

  async editissue(formobject){
    var obj = {};
    obj.CRID = formobject.CRID.value;
    obj.Project = formobject.Project.value;
    obj.Title = formobject.Title.value;
    obj.Component = formobject.Component.value;
    obj.Description = formobject.Description.value;
    obj.Prog_or_Comm = formobject.Prog_or_Comm.value;
    obj.Open = formobject.Open.checked;
    console.log("editing:" + JSON.stringify(obj));
    await fetch('http://127.0.0.1:8000/api/issues/'+this.state.issue.id+"/",
    {
      method:"PUT",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body:JSON.stringify(obj)
    })
    .then(res => console.log(res))
    .catch(console.log);
    this.setState({showeditissue:false,editissue:obj,issue:null});
    window.location.reload();
  }

  closelogin = () => {
    this.setState({showlogin:false,username:null,password:null})
  }

  async login(event,email,pass){
    event.preventDefault();
    console.log(email);
    console.log(pass);
    //add login code here from login modal
    var encodedString = new Buffer(email + ':' + pass).toString('base64');
    var login = true;
    console.log(encodedString);
    var res = await fetch("https://alm-2.corp.hpicloud.net:443/qcbin/authentication-point/alm-authenticate",{
      credentials: "include",
      method: "POST",
      mode: "no-cors",
      headers: {"Accept":"application/json","Content-Type": "application/json"},
      body: "<alm-authentication><user>"+email+"</user><password>"+pass+"</password></alm-authentication>",
    })
    .then((response) => {return response;})
    .catch((error) => {login = false;console.log(error);});
    console.log(res);
    if(!login){
      this.setState({showlogin:false, loggedin:true, username:email, password:pass})
    }
  }

  showlogin = () => {
    this.setState({showlogin:true})
  }

  changed = () =>{
    this.setState({changesdetected:true})
  }

  render(){
    return (
      <div className="App">
      {/* Login */}
      <Modal show={this.state.showlogin} onHide={this.closelogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" ref={(email) => {this.email = email}}/>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" ref={(pass) => {this.pass = pass}}/>
          </Form.Group>
          <Form.Text className="text-muted">
            Enter your ALM credentials.
          </Form.Text>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closelogin}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => this.login(e,this.email.value,this.pass.value)}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Issue */}
      <Modal size="lg" show={this.state.showaddissue} onHide={this.closeaddissue}>
        <Modal.Header closeButton>
          <Modal.Title>Add Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Text className="text-muted">
            Enter your Issue Details.
          </Form.Text>
          <br/>
          <Form.Group controlId="formCRID">
            <Form.Label>CR ID</Form.Label>
            <Form.Control type="text" placeholder="Enter ALM CR ID" ref={(CRID) => {this.CRID = CRID}}/>
          </Form.Group>
          <Form.Group controlId="formProject">
            <Form.Label>Project</Form.Label>
            <Form.Control type="text" placeholder="Enter Project (Stanley/Yeti/UPD/Others etc.)" ref={(Project) => {this.Project = Project}}/>
          </Form.Group>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter Issue Title (short description)" ref={(Title) => {this.Title = Title}}/>
          </Form.Group>
          <Form.Group controlId="formComponent">
            <Form.Label>Component</Form.Label>
            <Form.Control type="text" placeholder="Enter Component (UI/MS/IO/Render etc.)" ref={(Component) => {this.Component = Component}}/>
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows="5" placeholder="Enter Summary (detailed description)" ref={(Description) => {this.Description = Description}}/>
          </Form.Group>
          <Form.Group controlId="formProgOrComm">
            <Form.Label>Progress/Comments</Form.Label>
            <Form.Control as="textarea" rows="5" placeholder="Enter Latest Progress/Comments" ref={(Prog_or_Comm) => {this.Prog_or_Comm = Prog_or_Comm}}/>
          </Form.Group>
          <Form.Group controlId="formOpen">
          <Form.Check type="checkbox" label="Open" ref={(Open) => {this.Open = Open}}/>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeaddissue}>
            Close
          </Button>
          <Button variant="primary" onClick={(e) => this.addissue(this)}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Edit Issue*/}
      <Modal size="lg" show={this.state.showeditissue} onHide={this.closeeditissue}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Text className="text-muted">
            Edit your Issue Details.
          </Form.Text>
          <br/>
          <Form.Group controlId="formCRID">
            <Form.Label>CR ID</Form.Label>
            <Form.Control type="text" placeholder="Enter ALM CR ID" onChange={this.changed} defaultValue={this.state.issue?this.state.issue.CRID:null} ref={(CRID) => {this.CRID = CRID}}/>
          </Form.Group>
          <Form.Group controlId="formProject">
            <Form.Label>Project</Form.Label>
            <Form.Control type="text" placeholder="Enter Project (Stanley/Yeti/UPD/Others etc.)" onChange={this.changed} defaultValue={this.state.issue?this.state.issue.Project:null} ref={(Project) => {this.Project = Project}}/>
          </Form.Group>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter Issue Title (short description)" onChange={this.changed} defaultValue={this.state.issue?this.state.issue.Title:null} ref={(Title) => {this.Title = Title}}/>
          </Form.Group>
          <Form.Group controlId="formComponent">
            <Form.Label>Component</Form.Label>
            <Form.Control type="text" placeholder="Enter Component (UI/MS/IO/Render etc.)" onChange={this.changed} defaultValue={this.state.issue?this.state.issue.Component:null} ref={(Component) => {this.Component = Component}}/>
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows="5" placeholder="Enter Summary (detailed description)" onChange={this.changed} defaultValue={this.state.issue?this.state.issue.Description:null} ref={(Description) => {this.Description = Description}}/>
          </Form.Group>
          <Form.Group controlId="formProgOrComm">
            <Form.Label>Progress/Comments</Form.Label>
            <Form.Control as="textarea" rows="5" placeholder="Enter Latest Progress/Comments" onChange={this.changed} defaultValue={this.state.issue?this.state.issue.Prog_or_Comm:null} ref={(Prog_or_Comm) => {this.Prog_or_Comm = Prog_or_Comm}}/>
          </Form.Group>
          <Form.Group controlId="formOpen">
          <Form.Check type="checkbox" label="Open" defaultChecked={this.state.issue?this.state.issue.Open:null} onChange={this.changed} ref={(Open) => {this.Open = Open}}/>
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="success" onClick={this.closeeditissue}>
          Cancel
        </Button>
          <Button variant="danger" disabled={this.state.changesdetected?false:true} onClick={(e) => this.editissue(this)}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Main Navigation Bar*/}
        <Navbar bg="dark" variant="dark" expang="lg">
          <Navbar.Brand href="#home">Issue Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link><Button onClick={this.showaddissue}><FontAwesomeIcon icon={faPlus}/></Button></Nav.Link>
              <Nav.Link>{this.state.loggedin?<Button onClick={this.showlogin}>Logout</Button>:<Button onClick={this.showlogin}>Login</Button>}</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Search" className="mr-bg-2" />
              <Button variant="outline-info">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        {/*Issue Table*/}
        <Table id="DataTable" striped bordered condensed="True" hover>
          <thead>
            <tr>
              <th>#</th>
              <th>CR ID</th>
              <th>TITLE</th>
              <th>Project</th>
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
              <td>{issues.Project}</td>
              <td>{issues.Component}</td>
              <td>{issues.Open?<FontAwesomeIcon icon={faCheck}/>:<FontAwesomeIcon icon={faTimes}/>}</td>
            </tr>
          ))
          }
          </tbody>
        </Table>
        {/*Veiw-Delete*/}
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
          Progress/Comments : {this.state.issue?this.state.issue.Prog_or_Comm:""}<br/>
          Open? : {
            this.state.issue?
            (
               this.state.issue.Open?<FontAwesomeIcon icon={faCheck}/>:<FontAwesomeIcon icon={faTimes}/>
            )
            :<FontAwesomeIcon key="false" icon={faTimes}/>
          }<br/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={(e) => this.showeditissue(this.state.issue?this.state.issue:null)}>
              <FontAwesomeIcon icon={faEdit}/>
            </Button>
            <Button variant="danger" onClick={(e) => this.deleteissue(this.state.issue?this.state.issue:null)}>
              <FontAwesomeIcon icon={faTrashAlt}/>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
     );
  }
}

export default App;
