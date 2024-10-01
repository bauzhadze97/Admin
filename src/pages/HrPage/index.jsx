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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  createHrDocument,
  getHrDocuments,
  getCurrentUser,
} from "services/hrDocument"
import { fetchUser } from "services/user"

const HrPage = () => {
  document.title = "ვიზირება | Gorgia LLC"

  const [hrDocuments, setHrDocuments] = useState([])
  const [modal, setModal] = useState(false)
  const [missingIdUser, setMissingIdUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchUser()
      setCurrentUser(response.data)
    } catch (err) {
      console.error("Error fetching current user:", err)
    }
  }

  const fetchHrDocuments = async () => {
    try {
      const response = await getHrDocuments()
      setHrDocuments(response.data)
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  useEffect(() => {
    fetchCurrentUser() // Fetch current user on mount
    fetchHrDocuments() // Fetch HR documents on mount
  }, [])

  const handleCreateDocument = async type => {
    if (!currentUser?.id_number) {
      setMissingIdUser(currentUser)
      setModal(true)
      return
    }

    try {
      const documentName =
        type === "paid" ? "ხელფასიანი ცნობა" : "უხელფასო ცნობა"
      const response = await createHrDocument({ name: documentName })
      setHrDocuments([...hrDocuments, response.data])
    } catch (err) {
      console.error("Error creating HR document:", err)
    }
  }

  const getRowClass = status => {
    switch (status) {
      case "rejected":
        return "table-danger"
      case "approved":
        return "table-success"
      case "in_progress":
        return "table-warning"
      default:
        return ""
    }
  }

  const handleRowClick = document => {
    if (!document.user?.id_number) {
      setMissingIdUser(document.user)
      setModal(true)
    } else {
      setCurrentUser(document.user)
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="HR" breadcrumbItem="მოთხოვნილი ცნობები" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">მოთხოვნილი ცნობები</CardTitle>
                  {currentUser && (
                    <div className="mb-4">
                      <strong>Currently Logged In:</strong>{" "}
                      {currentUser.name || "უცნობი"} (ID:{" "}
                      {currentUser.id_number || "უცნობი"})
                    </div>
                  )}
                  <CardSubtitle className="card-title-desc d-flex justify-content-between align-items-center">
                    <div>
                      ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი
                      მოთხოვნილი ცნობები
                    </div>
                    <div>
                      <Button
                        type="button"
                        color="primary"
                        className="me-1"
                        onClick={() => handleCreateDocument("paid")}
                      >
                        <i className="font-size-12 align-middle "></i>{" "}
                        ხელფასიანი ცნობის მოთხოვნა
                      </Button>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => handleCreateDocument("unpaid")}
                      >
                        <i className="font-size-12 align-middle"></i> უხელფასო
                        ცნობის მოთხოვნა
                      </Button>
                    </div>
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>ID ნომერი</th>
                          <th>სამსახურის დაწყების თარიღი</th>
                          <th>ცნობის მოთხოვნის თარიღი</th>
                          <th>მოთხოვნილი ცნობის ფორმა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrDocuments.map((document, index) => (
                          <tr
                            key={document.id}
                            className={getRowClass(document.status)}
                            onClick={() => handleRowClick(document)}
                          >
                            <th scope="row">{index + 1}</th>
                            <td>{document.user?.name || "უცნობი"}</td>
                            <td>{document.user?.id_number || "უცნობი"}</td>
                            <td>
                              {document.user?.working_start_date
                                ? new Date(
                                    document.user.working_start_date
                                  ).toLocaleDateString("ka-GE")
                                : "უცნობი"}
                            </td>
                            <td>
                              {document.created_at
                                ? new Date(
                                    document.created_at
                                  ).toLocaleDateString("ka-GE")
                                : "უცნობი"}
                            </td>
                            <td>{document.name}</td>
                            <td>
                              {document.status === "rejected"
                                ? "უარყოფილია"
                                : document.status === "approved"
                                ? "დადასტურებულია"
                                : "მოლოდინში"}
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

      {/* Modal for missing ID Number */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          პირადი ნომრის შეცდომა
        </ModalHeader>
        <ModalBody>
          {missingIdUser
            ? `${missingIdUser.name} - ID ნომერი არ არსებობს.`
            : "ID ნომერი არ არსებობს, გთხოვთ შეავსოთ ID ნომერი, თქვენს პროფილზე"}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>
            დახურვა
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}

export default HrPage
