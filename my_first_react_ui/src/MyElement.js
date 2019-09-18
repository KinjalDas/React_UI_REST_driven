import React, { Component } from 'react'

class MyElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: []
    };
  }

  render() {
    return <div>
  <table className="table">
  <thead>
    <tr>
      <th scope="col">TITLE</th>
      <th scope="col">Company Name</th>
      <th scope="col">Location</th>
      <th scope="col">Experience</th>
      <th scope="col">Salary</th>
      <th scope="col">Apply Link</th>
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
    </table>
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
