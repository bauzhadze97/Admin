import React from "react"
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import JobData from "./JobData"

const JobGrid = () => {
<<<<<<< HEAD
  document.title = "Jobs Grid | Skote - React Admin & Dashboard Template"
=======
  document.title = "Jobs Grid | Gorgia LLC"
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Jobs" breadcrumbItem="Jobs Grid" />
          <JobData />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default JobGrid
