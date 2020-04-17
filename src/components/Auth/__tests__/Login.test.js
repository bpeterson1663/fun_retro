import React from "react";
import Login from "../Login";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

it("CreateItem Renders", () => {
  render(
    <BrowserRouter>
        <Login location={{}} match={{params: {id: 1}}} history={{}}/>
    </BrowserRouter>);
});
