import getUserId from '../utils/getUserId'

const Subscription = {
    comment: {
        subscribe(parent, { postId }, { prisma }, info){
            //we have a comment based subscription, prisma already knows when the code is changing, why its useless
            //when data flows it from prisma --->node--->client(graphql, playground)
            //we loose data not all of the data is getting to the client
             //prims has a node field and graphql doesnt so we need to match those fields so we change the subscriptiopnpayload in schema to data tp node
            return prisma.subscription.comment({
                //allow to subscrite to comments for a specfic post, this bascially keeps track whenever a comment is created on a specific post
                where: {
                    node: {
                        post: {
                            id:postId
                        }
                    }
                }
            },info)
            /*
            const post = db.posts.find((post) => post.id === postId && post.published)

            if (!post) {
                throw new Error('Post not found')
            }

            return pubsub.asyncIterator(`comment ${postId}`)
            */
        }
        
    },
    post: {
        subscribe(parent, args, { prisma }, info) {
           //we only get notified for posts that are published if user creates a post and its not published we dont get notified
           return prisma.subscription.post({
            where: {
             node: {
                 published: true
             }
            }
           },info)
           
            // return pubsub.asyncIterator('post')
        }
    },
    //allowing authenticated users to subscriet to there posts
    myposts: {
        subscribe(parent, args, { prisma, request }, info) {
            const userId = getUserId(request)

            return prisma.subscription.post({
                where: {
                    node: {
                        author: {
                            id: userId
                        }
                    }
                }
            }, info)
        }
    }
   
}

export { Subscription as default }