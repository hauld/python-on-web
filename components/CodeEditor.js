import React, { useRef, useEffect, useImperativeHandle } from "react";
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  keymap
} from "@codemirror/next/view";
import { EditorState } from "@codemirror/next/state";
import { history, historyKeymap } from "@codemirror/next/history";
import { foldGutter, foldKeymap } from "@codemirror/next/fold";
import { indentOnInput } from "@codemirror/next/language";
import { defaultKeymap } from "@codemirror/next/commands";
import { bracketMatching } from "@codemirror/next/matchbrackets";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/next/closebrackets";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/next/search";
import { autocompletion, completionKeymap } from "@codemirror/next/autocomplete";
import { commentKeymap } from "@codemirror/next/comment";
import { rectangularSelection } from "@codemirror/next/rectangular-selection";
import { lintKeymap } from "@codemirror/next/lint";
import { markdown } from "@codemirror/next/lang-markdown";
import { language } from "@codemirror/next/language";
import { python } from "@codemirror/next/lang-python";
import { basicSetup } from "@codemirror/next/basic-setup";

const CodeEditor = React.forwardRef(
  ({ initialValue = "", editorViewRef: editorViewRefProp, onChange }, ref) => {
    const editorViewRefInternal = useRef();
    const containerRef = useRef();

    const editorViewRef = editorViewRefProp || editorViewRefInternal;

    useImperativeHandle(ref, () => ({
      getValue: () => editorViewRef.current.state.doc.toString()
    }));

    useEffect(() => {
      const updateListener = EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          if (typeof onChange === "function") {
            onChange();
          }
        }
      });

      if (containerRef.current) {
        if (!editorViewRef.current) {
          const extensions = [
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            basicSetup,
            keymap.of([
              ...closeBracketsKeymap,
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...foldKeymap,
              ...commentKeymap,
              ...completionKeymap,
              ...lintKeymap
            ]),
            python(),
            updateListener
          ];
          editorViewRef.current = new EditorView({
            state: EditorState.create({
              doc: initialValue,
              lineNumbers: true ,
              extensions
            }),
            parent: containerRef.current
          });
        }
      }
    }, [containerRef, initialValue, editorViewRef, onChange]);

    return <div ref={containerRef} />;
  }
);

export default CodeEditor;
