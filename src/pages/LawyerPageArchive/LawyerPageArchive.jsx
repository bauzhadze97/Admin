import React from "react";
import { Table, Button,  Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const LawyerPageArchive = () => {

  //meta title
  document.title = "ვიზირება | Gorgia LLC";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="არქივი" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">ხელშეკრულებების არქივი </CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი მოთხოვნილი ხელშეკრულებები
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
                        <tr className="table-success">
                          <th scope="row">1</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>
  დადასტურებულია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">2</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>უარყოფილია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">3</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>უარყოფილია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">4</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>უარყოფილია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">5</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>მომსახურების ხელშეკრულება</td>
                          <td>60 დღე</td>
                          <td>უარყოფილია
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

export default LawyerPageArchive;
