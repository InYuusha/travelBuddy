const moment = require('moment')
exports.getTimeDiff = function(req,res,next){
    req.posts.forEach(post=>{
        let now =moment(new Date())
        let duration = moment.duration(now.diff(post.post_time))
        post.timeDiff = {

            dd:Math.floor(duration.asDays()),
            hh:Math.floor(duration.asHours()),
            mm:Math.floor(duration.asMinutes()),
            ss:Math.floor(duration.asSeconds())
            
        }
    })
    next()
}