import React, { Component } from 'react'

class MyElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: []
    };
  }
  render() {
    return <ol>
      {
        this.state.jobs.map(job => (
          <li key={job._id}>
            TITLE : {job.title}
            COMP : {job.companyname}
            LOC : {job.location}
            EXP : {job.experience}
            SAL : {job.salary}
            APPLY : {job.applylink}
          </li>
      ))
      }
    </ol>;
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
