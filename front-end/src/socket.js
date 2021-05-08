import {io} from 'socket.io-client'


const socket = process.env.NODE_ENV === 'development' ? io('ws://10.192.4.11:39201') : io('wss://index.archialgo.com');
// const socket = ""
export default socket