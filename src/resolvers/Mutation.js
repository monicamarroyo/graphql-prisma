import bcrypt from 'bcryptjs'
//import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import HashPassword from '../utils/hashPassword'
const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        

        const password = await HashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
            user,
            token: generateToken(user.id)
        }
    },
    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        //update the password if you change it
        if(typeof args.data.password === 'string') {
            args.data.password = await HashPassword(args.data.password)
        }
        
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to delete post')
        }
        
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
    
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        const isPublished = await prisma.exists.Post({id:args.id, published: true})


        if (!postExists) {
            throw new Error('Unable to update post')
        }
        //if its published then its not publisehd delte all comments
        if(isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    async createComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        //check if posts exists
        const postsExists = await prisma.exists.Post({
            id: args.data.post,
            published:true
        })
        if(!postsExists) {
            throw new Error('Unable to find post')
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to update comment')
        }

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }


//import bycrypt from 'bcryptjs';
//import jwt from 'jsonwebtoken';
//import getUserId from '../utils/getUserId';

//import uuidv4 from 'uuid/v4'

// Take in passowrd -> Validate password --> HashPassword --> Generate auth token(signup, and login operation)
//takin in password change schema and CreateUsser input --> and provide access to password:STRING!
//bycrypt installed for password hashing
//understading how jwt work
//create a new token---> really long string (object**payload information for our specific purposes(users id)secret** to verfity the intregrity of the token its g(oing to live on the node js server), we need to associate a specific token for a user using there ID
//mysercert is going to be an enviorment variable
//the payload is not to be meant to be encrypted, its supposed to be visiable
//if someone creates a user with a diffrent secret its going to fail, it all comes back to the secret
/*
 const token = jwt.sign({id:46},"my");
 console.log(token);

 const decode = jwt.decode(token);
 console.log(decode);
// if the token not created with the same sercert it going to fail
 const decode2 = jwt.verify(token,"my");
 console.log(decode2);
 */
//this is to get our password and compare it to the hashed password

/*
const dummy = async () => {
    const email = 'bob@gmail.com';
    const password = 'red12345';
    const hashed= '$2a$10$shpth7ZSsOuZLcb2rhMKbe8C5xT3wV/fpUGYAkZ2p2hZgmQJqpI/u';
    //how to compare the two its true or false
    const isMatch = await bycrypt.compare(password,hashed);
    console.log(isMatch);
}
dummy();
*/

