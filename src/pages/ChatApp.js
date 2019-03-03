import React from 'react';
import io from 'socket.io-client';
import config from '../config';
import Grid from '@material-ui/core/Grid';
import Messages from './Messages';
import ChatInput from './ChatInput';
import Messages2 from './Messages2';
import ChatInput2 from './ChatInput2';
require('../style/ChatApp.css');

class ChatApp extends React.Component {
  socket = {};
  constructor(props) {
    super(props);
    this.state = { messages: [],
      keywords: [
        'dog',
        'cat',
        'animal',
        'sprite',
        'bottle',
        'dragon',
        'goldfish'
      ], messages2:[]};
    this.sendHandler = this.sendHandler.bind(this);
    this.sendHandler2 = this.sendHandler2.bind(this);

    // Connect to the server
    this.socket = io(config.api, { query: `username=${props.username}` }).connect();

    // Listen for messages from the server
    this.socket.on('server:message', message => {
      this.addMessage(message);
    });
  }

  sendHandler(message) {
    console.log(this);
    const messageObject = {
      username: this.props.username,
      message
    };

    // Emit the message to the server
    this.socket.emit('client:message', messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }

  sendHandler2(message) {
    console.log(this);
    const messageObject = {
      username: this.props.username,
      message
    };

    // Emit the message to the server
    this.socket.emit('client:message', messageObject);

    messageObject.fromMe = true;
    this.addMessage2(messageObject);
  }



  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }

getNewKeyword(){
    let num = Math.floor(Math.random() * this.state.keywords.length);
    
    return num;
  }

  addMessage2(message) {
    // Append the message to the component state
    this.setState(prevState => {
      let newState = prevState;
      newState.messages2.push(message);
      return newState;
    });
  }

  render() {
    let keyIndex = this.getNewKeyword();
    return (
      <div>
      <Grid item xs={12}>
      <div className="together">
      <div className="container">
        <h3>React Chat App</h3>
        <b><p>Keyword: {this.state.keywords[keyIndex]}</p></b>
        <h3>Build a Story!</h3>
        <Messages messages={this.state.messages} />
        <ChatInput keyword={this.state.keywords[keyIndex]} onSend={this.sendHandler} />
      </div>
       <div className="container2">
         <h3>Group Chat</h3>
         <Messages messages={this.state.messages2} />
         <ChatInput onSend={this.sendHandler2} />
       </div>
       </div>
       </Grid>
      </div>
    );
  }

}
ChatApp.defaultProps = {
  username: 'Anonymous'
};

export default ChatApp;
