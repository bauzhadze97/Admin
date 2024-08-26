import React from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

const ConfirmMail = () => {

  //meta title
<<<<<<< HEAD
  document.title="Confirm Mail | Skote - React Admin & Dashboard Template";
=======
  document.title="Confirm Mail | Gorgia LLC";
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">

        <Container>
          <Row>
            <Col lg={12}>
              <div className="d-block text-center mb-5 text-muted">
                <Link to="/dashboard" className="d-block auth-logo">
                  <img
                    src={logodark}
                    alt=""
                    height="20"
                    className="auth-logo-dark mx-auto"
                  />
                  <img
                    src={logolight}
                    alt=""
                    height="20"
                    className="auth-logo-light mx-auto"
                  />
                </Link>
                <p className="mt-3">React Admin & Dashboard Template</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <CardBody>
                  <div className="p-2">
                    <div className="text-center">
                      <div className="avatar-md mx-auto">
                        <div className="avatar-title rounded-circle bg-light">
                          <i className="bx bx-mail-send h1 mb-0 text-primary"></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <h4>Success !</h4>
                        <p className="text-muted">
                          At vero eos et accusamus et iusto odio dignissimos
                          ducimus qui blanditiis praesentium voluptatum
                          deleniti atque corrupti quos dolores et
                        </p>
                        <div className="mt-4">
                          <Link to="/dashboard" className="btn btn-success">
                            Back to Home
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
<<<<<<< HEAD
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger"></i> by Themesbrand
=======
                  © {new Date().getFullYear()} Gorgia LLC. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger"></i> by Gorgia Web Developers Team
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ConfirmMail
