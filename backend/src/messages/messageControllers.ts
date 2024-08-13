import { Socket } from "socket.io";
import {
  handleGetMessages,
} from "./messageService";

// const messageSocketHandlers = (socket: Socket, ) => {
//     socket.on('message', (msg: string) => {
//       console.log('Message received:', msg);
//       io.emit('message', msg); 
//     });
// };


const getMessages = async (req: any, res: any) => {
  try {
    const profileId = req.query.profileId;
    console.log("getMessages: ", profileId, req.user);
    const messages = await handleGetMessages(profileId, req.user);
    res.send(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}


export { getMessages};
