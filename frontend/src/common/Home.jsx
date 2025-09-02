import * as React from "react";
import HomeCard from "./Card";
import profileTree from "../Assets/FT_View_Tree.png";
import sideControls from "../Assets/FT_Side_Controls.png";
import profileOpen from "../Assets/FT_Profile_Open.png";
import { Container, Row, Col } from "react-bootstrap";

export default function Home() {
  return (
    <div>
      <div
        style={{
          marginRight: "auto",
          width: "50%",
          paddingTop: "20px",
          paddingLeft: "5%",
        }}
      >
        <h1>Welcome to the Rockerfellers Family Tree</h1>
        <h2>Here is a quick guide on how to best use the application!</h2>
      </div>
      <Container
        fluid
        style={{
          position: "relative",
          margin: "auto",
          paddingTop: "10px",
          paddingBottom: "10px",
          width: "90%",
        }}
      >
        <Container>
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            <Col md={4}>
              <HomeCard
                imgPath={profileTree}
                isBlog={false}
                title="Navigation Bar"
                description="Use the navigation bar to explore different sections of the family tree application. You can access features such as viewing the family tree, adding new members, and creating new relationships which are immediately added to the tree."
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <HomeCard
                imgPath={sideControls}
                isBlog={false}
                title="Tree View Controls"
                description="When viewing the family tree, you can use the controls to zoom in and out, pan across the tree, and reset the view to the default position. These controls help you navigate and explore different parts of the family tree with ease."
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <HomeCard
                imgPath={profileOpen}
                isBlog={false}
                title="Avatar interaction"
                description="Click on any avatar in the family tree to view information about that family member. To get more details, click on the 'View Profile' button in the popup that appears. This will take you to a dedicated profile page for that family member, where you can see additional information and relationships."
              />
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}
