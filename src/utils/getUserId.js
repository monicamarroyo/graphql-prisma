import jwt from 'jsonwebtoken'
//function for getting toekn from request
//you can pass true, were going to throw an error if your not authenciated, if we have false were going to throw an error and doesnt return userID
const getUserId = (request, requireAuth = true) => {
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

    
    //if there was a header then remove the bearer
    //we need to take out the bearer and the space out of authorization
    //for subscritption it uses web sockets therefore, the information lives here 
    
    if (header) {
        const token = header.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisisasecret')
        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    } 
    
    return null
   
}

export { getUserId as default }
