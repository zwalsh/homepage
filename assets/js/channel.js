import store from './store';
import { Socket } from 'phoenix';
import api from './api';

class ChannelWrapper {
  init_channel(session) {
    let socket = new Socket('/socket', { params: session });
    socket.connect();
    socket.onError(() => {
      store.dispatch({
        type: 'LOGOUT_SESSION'
      });
      socket.disconnect();
    });
    socket.onOpen(() => {
      store.dispatch({
        type: 'NEW_SESSION',
        data: session
      });

      let channel = socket.channel('homepage:' + session.user_id, {});
      channel.join().receive('ok', resp => {
        console.log(resp);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            console.log(latitude, longitude);
            channel.push('coords', {
              latitude: latitude.toString(),
              longitude: longitude.toString()
            });
          });
        }
      });
      channel.on('bg_img', resp => {
        store.dispatch({
          type: 'NEW_BG_IMG',
          data: resp.url
        });
        console.log(resp);
      });
      channel.on('forecast', resp => {
        store.dispatch({
          type: 'NEW_WEATHER',
          data: resp.forecast
        });
        console.log(resp);
      });
      channel.on('predictions', resp => {
        console.log(resp);
      });
      channel.on('quote', resp => {
        store.dispatch({
          type: 'NEW_QUOTE',
          data: resp.quote
        });
        console.log(resp);
      });

      api.get_music().then(resp => {
        console.log(resp);
      });
    });
  }
}

export default new ChannelWrapper();
