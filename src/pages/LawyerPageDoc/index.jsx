import React from "react";
import { Card, CardBody, Container, Row, Col, Button } from "reactstrap";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const LawyerPageDoc = () => {
  // Meta title
  document.title = "მომსახურების ხელშეკრულება | Gorgia LLC";

  // Contract content extracted from the document
  const ContractDisplay = {
    title: "მომსახურების ხელშეკრულება",
    locationAndDate: "ქ. თბილისი --/---/-----წ.",
    parties: [
      "ერთი მხრივ შემსრულებელი ფ/პ „------------„ (პ/ნ:---------------) ტელ:_____ მის:--------------",
      "მეორე მხრივ დამკვეთი შპს „გორგია\" (რეგისტრირებული 14.07.2008 წ. საიდენტიფიკაციო №245621288 იურიდიული მისამართი: ქ. ბათუმი სოხუმის ქ. №10), დირექტორი გია გორგოშაძე (პ/ნ 61003000277)."
    ],
    subject: "შემსრულებელი კისრულობს ვალდებულებას შეასრულოს ამ ხელშეკრულებით გათვალისწინებული სამუშაო კერძოდ: 2.1. ------------------",
    confidentiality: "მხარეები თანხმდებიან რომ მათ შორის სახელშეკრულებო ურთიერთობების პროცესში...",
    priceAndPayment: "წინამდებარე ხელშეკრულებით გათვალისწინებული სამუშაოს საერთო ღირებულება...",
    termAndTermination: "ხელშეკრულება ძალაში შედის მხარეთა მიერ მისი ხელმოწერის მომენტიდან და მოქმედებს ვალდებულებათა სრულ შესრულებამდე...",
    rightsAndDuties: "შემსრულებელი ვალდებულია: ა) ხარისხიანად და ჯეროვნად განახორციელოს ხელშეკრულების მე-2 მუხლით გათვალისწინებული სამუშაო...",
    liabilityAndGuarantees: "მხარეები პასუხისმგებლობას კისრულობენ ერთმანეთისათვის მიყენებული მატერიალური ტექნიკური და სხვა სახის ზიანის გამო...",
    forceMajeure: "მხარეები თავისუფლდებიან წინამდებარე ხელშეკრულებით გათვალისწინებულ ვალდებულებათა შეუსრულებლობით დამდგარი პასუხისმგებლობისგან თუ ეს გამოწვეულია დაუძლეველი ძალის ზეგავლენის გამო...",
    disputeResolution: "მხარეები თანხმდებიან რომ მიიღებენ ყველა ზომას რათა ამ ხელშეკრულებიდან გამომდინარე ყველა დავა ან წინააღმდეგობა გადაწყდება მოლაპარაკების გზით...",
    finalProvisions: "წინამდებარე ხელშეკრულების ნებისმიერი ცვლილება ან/და დამატება ძალაშია თუ იგი შესრულებულია წერილობით და ხელმოწერილია მხარეთა მიერ..."
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set the Sylfaen font (assuming Sylfaen is a standard font in jsPDF or correctly loaded)
    doc.setFont("Sylfaen");

    doc.setFontSize(12);
    doc.text(ContractDisplay.title, 10, 10);
    doc.text(ContractDisplay.locationAndDate, 10, 20);

    let y = 30; // Start position on the page

    const sections = [
      { title: "მუხლი 1. მხარეები", content: ContractDisplay.parties.join("\n") },
      { title: "მუხლი 2. გარიგების საგანი", content: ContractDisplay.subject },
      { title: "მუხლი 3. კონფიდენციალობა", content: ContractDisplay.confidentiality },
      { title: "მუხლი 4. ხელშეკრულების ფასი და ანგარიშსწორების პირობები", content: ContractDisplay.priceAndPayment },
      { title: "მუხლი 5. ხელშეკრულების ძალაში შესვლა და მოქმედების შეწყვეტა", content: ContractDisplay.termAndTermination },
      { title: "მუხლი 6. მხარეთა უფლებები და ვალდებულებები", content: ContractDisplay.rightsAndDuties },
      { title: "მუხლი 7. მხარეთა პასუხისმგებლობა და გარანტიები", content: ContractDisplay.liabilityAndGuarantees },
      { title: "მუხლი 8. დაუძლეველი ძალა", content: ContractDisplay.forceMajeure },
      { title: "მუხლი 9. დავათა გადაწყვეტა", content: ContractDisplay.disputeResolution },
      { title: "მუხლი 10. დასკვნითი დებულებები", content: ContractDisplay.finalProvisions }
    ];

    sections.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 10, y);
      y += 10; // Increase position for the next line

      doc.setFontSize(12);
      const textLines = doc.splitTextToSize(section.content, 180); // Split text into lines fitting the page width
      textLines.forEach(line => {
        if (y > 280) { // Check if the current position is at the end of the page
          doc.addPage(); // Add a new page
          y = 10; // Reset the position for the new page
        }
        doc.text(line, 10, y);
        y += 7;
      });
    });

    // Save the generated PDF
    doc.save("contract.pdf");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="ხელშეკრულებები"
            breadcrumbItem="მომსახურების ხელშეკრულება"
          />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">{ContractDisplay.title}</h4>
                  <p>{ContractDisplay.locationAndDate}</p>

                  <h5 className="mt-4">მუხლი 1. მხარეები</h5>
                  {ContractDisplay.parties.map((party, index) => (
                    <p key={index}>{party}</p>
                  ))}

                  <h5 className="mt-4">მუხლი 2. გარიგების საგანი</h5>
                  <p>{ContractDisplay.subject}</p>

                  <h5 className="mt-4">მუხლი 3. კონფიდენციალობა</h5>
                  <p>{ContractDisplay.confidentiality}</p>

                  <h5 className="mt-4">მუხლი 4. ხელშეკრულების ფასი და ანგარიშსწორების პირობები</h5>
                  <p>{ContractDisplay.priceAndPayment}</p>

                  <h5 className="mt-4">მუხლი 5. ხელშეკრულების ძალაში შესვლა და მოქმედების შეწყვეტა</h5>
                  <p>{ContractDisplay.termAndTermination}</p>

                  <h5 className="mt-4">მუხლი 6. მხარეთა უფლებები და ვალდებულებები</h5>
                  <p>{ContractDisplay.rightsAndDuties}</p>

                  <h5 className="mt-4">მუხლი 7. მხარეთა პასუხისმგებლობა და გარანტიები</h5>
                  <p>{ContractDisplay.liabilityAndGuarantees}</p>

                  <h5 className="mt-4">მუხლი 8. დაუძლეველი ძალა</h5>
                  <p>{ContractDisplay.forceMajeure}</p>

                  <h5 className="mt-4">მუხლი 9. დავათა გადაწყვეტა</h5>
                  <p>{ContractDisplay.disputeResolution}</p>

                  <h5 className="mt-4">მუხლი 10. დასკვნითი დებულებები</h5>
                  <p>{ContractDisplay.finalProvisions}</p>

                  {/* Button to generate and download the PDF */}
                  <Button color="primary" onClick={generatePDF}>
                    Download as PDF
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LawyerPageDoc;
