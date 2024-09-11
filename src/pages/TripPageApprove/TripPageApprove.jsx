import React, { useEffect, useState } from "react"
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getTripList } from "services/trip" // Assuming you also need to import approveTrip

const TripPageApprove = ({ filterStatus }) => {
  document.title = "მივლინებების ვიზირება | Georgia LLC" // Page title

  const [expandedRows, setExpandedRows] = useState([]) // To handle expanded rows
  const [trips, setTrips] = useState([]) // To store the fetched trip requests

  // Toggle row expansion to show detailed trip info
  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  // Fetch trip requests from the backend
  const fetchTrips = async () => {
    try {
      const response = await getTripList()
      setTrips(response.data.business) // Assuming business contains the trip data
    } catch (err) {
      console.error("Error fetching trip requests:", err)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  // Handle status update (approve/reject)
  const handleUpdateStatus = async (tripId, status) => {
    try {
      // await approveTrip(tripId, { status }) // Pass status in request payload
      setTrips(prevTrips =>
        prevTrips.map(trip => (trip.id === tripId ? { ...trip, status } : trip))
      )
    } catch (err) {
      console.error("Error updating trip status:", err)
    }
  }

  // Filter trips based on filterStatus prop
  const filteredTrips = filterStatus
    ? trips.filter(trip => filterStatus.includes(trip.status))
    : trips

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <CardTitle className="h4">
                მივლინებების ვიზირების გვერდი
              </CardTitle>
              <CardSubtitle className="card-title-desc">
                ქვემოთ მოცემულია მიმდინარე მივლინების მოთხოვნები
              </CardSubtitle>

              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>მომთხოვნი პირი</th>
                      <th>მივლინების ადგილი</th>
                      <th>დაწყების თარიღი</th>
                      <th>დასრულების თარიღი</th>
                      <th>სტატუსი</th>
                      <th>ვიზირება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.map((trip, index) => (
                      <React.Fragment key={trip.id}>
                        <tr
                          className={
                            trip.status === "rejected"
                              ? "table-danger"
                              : trip.status === "approved"
                              ? "table-success"
                              : "table-warning"
                          }
                          onClick={() => toggleRow(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>
                            {trip.subtitle_user_name}{" "}
                            {trip.subtitle_user_sur_name}
                          </td>
                          <td>{trip.place_of_trip}</td>
                          <td>
                            {new Date(trip.start_date).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(trip.end_date).toLocaleDateString()}
                          </td>
                          <td>{trip.status}</td>
                          <td>
                            {trip.status === "rejected" ? (
                              <Button color="danger" disabled>
                                <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                უარყოფილია
                              </Button>
                            ) : trip.status === "approved" ? (
                              <Button color="success" disabled>
                                <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                დადასტურებულია
                              </Button>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  color="success"
                                  style={{ marginRight: "10px" }}
                                  onClick={() =>
                                    handleUpdateStatus(trip.id, "approved")
                                  }
                                >
                                  <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                  დადასტურება
                                </Button>
                                <Button
                                  type="button"
                                  color="danger"
                                  onClick={() =>
                                    handleUpdateStatus(trip.id, "rejected")
                                  }
                                >
                                  <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                  უარყოფა
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="7">
                              <div className="p-3">
                                <p>დეტალური ინფორმაცია</p>
                                <ul>
                                  <li>მიზანი: {trip.purpose_of_trip}</li>
                                  <li>სრული ხარჯი: {trip.total_expense}₾</li>
                                  <li>
                                    ტრანსპორტის ხარჯი: {trip.expense_transport}₾
                                  </li>
                                  <li>საცხოვრებელი: {trip.expense_living}₾</li>
                                  <li>კვების ხარჯი: {trip.expense_meal}₾</li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default TripPageApprove
