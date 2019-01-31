import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip : args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        
        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },
    myposts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const opArgs = {
            first: args.first,
            skip : args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const opArgs = {
            first : args.first, 
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
        const opArgs = {
            first : args.first, 
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
        }
        return prisma.query.comments(opArgs, info)
    },
    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        
        return prisma.query.user({
            where: {
                id: userId
            }
        })
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }

        return posts[0]
    }
}

export { Query as default }



/*
import getUserId from '../utils/getUserId';

const Query = {
    // this is going to fetch users from the database
    //args is what we put back into the query
    //by passing info I dont need to write filtlers for users bcs prisma automatically does this
    users(parent, args, { prisma }, info) {
       
        //grabing data from database query, first argument is our, 2nd operation is our selection set
        //3 select set , nothing, string, object ()info object that is created for us- contains all of the information about the orignial operation)
        // we used string 
        //all of our mutations and resolvers we want to use info, we have a promise and we have to do something about it, 
        // this returns data from the database

        //were creating objects in order to pass to our primsa query
        const opArgs = {};
        //if args.query exists then were going to change what we want to get back
        //check if name and email is a match
    
        if(args.query) {
            opArgs.where = {
                //if the name contains that
               // name_contains: args.query
                //if email contains a string we look at graphql playground UserWhereInput AND:[UserWhereInput]
                //OR:[] it takes an array of objects, NOT
                
                //AND //filtering users if string contains 
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }
        //we are returning out selection arguments such as name, email, and it thhen moves on to our other function user.js
         return prisma.query.users( opArgs/*null*/ /*info);
        

       /*
        if (!args.query) {
            return db.users
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
        */
       /*
    },
    //only get posts that are published
    myposts (parent,args,{prisma,request}, info) {
        // Iw want to force authenciatin
        const userId = getUserId(request);
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }
        if(args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }
        return prisma.query.posts(opArgs,info)
    },
    posts(parent, args, {  prisma }, info) {
        //only get published posts
        const opArgs = {
            where : {
                published: true
            }
        };
///but if you choose to provide a query you will get this
        if(args.query) {
            opArgs.where.OR = [{
                    title_contains : args.query
                }, {
                    body_contains: args.query
                }]  
            
        }
        return prisma.query.posts(opArgs,info);
        
        /*
        if (!args.query) {
            return db.posts
        }

        return db.posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
            return isTitleMatch || isBodyMatch
        })
        */ /*
    },
    comments(parent, args, { prisma }, info) {
        //return db.comments
        return prisma.query.comments(null,info);
    },
    //this requires authentication
    me(parent, args,{prisma, request}, info) {
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId
            }
        })
        
        /*
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@example.com'
        }
        */
       /*
    },
    //were making sure authentication is aviable for user so we add userID as a requirment for schema, were going to make it a public query but only seend back published posts

  async post(parent,args, {prisma, request}, info) {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
        where: {
            id: args.id,
            OR: [{
                published: true
            }, {
                author: {
                    id: userId
                }
            }]
        }
    }, info)

    if (posts.length === 0) {
        throw new Error('Post not found')
    }

    return posts[0]
}    
    
    
    //this would throw an error if there is no authentication, so if there is a header give out token, if you require authentication which you don't then run 
        
        //singular post query has less options vs posts that has more options
        //were going to look at posts, when its published OR when userID is euqal to getUserId if authenticated, if null 
       


        /*
        return {
            id: '092',
            title: 'GraphQL 101',
            body: '',
            published: false
        }

        */
       /*
    
}

export { Query as default }
*/