import { Content } from './Content';
import * as React from 'react';
import Chatkit from '@pusher/chatkit-client'


export class App extends React.Component {
  constructor() {
    super()
    this.state = {
      currentUsername: '',
     currentScreen: 'WhatIsYourUsernameScreen'
    }
    this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this)
 }

  onUsernameSubmitted(username) {
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => {
        this.setState({
          currentUsername: username,
          currentScreen: 'ChatScreen'
        })
      })
      .catch(error => console.error('error', error))
  }

 render() {
   return <UsernameForm onSubmit={this.onUsernameSubmitted} />
   
    // if (this.state.currentScreen === 'WhatIsYourUsernameScreen') {
    //   return <UsernameForm onSubmit={this.onUsernameSubmitted} />
    // }
    // if (this.state.currentScreen === 'ChatScreen') {
    //   return <ChatScreen currentUsername={this.state.currentUsername} />
    }
  }


export class MyFavoriteFoodList extends React.Component {
 constructor(props) {
   super(props)
   this.state = {
     username: '',
   }
   this.onSubmit = this.onSubmit.bind(this)
   this.onChange = this.onChange.bind(this)
 }

 onSubmit(e) {
   e.preventDefault()
   this.props.onSubmit(this.state.username)
 }

 onChange(e) {
    this.setState({ username: e.target.value })
  }

  render() {
    return (
      <div>
        <div>
          <h2>What is your username?</h2>
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              placeholder="Your full name"
              onChange={this.onChange}
            />
            <input type="submit" />
          </form>
        </div>
      </div>
    )
  }
}

export class MessagesList extends React.Component {
   render() {
     const styles = {
       container: {
         overflowY: 'scroll',
         flex: 1,
       },
       ul: {
         listStyle: 'none',
      },
       li: {
         marginTop: 13,
         marginBottom: 13,
       },
       senderUsername: {
         fontWeight: 'bold',
       },
       message: { fontSize: 15 },
     }
     return (
      /*
       <div
         style={{
           ...this.props.style,
          ...styles.container,
         }}
       >
       */
         <ul style={styles.ul}>
           {this.props.messages.map((message, index) => (
             <li key={index} style={styles.li}>
               <div>
                 <span style={styles.senderUsername}>{message.senderId}</span>{' '}
               </div>
               <p style={styles.message}>{message.text}</p>
             </li>
          ))}
         </ul>
       //</div>
     )
   }
 }

export class SendMessageForm extends React.Component {
   constructor(props) {
     super(props)
     this.state = {
       text: '',
     }
     this.onSubmit = this.onSubmit.bind(this)
     this.onChange = this.onChange.bind(this)
   }

   onSubmit(e) {
     e.preventDefault()
     this.props.onSubmit(this.state.text)
     this.setState({ text: '' })
   }

   onChange(e) {
     this.setState({ text: e.target.value })
     if (this.props.onChange) {
       this.props.onChange()
     }
   }

   render() {
     const styles = {
       container: {
         padding: 20,
         borderTop: '1px #4C758F solid',
         marginBottom: 20,
       },
       form: {
         display: 'flex',
       },
       input: {
         color: 'inherit',
         background: 'none',
         outline: 'none',
         border: 'none',
         flex: 1,
         fontSize: 16,
       },
     }
     return (
       <div style={styles.container}>
         <div>
           <form onSubmit={this.onSubmit} style={styles.form}>
             <input
               type="text"
               placeholder="Type a message here then hit ENTER"
               onChange={this.onChange}
               value={this.state.text}
               style={styles.input}
             />
           </form>
         </div>
       </div>
     )
   }
 }
 
export class WhosOnlineList extends React.Component {
  renderUsers() {
    return (
      <ul>
        {this.props.users.map((user, index) => {
          if (user.id === this.props.currentUser.id) {
            return (
              <WhosOnlineListItem key={index} presenceState="online">
                {user.name} (You)
              </WhosOnlineListItem>
            )
          }
          return (
            <WhosOnlineListItem key={index} presenceState={user.presence.state}>
              {user.name}
            </WhosOnlineListItem>
          )
        })}
      </ul>
    )
  }

  render() {
    if (this.props.users) {
      return this.renderUsers()
    } else {
      return <p>Loading...</p>
    }
  }
}

export class WhosOnlineListItem extends React.Component {
  render() {
    const styles = {
      li: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 2,
        paddingBottom: 2,
      },
      div: {
        borderRadius: '50%',
        width: 11,
        height: 11,
        marginRight: 10,
      },
    }
    return (
      <li style={styles.li}>
        <div
          style={{
            //...styles.div,
            backgroundColor:
              this.props.presenceState === 'online' ? '#539eff' : '#414756',
          }}
        />
        {this.props.children}
      </li>
    )
  }
}

export class ChatScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: []
    }
    this.sendMessage = this.sendMessage.bind(this)
  }
  
  sendMessage(text) {
      this.state.currentUser.sendMessage({
        text,
        roomId: this.state.currentRoom.id,
      })
  }

  componentDidMount () {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:b9995b77-545e-44b1-85d7-932b951c9dd8',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://localhost:3001/authenticate',
      }),
    })

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser })
        return currentUser.subscribeToRoom({
          roomId: "YOUR ROOM ID",
          messageLimit: 100,
          hooks: {
            onMessage: message => {
              this.setState({
                messages: [...this.state.messages, message],
              })
            },
          },
      })
  })
      .then(currentRoom => {
        this.setState({ currentRoom })
       })
     .catch(error => console.error('error', error))
  }
  render() {
    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      chatContainer: {
        display: 'flex',
        flex: 1,
      },
      whosOnlineListContainer: {
        width: '300px',
        flex: 'none',
        padding: 20,
        backgroundColor: '#2c303b',
        color: 'white',
      },
      chatListContainer: {
        padding: 20,
        width: '85%',
        display: 'flex',
        flexDirection: 'column',
      },
   }

    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}
              />
          </aside>
          <section style={styles.chatListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}
            />
            <SendMessageForm onSubmit={this.sendMessage} />
          </section>
        </div>
      </div>
    )
  }
}
