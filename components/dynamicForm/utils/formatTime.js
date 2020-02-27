const formatTime = date => {
  if (!date) {
    date = new Date();
  }
  if(typeof date === 'string'){
    date = new Date(date);
    if(!date){
      date = new Date(date.replace(/-/g, '/'));//兼容IOS new Date()
    }
  }
  if(typeof date === 'number'){
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

export default formatTime;
