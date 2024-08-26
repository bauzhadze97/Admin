import React from "react"
import { Row, Col, Card } from "reactstrap"

//Import Image
import features from "../../assets/images/crypto/features-img/img-1.png"

const CardWelcome = () => {
  return (
    <React.Fragment>
      <Card>
        <div>
          <Row>
            <Col lg="9" sm="8">
              <div className="p-4">
                <h5 className="text-primary">Welcome Back !</h5>
<<<<<<< HEAD
                <p>Skote Crypto Dashboard</p>
=======
                <p>Gorgia LLC Crypto Dashboard</p>
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31

                <div className="text-muted">
                  <p className="mb-1">
                    <i className="mdi mdi-circle-medium align-middle text-primary me-1"/>{" "}
                    If several languages coalesce
                  </p>
                  <p className="mb-1">
                    <i className="mdi mdi-circle-medium align-middle text-primary me-1"/>{" "}
                    Sed ut perspiciatis unde
                  </p>
                  <p className="mb-0">
                    <i className="mdi mdi-circle-medium align-middle text-primary me-1"/>{" "}
                    It would be necessary
                  </p>
                </div>
              </div>
            </Col>
            <Col lg="3" sm="4" className="align-self-center">
              <div>
                <img src={features} alt="" className="img-fluid d-block" />
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </React.Fragment>
  )
}

export default CardWelcome
