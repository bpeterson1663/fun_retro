import React from "react";
import CommentItemDialog from "../CommentItemDialog";
import { render } from "@testing-library/react";

it("CommentItemDialog Renders", () => {
  render(
    <CommentItemDialog
      addComment={jest.fn()}
      handleCommentClose={jest.fn()}
      showCommentDialog={{ item: "" }}
    />
  );
});
