import store from './store';
import {Socket} from 'phoenix';

class ChannelWrapper {
  init_channel(session) {
    let socket = new Socket("/socket", {params: session});
    socket.connect();
    socket.onError(() => {
      store.dispatch({
          type: "LOGOUT_SESSION"
        });
      socket.disconnect();
    });
    socket.onOpen(() => {
      store.dispatch({
        type: "NEW_SESSION",
        data: session
      });
    })
  }
}

// export function create_channel(session) {
//   singleton = new ChannelWrapper(session);
// }
//
// export default function channel_singleton() {
//   return singleton;
// }

export default new ChannelWrapper();
