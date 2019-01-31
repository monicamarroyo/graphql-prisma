


const Post = {
//removing this lets primsa use the info object in order to get author args 
    /*
    author(parent, args, { db }, info) {
        return db.users.find((user) => {
            return user.id === parent.author
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.post === parent.id
        })
    }
    */
}

export { Post as default }