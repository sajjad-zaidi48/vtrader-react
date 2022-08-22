import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Subscribe from  './orderSubscribe'

const socketConnect = io();
let token = localStorage.getItem('api_access_token');
let socket = new WebSocket('ws://173.255.116.184:8002/transactionalws?access_token='+token);
socket.close()
function  SocketConnecter({handleData}) {
 
  console.log(token)

  let orderSubscribe = () => {
    axios.get('http://173.255.116.184:8002/int/ord/api/subscription/orders/subscribe',{
      headers: { Authorization: `Bearer ${token}` }
    })
  .then(function(response){
     console.log('subscribe response' , response)
   })

  .catch(err => console.log('checking in socket onOpen' , err));
     
  }

  useEffect(() => {
    
    console.log('checking socket' , socket.readyState)

    if (socket.readyState === 3 && localStorage.getItem('api_access_token')) {
         socket = new WebSocket('ws://173.255.116.184:8002/transactionalws?access_token='+token);         
    }
    
    socket.onopen = function() {
        console.log('Connected')
        // Subscribe()
         
    }

    socket.onmessage = function(msg) {
        const data = JSON.parse(msg.data)
        console.log(data) 
        if (data.method === 'Orders'){
            console.log('checking data in socket',data.data)
            handleData(data)
            // emitter.$emit('ordersSubscribeEvent', data)
        }     
    }

    socket.onclose = function(e) {
        console.log('disconnected . Reconnect will be attempted in 5 second.', e.reason)
        if (localStorage.getItem('api_access_token')){
            setTimeout(function() {
               
            }, 5000)
        }
    }

    socket.onerror = function(err) {
        console.log('Socket', err)
    }


    // socket.onopen = function() {
    //     console.log('Connected')
    //     let  token  = localStorage.getItem("api_access_token")
    //     axios.get('http://173.255.116.184:8002/int/ord/api/subscription/orders/subscribe',{
    //         headers: { Authorization: `Bearer ${token}` }
    //       })
    //     .then(function(response){
    //        console.log(response)

    //      })
    //     .catch(err => console.log('checking in socket onOpen' , err));
         

    // }
    

    

    return () => {
    };
  }, []);

  
 

  return (
    <div>
     
    </div>
  );
}

export default SocketConnecter;