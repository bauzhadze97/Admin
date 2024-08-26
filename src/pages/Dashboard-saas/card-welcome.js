import React from "react"
import { Row, Col, Card } from "reactstrap"

//Import Images
import profileImg from "../../assets/images/profile-img.png"

const CardWelcome = () => {
  return (
    <React.Fragment>
      <Col xl="4">
        <Card className="bg-primary-subtle">
          <div>
            <Row>
              <Col xs="7">
                <div className="text-primary p-3">
                  <h5 className="text-primary">Welcome Back !</h5>
<<<<<<< HEAD
                  <p>Skote Saas Dashboard</p>
=======
                  <p>Gorgia LLC Saas Dashboard</p>
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31

                  <ul className="ps-3 mb-0">
                    <li className="py-1">7 + Layouts</li>
                    <li className="py-1">Multiple apps</li>
                  </ul>
                </div>
              </Col>
              <Col xs="5" className="align-self-end">
                <img src={profileImg} alt="" className="img-fluid" />
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </React.Fragment>
  );
}

export default CardWelcome;