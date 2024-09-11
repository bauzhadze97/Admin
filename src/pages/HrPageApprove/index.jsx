import React, { useEffect, useState } from "react"
import { Table, Button, Row, Col, Card, CardBody } from "reactstrap"
import { getHrDocuments, updateHrDocumentStatus } from "services/hrDocument"

const HrPageApprove = ({ filterStatus }) => {
  document.title = "ვიზირება | Gorgia LLC"

  const [expandedRows, setExpandedRows] = useState([])
  const [documents, setDocuments] = useState([])

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await getHrDocuments()
      setDocuments(response.data)
    } catch (err) {
      console.error("Error fetching HR documents:", err)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleUpdateStatus = async (documentId, status) => {
    try {
      await updateHrDocumentStatus(documentId, status)
      setDocuments(prevDocuments =>
        prevDocuments.map(document =>
          document.id === documentId ? { ...document, status } : document
        )
      )
    } catch (err) {
      console.error("Error updating document status:", err)
    }
  }

  console.log(documents);
  
  const filteredDocuments = filterStatus
    ? documents.filter(document => filterStatus.includes(document.status))
    : documents

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>მომთხოვნი პირი</th>
                      <th>მოთხოვნილი ფორმის სტილი</th>
                      <th>სამსახურის დაწყების თარიღი</th>
                      <th>ვიზირება</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((document, index) => (
                      <React.Fragment key={document.id}>
                        <tr
                          className={
                            document.status === "rejected"
                              ? "table-danger"
                              : document.status === "approved"
                              ? "table-success"
                              : "table-warning"
                          }
                          onClick={() => toggleRow(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <th scope="row">{index + 1}</th>
                          <td>{document.user.name}</td>
                          <td>{document.name}</td>
                          <td>
                            {new Date(document.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            {document.status === "rejected" ? (
                              <Button color="danger" disabled>
                                უარყოფილია
                              </Button>
                            ) : document.status === "approved" ? (
                              <Button color="success" disabled>
                                დადასტურებულია
                              </Button>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  color="success"
                                  style={{ marginRight: "10px" }}
                                  onClick={() =>
                                    handleUpdateStatus(document.id, "approved")
                                  }
                                >
                                  დადასტურება
                                </Button>
                                <Button
                                  type="button"
                                  color="danger"
                                  onClick={() =>
                                    handleUpdateStatus(document.id, "rejected")
                                  }
                                >
                                  უარყოფა
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedRows.includes(index) && (
                          <tr>
                            <td colSpan="5">
                              <div className="p-3">
                                <p>დეტალური ინფორმაცია</p>
                                <ul>
                                  <li>
                                    მიმდინარე პოზიცია: {document.user.position}
                                  </li>
                                  <li>
                                    საიდენტიფიკაციო კოდი ან პირადი ნომერი:{" "}
                                    {document.user.id}
                                  </li>
                                  <li>
                                    იურიდიული მისამართი / ფაქტიური მისამართი:{" "}
                                    {document.user.location}
                                  </li>
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

export default HrPageApprove
