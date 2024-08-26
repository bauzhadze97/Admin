import React from "react"
import { Container, Row } from "reactstrap"

//import component
import CardUser from "./CardUser"
import Settings from "./Settings"
import Posts from "./Posts"
import Comments from "./Comments"
import TapVisitors from "./TapVisitors"
import Activity from "./Activity"
import PopularPost from "./PopularPost"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const index = () => {
  //meta title
<<<<<<< HEAD
  document.title = "Blog Dashboard | Skote - React Admin & Dashboard Template";
=======
  document.title = "Blog Dashboard | Gorgia LLC";
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Dashboards" breadcrumbItem="Blog" />
          <Row>
            {/* card user */}
            <CardUser dataColors='["--bs-primary", "--bs-warning"]' />
            <Settings />
          </Row>
          <Row>
            <Posts />
            <Comments />
            <TapVisitors />
          </Row>
          <Row>
            {" "}
            <Activity />
            <PopularPost />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
