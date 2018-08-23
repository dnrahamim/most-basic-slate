import React, { Component } from 'react';
import {Editor} from 'slate-react';
import {Value} from 'slate';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Create our initial value...
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
});

// Define a React component renderer for our code blocks.
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <b>
        <code>{props.children}</code>
      </b>
    </pre>
  );
}

function KaTexNode(props) {
  debugger;
  return (
    <pre {...props.attributes}>
      <InlineMath>
          {props.node.text}
      </InlineMath>
      <div hidden>{props.children}</div>
    </pre>
  );
}

// Define our app...
class App extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue
  }

  onKeyDown = (event, change) => {
    // Return with no changes if the keypress is not '&'
    if (event.key === '&') {
      // Prevent the ampersand character from being inserted.
      event.preventDefault();

      // Change the value by inserting 'and' at the cursor's position.
      change.insertText('and');
      return true;
    }  else if(event.key === '`' || event.ctrlKey) {
      // Prevent the "`" from being inserted by default.
      event.preventDefault();

      // Determine whether any of the currently selected blocks are code blocks.
      const isCode = change.value.blocks.some(block => block.type == 'code');

      // Toggle the block type depending on `isCode`.
      change.setBlocks(isCode ? 'paragraph' : 'code');
      return true;
    }   else if(event.key === ':') {
      // Prevent the ":" from being inserted by default.
      event.preventDefault();

      // Determine whether any of the currently selected blocks are code blocks.
      const isKatex = change.value.blocks.some(block => block.type == 'katex');

      // Toggle the block type depending on `isCode`.
      change.setBlocks(isKatex ? 'paragraph' : 'katex');
      return true;
    }
  }

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    this.setState({ value });
  }

  renderNode = (props) => {
    switch(props.node.type) {
      case 'code':
        return <CodeNode {...props} ></CodeNode>;
      case 'katex':
        return <KaTexNode {...props} ></KaTexNode>;
    }
  }

  // Render the editor.
  render() {
    return(
      <Editor 
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderNode={this.renderNode}
      />
    );
  }
}

export default App;
