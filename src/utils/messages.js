const createdAt = () => new Date().getTime();

const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: createdAt() 
    }
}

const generateLocatonMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: createdAt()
    }
}

module.exports = {
    generateMessage,
    generateLocatonMessage
};