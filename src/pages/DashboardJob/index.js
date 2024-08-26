import React from 'react';
import { Container, Row } from 'reactstrap';

//Import Components
import ActivityFeed from './ActivityFeed';
import AddedJobs from './AddedJobs';
import CandidateSection from './CandidateSection';
import ChartSection from './ChartSection';
import JobVacancy from './JobVacancy';
import ReceivedTime from './ReceivedTime';
import Section from './Section';
import StatisticsApplications from './StatisticsApplications';

const DashboardJob = () => {

<<<<<<< HEAD
    document.title = "Job Dashboard | Skote - React Admin & Dashboard Template"
=======
    document.title = "Job Dashboard | Gorgia LLC"
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Section />

                    <ChartSection />
                    <Row>
                        <StatisticsApplications />
                        <CandidateSection />
                    </Row>

                    <Row>
                        <JobVacancy />
                    </Row>

                    <Row>
                        <ReceivedTime />
                        <ActivityFeed />
                        <AddedJobs />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default DashboardJob;