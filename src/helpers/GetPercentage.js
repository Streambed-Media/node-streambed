const fs = require('fs');
const { getVideoDurationInSeconds } = require('get-video-duration');

class GetPercentage {
    constructor(path,percentage){
      this.path = path;
      this.percentage = percentage;
    }
    toTheHundreth (num) {
      console.log('to hundy ',num ,Math.round(num * 101) / 100)
  
      return Math.floor(num * 100 )/100;
    }
    seconds (num) {
  
      let format = this.toTheHundreth( num )
      let numString = format+''
  
      let isSingleDigit = /^.+\.\w{1}$/.test(numString)
      let addedColons = numString.split('.').join(':')
      console.log('addedColons ',addedColons)
      let timeString = isSingleDigit ? '00:00:0'+numString : '00:0'+addedColons
  
      return timeString
    }
  
    minutes (num) {
      console.log('minutes ', num)
      let roundNum = this.toTheHundreth(num)
      let numString = roundNum+''
      console.log('string',numString)
      let addedColons = numString.split('.').join(':')
      console.log(addedColons)
      //Checks true if only one digit for seconds 
      let isOfLength = /:.{1}$/.test(addedColons)
      let isWholeNumber = /^.{2}$/.test(numString)
      console.log('iswholenum ', isWholeNumber)
      console.log('isOfLength', isOfLength)
      if (isOfLength) {
        let correctTime = addedColons.split('')
        correctTime.splice(3,0,'0')
        let added = correctTime.join('')
        addedColons = added
  
      } else if ( isWholeNumber ) {
        addedColons = numString+':00'
  
      }
      let isSingleDigit = /^\w{1}\./.test(numString)
      let timeString = isSingleDigit ? '00:0'+addedColons : '00:'+addedColons
  
      //Final make sure the string is of the correct length
      let isCorrectLength = /^.{8}/.test(timeString)
      console.log('replaced',addedColons, timeString, isCorrectLength)
  
      if ( isCorrectLength ) {
        return timeString
      } else return ' timestring not configured right'
      
    }
    hours (num) {
      let getMinute = num - 60
      let getHour = num / 60
      let isSingleHour = /^.{1}\./.test(getHour)
      console.log(isSingleHour)
      console.log('format hour', getHour)
      console.log('get minutes', getMinute)
  
      console.log('hours',num)
      if ( isSingleHour ) {
        let format = ''+this.toTheHundreth(getHour)
        let split = format.split('.').join(':')
        console.log('formating', '0'+split+':00')
        return '0'+split+':00'
        
      } else {
        let format = ''+this.toTheHundreth(getHour)
        let split = format.split('.').join(':')
        
        console.log('formating double', split+':00')
        return split+':00'
      }
     
    }
    async fileDuration(path,percentage){
       // ffmpeg.ffprobe(path, (error, metadata) => {
      //   console.log(metadata)
        // const duration = metadata.format.duration;
         // console.log(duration);
      // });
      if(path) {
        const stream = fs.createReadStream(path)
        
        let time = await getVideoDurationInSeconds(stream).then((duration) => {
           console.log('full duration: ',duration)
           let difference =  duration * percentage / 100 
          // let difference =  30609 * percentage / 100 
           
           console.log('dif',difference)
          return difference
        })
  
        return time
      }
    }
  
    
  }

  module.exports = new GetPercentage()