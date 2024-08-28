import React from "react";
import { Table, Button,  Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const LawyerPageApprove = () => {

  //meta title
  document.title = "ვიზირება | Gorgia LLC";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="ვიზირება" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">ხელშეკრულებების ვიზირების გვერდი </CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ვიზირების დადასტურების გვერდი ქვევით ნაჩვენებია მხოლოდ მიმდინარე მოთხოვნილი ვიზირებები
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>ხელშეკრულების სტილი</th>
                          <th>ხელშეკრულების მოქმედების ვადა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-warning">
                          <th scope="row">1</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>
  <Button type="button" color="success" style={{ marginRight: '10px' }}>
    <i className="bx bx-check-double font-size-10 align-left me-2"></i> დადასტურება
  </Button>
  <Button type="button" color="danger">
    <i className="bx bx-block font-size-10 align-right me-2"></i> უარყოფა
  </Button>
</td>
                        </tr>
                        <tr className="table-warning">
                          <th scope="row">2</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>
  <Button type="button" color="success" style={{ marginRight: '10px' }}>
    <i className="bx bx-check-double font-size-10 align-left me-2"></i> დადასტურება
  </Button>
  <Button type="button" color="danger">
    <i className="bx bx-block font-size-10 align-right me-2"></i> უარყოფა
  </Button>
</td>
                        </tr>
                        <tr className="table-warning">
                          <th scope="row">3</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>
  <Button type="button" color="success" style={{ marginRight: '10px' }}>
    <i className="bx bx-check-double font-size-10 align-left me-2"></i> დადასტურება
  </Button>
  <Button type="button" color="danger">
    <i className="bx bx-block font-size-10 align-right me-2"></i> უარყოფა
  </Button>
</td>
                        </tr>

                     

                     

                      

                      
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
  )
}

export default LawyerPageApprove;
