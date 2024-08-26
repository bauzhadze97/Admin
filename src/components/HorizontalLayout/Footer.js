import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
<<<<<<< HEAD
            <Col md={6}>{new Date().getFullYear()} © Skote.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by Themesbrand
=======
            <Col md={6}>{new Date().getFullYear()} © Gorgia LLC.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Developed by Gorgia Web Developer Team
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
