let env = 'www2';
if (process.env.NODE_ENV === 'production') {
    env = 'www';
}

let Constants = {
    API_URL_NET_INFO: `http://${env}.gameasy.com/ww-it/conf/info`
};

export default Constants;