import "@testing-library/dom";
import React from "react";
import { render } from "@testing-library/react";
import CreateRetroDialog from "../CreateRetroDialog";

test("create dialog should render", () => {
  render(
    <CreateRetroDialog
      isLoading={false}
      submitRetro={() => {}}
      handleCreateClose={() => {}}
      createStatus={true}
    />
  );
});
