import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';

class MyElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: []
    };
  }

  render() {
    return <div>
  <Table striped bordered hover>
  <thead className="thead-dark">
    <tr>
      <th scope="col" className="th-sm">TITLE</th>
      <th scope="col" className="th-sm">Company Name</th>
      <th scope="col" className="th-sm">Location</th>
      <th scope="col" className="th-sm">Experience</th>
      <th scope="col" className="th-sm">Salary</th>
      <th scope="col" className="th-sm">Apply Link</th>
    </tr>
  </thead>
  <tbody>
      {
        this.state.jobs.map(job =>
          <tr>
            <td>{job.title}</td>
            <td>{job.companyname}</td>
            <td>{job.location}</td>
            <td>{job.experience}</td>
            <td>{job.salary}</td>
            <td>{job.applylink}</td>
          </tr>
      )
      }
    </tbody>
    </Table>
    </div>
  }
  componentDidMount() {
    fetch('https://nut-case.s3.amazonaws.com/jobs.json')
    .then(res => res.json())
    .then((result) => {
      this.setState({
        jobs: result.data })
    })
    .catch(console.log)
  }
}

export default MyElement
