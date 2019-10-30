import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Table,Nav,Navbar,Form,FormControl,Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes,faPlus,faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ReactHtmlParser from 'react-html-parser';

class App extends Component {

   state = {
      issues: [],
      show:false,
      issue: null,
      addissue: null,
      showaddissue:false,
      editissue: null,
      showeditissue: null,
      changesdetected: null,
      filtered: false,
      filteredissues: null,
      defect: null
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/api/issues/')
    .then(res => res.json())
    .then((data) => {
      this.setState({ issues: data });
    })
    .catch((err) => console.log(err))
  }

  handleShow = (issue) => {
    this.getissue(issue.CRID);
    this.setState({issue:issue,show:true})
  }

  handleClose = () => {
    this.setState({show:false,defect:null})
  }

  showaddissue = () => {
    this.setState({showaddissue:true})
  }

  closeaddissue = () => {
    this.setState({showaddissue:false,addissue:null})
  }

  showeditissue = (issue) => {
    this.setState({issue:issue,show:false,showeditissue:true,changesdetected:false})
  }

  closeeditissue = () => {
    this.setState({showeditissue:false,editissue:null,changesdetected:null})
  }

  async deleteissue(issue){
    await fetch('http://127.0.0.1:8000/api/issues/'+issue.id,{method:"DELETE"})
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
    await fetch('http://127.0.0.1:8000/api/issues/',
    {
      method:"POST",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body:JSON.stringify(obj)
    })
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
    await fetch('http://127.0.0.1:8000/api/issues/'+this.state.issue.id+"/",
    {
      method:"PUT",
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body:JSON.stringify(obj)
    })
    .catch(console.log);
    this.setState({showeditissue:false,editissue:obj,issue:null});
    window.location.reload();
  }

  closelogin = () => {
    this.setState({showlogin:false,username:null,password:null})
  }

  async getissue(CRID){
    var res = false;
    await fetch("https://alm-2.corp.hpicloud.net:443/qcbin/api/domains/IPG/projects/ClientSoftware/defects/"+CRID,{
      method: "GET",
      headers: {"Accept":"application/json","Content-Type": "application/json"}})
      .then((response) => response.json())
      .then((data) => {res=data})
      .catch((error) => console.log(error));
      if(res===false){
        this.setState ({defect:"ALM Query Failed!"});
      }
      else{
        res = res.description.replace(/<html>/g,'');
        res = res.replace(/<body>/g,'');
        res = res.replace('</body>','');
        res = res.replace('</html>','');
        this.setState ({defect:res});
      }
  }

  changed = () => {
    this.setState({changesdetected:true})
  }

  search = () => {
    var str = this.Search.value;
    str = str.replace(/\s+/g, '');
    var found = null, foundissues=[];
    !str.replace(/\s/g, '').length?found = false:found = true;
    if(found){
      for (var i = 0; i < this.state.issues.length; i++) {
        var CRID = this.state.issues[i].CRID.replace(/\s+/g, '');
        var Title = this.state.issues[i].Title.replace(/\s+/g, '');
        var Project = this.state.issues[i].Project.replace(/\s+/g, '');
        var Component = this.state.issues[i].Component.replace(/\s+/g, '');
        var Description = this.state.issues[i].Description.replace(/\s+/g, '');
        var Prog_or_Comm = this.state.issues[i].Prog_or_Comm.replace(/\s+/g, '');
        if(CRID.includes(str)||Title.includes(str)||Project.includes(str)||Component.includes(str)||Description.includes(str)||Prog_or_Comm.includes(str)){
          foundissues.push(this.state.issues[i]);
        }
      }
      this.setState({filtered:true,filteredissues:foundissues});
    }
    else{
      this.setState({filtered:false,filteredissues:null})
    }
  }

  render(){
    return (
      <div className="App">
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
            </Nav>
            <Form inline>
              <FormControl type="text" onChange={this.search} ref={(Search) => {this.Search = Search}} placeholder="Search" className="mr-bg-2" />
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
            this.state.filtered?
            (
              this.state.filteredissues.map((issue) => (
                <tr key={issue.id}>
                  <td><Button variant="primary" onClick={(e) => this.handleShow(issue)}>{issue.id}</Button></td>
                  <td>{issue.CRID}</td>
                  <td>{issue.Title}</td>
                  <td>{issue.Project}</td>
                  <td>{issue.Component}</td>
                  <td>{issue.Open?<FontAwesomeIcon icon={faCheck}/>:<FontAwesomeIcon icon={faTimes}/>}</td>
                </tr>
              ))
            ):
            (
              this.state.issues.map((issue) => (
                <tr key={issue.id}>
                  <td><Button variant="primary" onClick={(e) => this.handleShow(issue)}>{issue.id}</Button></td>
                  <td>{issue.CRID}</td>
                  <td>{issue.Title}</td>
                  <td>{issue.Project}</td>
                  <td>{issue.Component}</td>
                  <td>{issue.Open?<FontAwesomeIcon icon={faCheck}/>:<FontAwesomeIcon icon={faTimes}/>}</td>
                </tr>
            ))
          )
          }
          </tbody>
        </Table>
        {/*Veiw-Delete*/}
        <Modal size="lg" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Issue # {this.state.issue?this.state.issue.id:-1}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          CR ID : {this.state.issue?this.state.issue.CRID:-1}<br/>
          Title : {this.state.issue?this.state.issue.Title:""}<br/>
          Project : {this.state.issue?this.state.issue.Project:""}<br/>
          Component : {this.state.issue?this.state.issue.Component:""}<br/>
          ALM Description : {this.state.issue?<div>{ ReactHtmlParser(this.state.defect) }</div>:"ALM Query Failed!"}<br/>
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
