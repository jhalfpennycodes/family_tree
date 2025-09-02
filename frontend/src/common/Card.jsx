import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function HomeCard(props) {
  return (
    <Card className="project-card-view">
      <hr></hr>
      <Card.Body>
        <Card.Title>
          <b>{props.title}</b>
        </Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
        {"\n"}
      </Card.Body>
      <Card.Img
        style={{
          padding: "10px",
          opacity: "0.8",
          borderRadius: "30px",
          width: "100%",
        }}
        src={props.imgPath}
        alt="card-img"
      />
    </Card>
  );
}
export default HomeCard;
