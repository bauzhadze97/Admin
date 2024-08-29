import React from "react";
import { Table, Button,  Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const HrPage = () => {

  //meta title
  document.title = "ვიზირება | Gorgia LLC";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="HR" breadcrumbItem="მოთხოვნილი ცნობები" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">მოთხოვნილი ცნობები </CardTitle>
                  <CardSubtitle className="card-title-desc d-flex justify-content-between align-items-center">
  <div>
    ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი მოთხოვნილი ცნობები
  </div>
  <div>
    <Button type="button" color="primary" className="me-1">
      <i className="font-size-12 align-middle "></i> ხელფასიანი ცნობის მოთხოვნა
    </Button>
    <Button type="button" color="success">
      <i className="font-size-12 align-middle"></i> უხელფასო ცნობის მოთხოვნა
    </Button>
  </div>
</CardSubtitle>


                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>სამსახურის დაწყების თარიღი</th>
                          <th>ცნობის მოთხოვნის თარიღი</th>
                          <th>მოთხოვნილი ცნობის ფორმა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-success">
                          <th scope="row">1</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>უხელფასო ცნობა სამსახურის შესახებ</td>
                          <td>
  დადასტურებულია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">2</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>უხელფასო ცნობა სამსახურის შესახებ</td>
                          <td>უარყოფილია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">3</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>უხელფასო ცნობა სამსახურის შესახებ</td>
                          <td>უარყოფილია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">4</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>უხელფასო ცნობა სამსახურის შესახებ</td>
                          <td>უარყოფილია
</td>
                        </tr>
                        <tr className="table-danger">
                          <th scope="row">5</th>
                          <td>მერაბი ბაუჟაძე</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>29 აგვისტო 2024 წელი</td>
                          <td>უხელფასო ცნობა სამსახურის შესახებ</td>
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

export default HrPage;
