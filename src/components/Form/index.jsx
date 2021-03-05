import React from "react";
import styled from "styled-components";
import { Input, Button } from 'antd';

const Box = styled.div`
  & > input, button {
    margin-top: 10px;
  }
`

export const Form = () => {
  return (
    <Box >
      <Input placeholder="JMÉNO" />
      <Input placeholder="Výchozí místo" />
      <Input placeholder="Cilove misto" />
      <Input placeholder="Pocet km" />
      <Input type="file" />
      <Button style={{width: "100%"}}type="primary">Přidej mou pouť!</Button> 
    </Box>
  );
};
