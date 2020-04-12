import "@testing-library/dom";
import React from "react";
import { render } from "@testing-library/react";
import EditRetroDialog from "../EditRetroDialog";

test("edit dialog should render", () => {
  render(
    <EditRetroDialog
      retro={{
          name: 'Test Retro',
          startDate: '2020-01-01',
          endDate: '2020-01-15',
          numberOfVotes: 6,
          id: 'MroWInV20rxNENup0Caq'
      }}
      isLoading={false}
      updateRetro={() => {}}
      handleEditClose={() => {}}
      editStatus={true}
    />
  );
});