//const Mutation = {
    //createUser to from working from array to working with the database
  //   async createUser(parent, args, { prisma /*db */}, info) {
      // check to see if user exists
      //dont need this check since prisma does it for us
      /*
      

      const emailTaken = await prisma.exists.User({email: args.data.email}) 
       
        if(emailTaken) {
            throw new Error('Email is taken')
        }
        */
        //check its length
        //JSON web token(jWT) installing a library that 
    //    if(args.data.password.length < 8) {
      //      throw new Error("Password must be 8 characters or longer");
       // }
        //132passs ---> asdkflakdsf12341234sdfs were going to store the hashed version, 
        //we send the password, and a salt
       // const password = await bycrypt.hash(args.data.password,10);
        //if email not taken create the user, the clinet makes a request to the node.js api and passes the nesseciary requirements it needs
        //args.data is going to have a name and email, which passes that through prisma that also requires that 
        //info insures whatever selection set, it comes back like id, name title

        //were not going to return user anymore
         /*return *///const user=  prisma.mutation.createUser({
           // data: {
                //we want to use the exisiting args data but set password to our hashed password
             //   ...args.data ,
               // password: password
            //}
         //}/*info gets removed */);
        //since now we are return an user and JWT toekn we have to change out schema to represent this
        /*
        type AuthPayload {
        token: String!
        user: User!  
        }, change createuser to now return AUthPaload
        */
       /*
        return {
            user,
            token: jwt.sign({userId:user.id}, "mys")
        }
       
        /*
        const emailTaken = db.users.some((user) => user.email === args.data.email)

        if (emailTaken) {
            throw new Error('Email taken')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)

        return user
        */
    //    },
    /*
    async login (parent,args,{prisma},info) {
        //finding the user by there email
        const user = await prisma.query.user ({
            where: {
                email: args.data.email
            }
        })
        if(!user) {
            throw new Error('Unable to login');
        }
        const isMatch = await bycrypt.compare(args.data.password, user.password);
        if(!isMatch) {
            throw new Error('Unable to login');
        }
        //we have to return user and token for our payload
        return {
            user,
            token: jwt.sign({userId:user.id}, 'mys')
        }
    },
   async  deleteUser(parent, args, { prisma, request }, info) {
    //we delete the userID from schema we can only delete ourself

    const userId = getUserId(request);
    //check if user exists
    /*
    const userExists = await prisma.exists.User({id:args.id});
    //if no user throw error

    if(!userExists) {
        throw new Error('User not found');
    }
    */
    //if user found
    //were going to delete them by id, the posts and comments are going to get deleted bcs we have the relationship between them already provided and primsa takes care of that
   /*
    return prisma.mutation.deleteUser({
        where: {
            id: userId
        }
    }, info);
    
    
    /*
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error('User not found')
        }

        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id

            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }

            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]
   
   
        */
       /*
    },
     async updateUser(parent, args, { prisma , request}, info) {
        
       //were going to start with going straight to prisma
       //were returning the data the user was expecting such as name email ect
       //we can only change outsiefl and update ourself hence we remove userID as requered in schema
       const userId = getUserId(request);
      return prisma.mutation.updateUser({
           where: {
               id: userId
           },
           //we dont have to provide the args seperatly since primsa requries the same arguments 
           data : args.data
       } ,info);

        /*
        
        const { id, data } = args
        const user = db.users.find((user) => user.id === id)

        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)

            if (emailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
        */
      /* 
    },
    createPost(parent, args, { prisma,request }, info) {
    //get the header value, parse out te token, verfiy
    //header value is the authoriszation token that is apssed in index.js as request
    //this function takes care of getting this token
    //now we have the userId
    const userId = getUserId(request)

    return prisma.mutation.createPost({
        //we have to change schema in order to represent userID that has now been vefired 
        data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
                connect: {
                    id: userId/* args.data.author since we have the authenticated userID*/
        //        }
          //  }
        //}
    //}, info);
  /*
        const userExists = db.users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        if (args.data.published) {
            pubsub.publish('post', { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
             })
        }

        return post
        */
       /*
    },
    async deletePost(parent, args, { prisma, request }, info) {

    //we want to take userID, we only want to delete a post when the userID matches the postID, delete posts doesnt accept any arguments on where
    const userId = getUserId(request);
    //we gotta see if the userexits and is the post author
    //making a prisma request to see if posts exists with the args.id and author with userID
    const postExists = await prisma.exists.Post({
        id: args.id,
        author : {
            id:userId
        }
    });
    if(!postExists) {
        throw new Error('Unable to delete post');
    }

    return prisma.mutation.deletePost({
        where: {
            id: args.id
        }
    },info);  
        
        
        /*
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('Post not found')
        }

        const [post] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
   
        */
       /*
    },
  async  updatePost(parent, args, { prisma, request}, info) {
        const userId = getUserId(request);
        //if posts exists

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if(!postExists) {
            throw new Error('Unable to update post');

        }
        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        },info)
        
        
        /*
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ...post }

        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
        */
       /*
    },
     createComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request);
       return prisma.mutation.createComment({
        data : {
            text: args.data.text,
            author: {
                connect: {
                    id: userId
                }
            },
            post: {
                connect: {
                    id: args.data.post
                }
            }
        }
       },info)
        /*
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
        */
       /*
    },
   async deleteComment(parent, args, { prisma, request }, info) {
       const userId = getUserId(request);
    //make sure it exists
    const commentExists = prisma.exists.Comment({
        id: args.id,
        author : {
            id: userId
        }
    })

    if(!commentExists) {
        throw new Error('unable to delete comment');
    }
        return prisma.mutation.deleteComment({
            where : {
                id: args.id
            }

        },info);
        /*
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }

        const [deletedComment] = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
        */
       /*
    },
   async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    //make sure it exists
    const commentExists = prisma.exists.Comment({
        id: args.id,
        author : {
            id: userId
        }
    })

    if(!commentExists) {
        throw new Error('unable to update comment');
    }    


        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        },info)
        /*
        const { id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)

        if (!comment) {
            throw new Error('Comment not found')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
        */
       /*
    }
    
}

export { Mutation as default }

*/