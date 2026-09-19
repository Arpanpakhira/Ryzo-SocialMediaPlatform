import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const SocketProvider = ({ children, currentUser }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { [userId]: boolean }
  const [incomingCall, setIncomingCall] = useState(null); // { from_user_id, offer, call_type, caller_info }

  useEffect(() => {
    if (!currentUser?._id) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('⚡ Socket connected to server:', newSocket.id);
      newSocket.emit('register_user', currentUser._id);
    });

    newSocket.on('get_online_users', (users) => {
      setOnlineUsers(users);
    });

    newSocket.on('typing', ({ from_user_id }) => {
      setTypingUsers((prev) => ({ ...prev, [from_user_id]: true }));
    });

    newSocket.on('stop_typing', ({ from_user_id }) => {
      setTypingUsers((prev) => ({ ...prev, [from_user_id]: false }));
    });

    newSocket.on('incoming_call', (data) => {
      console.log('📞 Incoming call socket event:', data);
      setIncomingCall(data);
    });

    newSocket.on('call_ended', () => {
      setIncomingCall(null);
    });

    newSocket.on('call_rejected', () => {
      setIncomingCall(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?._id]);

  const emitTyping = (toUserId) => {
    if (socket && currentUser?._id) {
      socket.emit('typing', { from_user_id: currentUser._id, to_user_id: toUserId });
    }
  };

  const emitStopTyping = (toUserId) => {
    if (socket && currentUser?._id) {
      socket.emit('stop_typing', { from_user_id: currentUser._id, to_user_id: toUserId });
    }
  };

  const emitSendMessage = (messageData) => {
    if (socket) {
      socket.emit('send_message', messageData);
    }
  };

  const emitMarkSeen = (toUserId) => {
    if (socket && currentUser?._id) {
      socket.emit('mark_seen', { from_user_id: currentUser._id, to_user_id: toUserId });
    }
  };

  const emitReactMessage = (messageId, emoji, toUserId) => {
    if (socket && currentUser?._id) {
      socket.emit('react_message', {
        messageId,
        userId: currentUser._id,
        emoji,
        to_user_id: toUserId,
      });
    }
  };

  const emitCallUser = ({ toUserId, offer, callType, callerInfo }) => {
    if (socket) {
      socket.emit('call_user', {
        to_user_id: toUserId,
        offer,
        call_type: callType,
        caller_info: callerInfo,
      });
    }
  };

  const emitAnswerCall = ({ toUserId, answer }) => {
    if (socket) {
      socket.emit('answer_call', { to_user_id: toUserId, answer });
    }
  };

  const emitIceCandidate = ({ toUserId, candidate }) => {
    if (socket) {
      socket.emit('ice_candidate', { to_user_id: toUserId, candidate });
    }
  };

  const emitRejectCall = (toUserId) => {
    if (socket) {
      socket.emit('reject_call', { to_user_id: toUserId });
    }
    setIncomingCall(null);
  };

  const emitEndCall = (toUserId) => {
    if (socket) {
      socket.emit('end_call', { to_user_id: toUserId });
    }
    setIncomingCall(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingUsers,
        incomingCall,
        setIncomingCall,
        emitTyping,
        emitStopTyping,
        emitSendMessage,
        emitMarkSeen,
        emitReactMessage,
        emitCallUser,
        emitAnswerCall,
        emitIceCandidate,
        emitRejectCall,
        emitEndCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};


export const useSocket = () => useContext(SocketContext);
