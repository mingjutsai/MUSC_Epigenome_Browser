import React, { Component } from 'react';
import reactFeature from '../../assets/images/react-feature.svg';
import sassFeature from '../../assets/images/sass-feature.svg';
import bootstrapFeature from '../../assets/images/bootstrap-feature.svg';
import responsiveFeature from '../../assets/images/responsive-feature.svg';
import { 
  Card,
  CardBody,
  CardHeader,
  Row, 
  Col,
} from 'reactstrap';
import { Doughnut, Line } from 'react-chartjs-2';

class Dashboard extends Component {
  render() {
    const heroStyles = {
      padding: '50px 0 70px'
    };
    const chartColors = {
      red: 'rgb(233, 30, 99)',
      danger: 'rgb(233, 30, 99)',
      dangerTransparent: 'rgba(233, 30, 99, .8)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 180, 0)',
      green: 'rgb(34, 182, 110)',
      blue: 'rgb(68, 159, 238)',
      primary: 'rgb(68, 159, 238)',
      primaryTransparent: 'rgba(68, 159, 238, .8)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)',

      primaryShade1: 'rgb(68, 159, 238)',
      primaryShade2: 'rgb(23, 139, 234)',
      primaryShade3: 'rgb(14, 117, 202)',
      primaryShade4: 'rgb(9, 85, 148)',
      primaryShade5: 'rgb(12, 70, 117)'
    };
    const donutData = {
      labels: ['hMSC', 'Osteoblast', 'Osteocyte', 'Myotube', 'Myoblast'],
      datasets: [
        {
          data: [2041258, 1916942, 1174339, 1500000, 1500000],
          backgroundColor: [
            chartColors.primaryShade1,
            chartColors.primaryShade2,
            chartColors.primaryShade3,
            chartColors.primaryShade4,
            chartColors.primaryShade5
          ],
          hoverBackgroundColor: [
            chartColors.primaryShade4,
            chartColors.primaryShade4,
            chartColors.primaryShade4,
            chartColors.primaryShade4,
            chartColors.primaryShade4
          ]
        }
      ]
    };
    return (
      <div>
        <Row>
          <Col md={12}>
            <div className="home-hero" style={heroStyles}>
              <h1>Welcome to Musculoskeletal 3D Epigenome Browser.</h1>
              {/* <p className="text-muted">
                Discover this UI dashboard framework that will help speed up
                your next web application project.
              </p> */}
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4} sm={12}>
            <Card>
              <CardHeader>Significant Hi-C interactions</CardHeader>
              <CardBody>
                <Doughnut
                  data={donutData}
                  width={908}
                  height={768}
                  legend={{ display: false }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={reactFeature}
                  style={{ width: 70, height: 70 }}
                  alt="react.js"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">React.js</h2>
                  <p className="text-muted">
                    Built to quickly get your MVPs off the ground.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={bootstrapFeature}
                  style={{ width: 70, height: 70 }}
                  alt="Bootstrap"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">Bootstrap 4</h2>
                  <p className="text-muted">
                    The most popular framework to get your layouts built.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={sassFeature}
                  style={{ width: 70, height: 70 }}
                  alt="Sass"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">Sass</h2>
                  <p className="text-muted">
                    Easily change the design system styles to fit your needs.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <CardBody className="display-flex">
                <img
                  src={responsiveFeature}
                  style={{ width: 70, height: 70 }}
                  alt="Responsive"
                  aria-hidden={true}
                />
                <div className="m-l">
                  <h2 className="h4">Responsive</h2>
                  <p className="text-muted">
                    Designed for screens of all sizes.
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
