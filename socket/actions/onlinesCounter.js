const 
  Redis = require('redis'),
  PubSub = require('../util/pubsub'),
  redis = Redis.createClient(),
  moment = require('moment'),
  Onlines = {}
  
let {
  ONLINES_INITIAL,
  USERS_ONLINE,
  ONLINES_TOTAL_LIST,
  ONLINES_LIST,
  ONLINE_VISITORS,
  ONLINE_VISITORS_INITIAL,
  ONLINES_TOTAL_VISI_LIST
} = require('./actionTypes');

redis.on('ready',()=>{ 
    redis.config('SET',"notify-keyspace-events","E$s") 
})

PubSub.subscribe("__keyevent@0__:sadd")
PubSub.subscribe("__keyevent@0__:incrby")
PubSub.subscribe("__keyevent@0__:hset")

Onlines.users =(socket)=> {
  const Day                 = moment().format('YYYY/MM/D'),
    online_Users_List       = `online:users:list:${Day}`,
    online_Users_Total_List = 'online:users:TList',
    online_Users_Count      = 'online:users:count';

  // online counter
  PubSub.on("message", (channel, message) => {
    if (message === online_Users_Count) {
      redis.get(message, (err, reply) => { 
        socket.emit(USERS_ONLINE,{onlinesCount:+reply}) 
      })
    }

    if(message === online_Users_List){
      redis.hincrby( online_Users_Total_List , Day , 1 ,(err,result)=>{
        redis.hgetall(online_Users_Total_List,(err,reply)=>{
          socket.emit(ONLINES_TOTAL_LIST,reply)
        })
      })
    }
  })
  // initial count
  redis.get(online_Users_Count,(err,reply)=>{
      socket.emit(ONLINES_INITIAL,{onlinesCount:+reply})
  })

  // Users Online List Per Day
  redis.scard( online_Users_List ,(err,reply)=>{
      socket.emit(ONLINES_LIST,{onlinesListCount:+reply})
  })

  //users online list initial numbers
  redis.hgetall(online_Users_Total_List,(err,reply)=>{
    socket.emit(ONLINES_TOTAL_LIST,reply)
  })
}

Onlines.visitors = (socket)=> {

  const Day                    = moment().format('YYYY/MM/D'),
    online_Visitors            = 'online:count',
    online_Visitors_List       = `online:visitors:Clist:${Day}`,
    online_Visitors_Total_List = 'online:visitors:TList';

  PubSub.on("message", async (channel, message) => {
    console.log(message)
    if(message === online_Visitors){
      redis.get(online_Visitors,(err,reply)=>{
        socket.emit(ONLINE_VISITORS,{onlinesCount:reply})
      })
    }
    
    if(message === online_Visitors_List){
      redis.hincrby( online_Visitors_Total_List , Day , 1 ,(err,result)=>{
        redis.hgetall(online_Visitors_Total_List,(err,reply)=>{
          socket.emit(ONLINES_TOTAL_VISI_LIST,reply)
        })
      })
    }
  })
  redis.get(online_Visitors,(err,reply)=>{
    socket.emit(ONLINE_VISITORS_INITIAL,{onlinesCount:reply})
  })
}


module.exports=Onlines;