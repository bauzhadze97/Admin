import React, { useEffect, useState } from "react";
import { Table, Row, Col, Card, CardBody } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getCurrentUserTrips } from "services/admin/business";


const UserTrip = () => {
  // Meta title
  document.title = "მოგზაურობები | Gorgia LLC";

  const [trips, setTrips] = useState([]);

  // Fetch the current user's trips from the API
  const fetchTrips = async () => {
    try {
      const response = await getCurrentUserTrips(); // Fetch user trips
      setTrips(response.data.data); // Assuming 'trips' is the key holding the trips
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Determine the row class based on the trip status
  const getRowClass = (status) => {
    switch (status) {
      case "rejected":
        return "table-danger";
      case "approved":
        return "table-success";
      case "pending":
        return "table-warning";
      default:
        return "";
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="მოგზაურობები" breadcrumbItem="ჩემი მოგზაურობები" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მოგზაურობის მიზანი</th>
                          <th>მოგზაურობის თარიღი</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips?.map((trip, index) => (
                          <tr key={trip.id} className={getRowClass(trip.status)}>
                            <th scope="row">{index + 1}</th>
                            <td>{trip.objective}</td>
                            <td>{trip.trip_date}</td>
                            <td>
                              {trip.status === "rejected" ? "უარყოფილია" :
                               trip.status === "approved" ? "დადასტურებულია" : "მოლოდინში"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserTrip;
