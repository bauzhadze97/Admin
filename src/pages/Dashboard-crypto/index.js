import React from "react"
import { Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import Components
import CardUser from "./card-user";
import CardWelcome from "./card-welcome";
import MiniWidget from "./mini-widget";
import WalletBalance from "./wallet-balance";
import OverView from "./overview";
import Transactions from "./transactions";
import Notifications from "./notifications";
import BuySell from "./buy-sell";

const Dashboard = () => {
  //meta title
<<<<<<< HEAD
  document.title = "Crypto Dashboard | Skote - React Admin & Dashboard Template";
=======
  document.title = "Crypto Dashboard | Gorgia LLC";
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Dashboards" breadcrumbItem="Crypto" />
          <Row>
            <CardUser />

            <Col xl="8">
              <CardWelcome />

              <Row>
                <MiniWidget />
              </Row>
            </Col>
          </Row>

          <Row>
            <WalletBalance dataColors='["--bs-primary", "--bs-warning", "--bs-info"]' />

            <OverView dataColors='["--bs-warning"]' />
          </Row>

          <Row>
            <Transactions />

            <Notifications />

            <BuySell />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
