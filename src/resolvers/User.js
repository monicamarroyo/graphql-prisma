import getUserId from '../utils/getUserId';

const User = {
    //its only going to run if user request email, we need to add support for fragments in prisma
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
    },
    
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false)

            if (userId && userId === parent.id) {
                return parent.email
            } else {
                return null
            }
        }
    }
   
}

    /*
 //this determines if we send back an email or not, only return it if your the user
    //underthe parent argument we have all the information such as email and user id of all users requested even if not authenticated
    email (parent, args, {request}, info) {
        //were not going to require user authentication, if false were going to return null no email but if user is authenticated then we will return email
    
        const userId = getUserId(request,false)
        //this only fetches the email for the current user who is authenicated, so if bob was logged in he would see his email but he wouldnt be able to get moni email
        //we are assuming that parent.id gets passed as into the field, if we forget the id, the email of the auntheticated person doesn't show up
        //were going to use a fragment to force prisma to get parent id even if user did not provide it on selection set

        if(userId && userId === parent.id) {
            return parent.email
        }
        else {
            return null
        }
        //console.log(parent);

    */

    //prisma has support for relational data like user to posts and user to comments so we dont have to filter through this
    /*

    posts(parent, args, { db }, info) {
        return db.posts.filter((post) => {
            return post.author === parent.id
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments.filter((comment) => {
            return comment.author === parent.id
        })
    }
    */


//}

export { User as default }