const { ERROR } = require('./api/controllers/responses/code');
const chatService = require('./api/services/chats.service');
const jwtService = require('./api/services/jwt.service');
const userService = require('./api/services/users.service');

var sockets = {}

sockets.init = function (server) {
    var io = require('socket.io')(server);
    io.on('connection', function (client) {
        
        console.log('a user is online');

        client.on('test', (data) => {
            io.to(client.id).emit('send_message', client.id);
            // console.log(client.id);
        });

        client.on('initiate', async ({token}) => {
            try {
                console.log(jwtService.verify(token));

                // Verify token
                if (!jwtService.verify(token)) 
                    throw ERROR.TOKEN_IS_INVALID;
                const decoded_token = jwtService.decode(token);
                const user = await userService.findUserByPhoneNumber(decoded_token.payload.user);

                // Create socket session
                const tokenId = await chatService.attachSocket(user._id, client.id.toString());
                io.to(client.id).emit('action_success', {
                    action: 'initiate',
                    data: {tokenId: tokenId}
                });
            } catch (error) {
                console.error(error);
                io.to(client.id).emit('socket_error', error);
            }
        });

        client.on('join_conversation', async ({token, partner_id}) => {
            try {
                console.log(token, partner_id);
                if (!jwtService.verify(token))
                    throw ERROR.TOKEN_IS_INVALID;
                const decoded_token = jwtService.decode(token);
                const [user, partner] = await Promise.all([
                    userService.findUserByPhoneNumber(decoded_token.payload.user),
                    userService.findUserById(partner_id)
                ]);

                if (!user || !partner)
                    throw ERROR.PARAMETER_VALUE_IS_INVALID;
                
                // Find or create conversation
                let conversation = await chatService.findConversation(user._id, partner._id);
                if (!conversation) {
                    conversation = await chatService.createConversation({
                        user_id: user._id,
                        user_name: user.name ?? '',
                        partner_id: partner._id,
                        partner_name: partner.name ?? ''
                    });
                }

                // Emit conversation id
                io.to(client.id).emit('action_success', {
                    action: 'join_conversation',
                    data: {conversation_id: conversation._id}
                });
            } catch (error) {
                console.error(error);
                io.to(client.id).emit('socket_error', error);
            }
        })

        client.on('send_message', async ({token, partner_id, content}) => {
            try {
                if (!jwtService.verify(token))
                    throw ERROR.TOKEN_IS_INVALID;
                const decoded_token = jwtService.decode(token);
                const [user, partner] = await Promise.all([
                    userService.findUserByPhoneNumber(decoded_token.payload.user),
                    userService.findUserById(partner_id)
                ]);

                if (!user || !partner)
                    throw ERROR.PARAMETER_VALUE_IS_INVALID;

                const conversation = await chatService.findConversation(user._id, partner._id);

                if (!conversation)
                    throw ERROR.PARAMETER_VALUE_IS_INVALID;

                // Create message
                const newMessage = await chatService.createMessage(conversation._id, user._id, content);

                // console.log(partner._id);
                const sockets = await chatService.findActiveSockets(partner._id);
                // console.log(sockets);
                // Emit message to receiver
                sockets.map(sk => io.to(sk.socket_id).emit('receive_message', {
                    message_id: newMessage._id,
                    content: newMessage.content,
                    created_at: newMessage.created_at
                }))

                // Emit message_id to sender
                io.to(client.id).emit('action_success', {
                    action: 'send_message',
                    data: {
                        message_id: newMessage._id,
                        content: newMessage.content,
                        created_at: newMessage.created_at
                    }
                })
                
            } catch (error) {
                console.error(error);
                io.to(client.id).emit('socket_error', error);
            }
        });

        client.on('typing', ({conversation_id, sender_id, receiver_id}) => {
            try {
                // check sender socket

                // find receiver socket

                // emit to receiver
            } catch (error) {
                console.error(error);
                io.to(client.id).emit('socket_error', error);
            }
        });

        client.on('stop_typing', ({conversation_id, sender_id, receiver_id}) => {
            try {
                // check sender socket

                // find receiver socket

                // emit to receiver
            } catch (error) {
                console.error(error);
                io.to(client.id).emit('socket_error', error);
            }
        });

        client.on('disconnect', async () => {
            try {
                await chatService.detachSocket(client.id);
                console.log('a user disconnected');
            } catch (error) {
                console.error(error);
                io.to(client.id).emit('socket_error', error);
            }
        })
    });
    
    io.engine.on("connection_error", (err) => {
        console.log(err.req);      // the request object
        console.log(err.code);     // the error code, for example 1
        console.log(err.message);  // the error message, for example "Session ID unknown"
        console.log(err.context);  // some additional error context
    });
} 

module.exports = sockets;