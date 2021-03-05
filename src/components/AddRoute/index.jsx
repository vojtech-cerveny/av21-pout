import React, { useState } from "react";
import { Button } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { Form } from "../Form";

const boxStyle = {
  width: "300px",
  minHeight: "52px",
  position: "absolute",
  background: "white",
  zIndex: 2,
  right: "10px",
  top: "70px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  padding: "10px 10px 10px",
  textAlign: "left",
};

const contentStyle = {
  transition: "0.3s ease-out",
  height: "100%",
  overflow: "hidden",
};

const Header = styled.div`
  display: flex;
  align-items: center;
`;
const AddRouteHeader = styled.span`
  padding-left: 15px;
  font-size: 20px;
`;
export const AddRoute = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={boxStyle}>
      <Header onClick={() => toggleVisibility()}>
        <Button
          type="primary"
          style={{ width: "32px", height: "32px" }}
          shape="circle"
          icon={isOpen ? <UpOutlined /> : <DownOutlined />}
          
        />
        <AddRouteHeader>AV21 | Přidej svou pouť</AddRouteHeader>
      </Header>
      <div style={{ ...contentStyle, height: isOpen ? "300px" : "0" }}>
        <Form />
      </div>
    </div>
  );
};
