import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
} from "draft-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CustomEditor = ({ saveClicked, setSaveClicked }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [currentStyle, setCurrentStyle] = useState("");

  const styles = ["HEADING", "RED", "BOLD", "UNDERLINED"];

  const styleMap = {
    RESET: {
      fontSize: "16px",
      fontWeight: 400,
      color: "black",
      textDecoration: "none",
    },
    HEADING: {
      fontSize: "32px",
      fontWeight: 600,
    },
    RED: {
      color: "red",
    },
    UNDERLINED: {
      textDecoration: "underline",
    },
  };

  const handleChange = (state) => {
    setEditorState(state);
  };

  const handleEnter = () => {
    console.log("Toggling style" + currentStyle);
    setTimeout(() => {
      setEditorState((prevEditorState) =>
        RichUtils.toggleInlineStyle(prevEditorState, currentStyle)
      );
      setCurrentStyle("");
    }, 50);
  };

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const currentText = currentBlock.getText();
    let newContentState;
    let flag = 0,
      style = "";

    if (
      chars === " " &&
      currentText.startsWith("#") &&
      currentText.length < 2
    ) {
      flag = 1;
      // Delete '#' and space
      newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getAnchorOffset() - 1,
          focusOffset: selection.getFocusOffset(),
        })
      );
      style = "HEADING";
    } else if (
      chars === " " &&
      currentText.startsWith("*") &&
      currentText.length < 2
    ) {
      flag = 1;
      // Delete '*' and space
      newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getAnchorOffset() - 1,
          focusOffset: selection.getFocusOffset(),
        })
      );
      style = "BOLD";
    } else if (
      chars === " " &&
      currentText.startsWith("**") &&
      currentText.length < 3
    ) {
      flag = 1;
      // Delete '**' and space
      newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getAnchorOffset() - 2,
          focusOffset: selection.getFocusOffset(),
        })
      );
      style = "RED";
    } else if (
      chars === " " &&
      currentText.startsWith("***") &&
      currentText.length < 4
    ) {
      flag = 1;
      // Delete '***' and space
      newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getAnchorOffset() - 3,
          focusOffset: selection.getFocusOffset(),
        })
      );
      style = "UNDERLINED";
    }
    if (flag === 1) {
      // Toggle style for the block
      const newEditorStateWithBold = EditorState.push(
        editorState,
        newContentState,
        "insert-characters"
      );

      const inlineStyle = newEditorStateWithBold.getCurrentInlineStyle();
      let stateWithStyle = newEditorStateWithBold;
      styles.map((s) => {
        if (s === style) {
          stateWithStyle = RichUtils.toggleInlineStyle(stateWithStyle, style);
        } else {
          const styleActive = inlineStyle.has(s);
          console.log(s + " " + styleActive);
          if (styleActive) {
            console.log("Removing " + s);
            stateWithStyle = RichUtils.toggleInlineStyle(stateWithStyle, s);
          }
        }
        return null;
      });

      setEditorState(stateWithStyle);

      setCurrentStyle(style);

      // Prevent Draft.js from handling the input
      return "handled";
    }

    return "not-handled";
  };

  const keyBindingFn = (e) => {
    if (e.key === "Enter") {
      handleEnter();
    }
    return getDefaultKeyBinding(e);
  };

  const handleSave = (saveClicked) => {
    if (saveClicked === true) {
      console.log("Saving to localstorage");
      const contentState = editorState.getCurrentContent();
      localStorage.setItem(
        "editorState",
        JSON.stringify(convertToRaw(contentState))
      );
      toast.success("Saved to localstorage!", { position: "top-right" });
    }
    setSaveClicked("False");
  };

  // const handleStyleChange = (style) => {
  //   handleChange(RichUtils.toggleInlineStyle(editorState, style));
  // };

  useEffect(() => {
    handleSave(saveClicked);
  }, [saveClicked]);

  useEffect(() => {
    const localEditorState = localStorage.getItem("editorState");
    if (localEditorState) {
      console.log("Retreving from localstorage");
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(JSON.parse(localEditorState))
        )
      );
    }
  }, []);

  return (
    <div className="border-2 rounded-md w-full h-[90vh] p-3">
      <Editor
        editorState={editorState}
        onChange={handleChange}
        customStyleMap={styleMap}
        handleBeforeInput={handleBeforeInput}
        keyBindingFn={keyBindingFn}
      />
    </div>
  );
};

export default CustomEditor;
