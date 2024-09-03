import React, { useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import Overview from './Overview';
import DetailsSection from './DetailsSection';
import { useParams } from 'react-router-dom';
import { getTask } from 'services/tasks';

const JobDetails = () => {
    document.title = "Job Details | Gorgia LLC";


    const { id } = useParams(); 
    const [task, setTask] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTask(id);
                setTask(response);
            } catch (error) {
                console.error("Error fetching task details:", error);
            } 
        };

        fetchTask();
    }, [id]);

    console.log(task);
    
   
    return (
        <React.Fragment>
             <div className="page-content">
                <Container fluid>
                <Breadcrumbs title="Jobs" breadcrumbItem="Job Details" />

                <Row>
                    <Overview />
                    <DetailsSection />
                </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default JobDetails;