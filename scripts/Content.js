import * as React from 'react';
import { Socket } from './Socket';
import { MyFavoriteFoodHeader } from './MyFavoriteFoodHeader';
import { MyFavoriteFoodList } from './MyFavoriteFoodList';


import { Button } from './Button';

// export class Content extends React.Component {
//     render(){
//         return(
//             <div>
//                 <MyFavoriteFoodHeader />
//             </div>
            
//             );
//     }
// }

export class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMessages: ""
        };
    }
    
    componentDidMount() {
        Socket.on('message received', (data) => {
            this.setState({
                'message_received': data
            });
        })
    }

    render() {
        let chat_messages = this.state.message_received
        console.log(chat_messages)
        //console.log(chat_messages.keys)
        return (
            <div>
                <ul>{chat_messages}</ul>
                <Button />
              <div>
                <MyFavoriteFoodHeader />
              </div>
            </div>
        );
    }
}

