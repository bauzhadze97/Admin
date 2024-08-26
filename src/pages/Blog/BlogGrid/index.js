import React from "react";
import { Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"

import BlogGrid from "./BlogGrid"
import RightBar from "../BlogList/RightBar"

const Index = props => {
    //meta title
<<<<<<< HEAD
    document.title="Blog Grid | Skote - React Admin & Dashboard Template";
=======
    document.title="Blog Grid | Gorgia LLC";
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Blog" breadcrumbItem="Blog Grid" />
          <Row>
            <BlogGrid />
            <RightBar />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Index
