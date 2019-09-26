import { Content } from './Content';
import * as React from 'react';

export class MyFavoriteFoodHeader extends React.Component {
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
            <h2>Who's online PLACEHOLDER</h2>
          </aside>
          <section style={styles.chatListContainer}>
            <h2>Chat PLACEHOLDER</h2>
          </section>
        </div>
      </div>
    )
  }
}