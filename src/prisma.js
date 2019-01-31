import {Prisma} from 'prisma-binding';
import { fragmentReplacements} from './resolvers/index';
//creating connection - we call consturctor object with new operator 

const prisma = new Prisma ({
    typeDefs: 'src/generated/prisma.graphql',
    //using an enviorment variable instead of hardcoding endpoing
    //http://localhost:4466
    endpoint: process.env.PRIMSA_ENDPOINT,
    //using this allows for authentication or permission in order to access prisma database
    //do not change this cause will fail its under primsa yml
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
    
})

//so we can use prisma in other files
export {prisma as default};


// async callbacks, promises, async/await


//four key properties 
//prisma.query, prisma.mu.ation prisma.subscription prisma.exists 
//the method name matches exactly with the query name
//query getting data
//first argument what were passing which is nothing next is ehat we want to select
//whhat comes back is a promise, is an aysnc function and it takes time to get back, were going to wait for this promise to resolve by .then
/*
prisma.query.users(null, '{id name email posts {id title }}').then((data) => {

   // console.log(data);
   //change to JSON.stringfy
   console.log(JSON.stringify(data,undefined,4));
})

prisma.query.comments(null, '{id text author {id name}}').then((data) => {
    console.log(JSON.stringify(data,undefined,4));
})
*/

//creating a post 
/*
prisma.mutation.createPost( {
    data: {
        title: "My new graphql post is live!",
        body: "you can find the new course here",
        published: true, 
        author: {
            connect: {
                id: "cjr0up8vs00190709aeknl96j"
            }
        }
    }
}, '{id title body published}').then((data) => {
    console.log(JSON.stringify(data,undefined,4));
    //our then reutrns tiis and therefore we have another promise and then
    return prisma.query.users(null, '{id name posts {id title}}')
}).then((data) => {
    console.log(JSON.stringify(data,undefined,4));
})

*/
/*
prisma.mutation.updatePost({
    where: {
        id: "cjr16mvba003s0709jkajhy9m"
    },
    data: {
        body: "this is how it gets started",
        title: "changing the post"
    
    }
},'{id}').then((data) => {
    return prisma.query.posts(null, '{id title body published}')
}).then((data) => {
    console.log(JSON.stringify(data, undefined,4));
})

*/

//checking if user exists
//we want to check if that value exists for that ID

/*
prisma.exists.Comment({
    //checking to seee if a comment with that id and created by that author exists
    id: "cjr0wdbo500310709k84a4m9h",
    author: {
        id: "cjr0up8vs00190709aeknl96j"
    }
}).then((exists) => {
    console.log(exists);
    //check if the comments text is equal to something
})

//create a new post
//fetch all of the info about the user (author)
//we pass it the data object that contains text, title, body and ect, and we also pass it the author's id
const createPostUser = async (authorId, data ) => {
    //this stores the data that gets sent back from the function createPostUser
    //were going to await the data its like a promiseer
    //were going to verfiy if the user exists

    const userExists = await prisma.exists.User ({id: authorId})
    //if no user was found throw a new error

    if(!userExists) {
        throw new Error('User not found')
    }

    const post = await prisma.mutation.createPost( {
        data: {
            //this is going to spread out all the data id,published,title ect
            ...data,
            author: {
                connect: {
                    id: authorId
                }
            }
        }
        //we can get data from the user 
    }, '{author {id name email posts {id title published body}} }')
    //the function  returns a user where its user id is that 
    
   

    return post.author
}


//we can call create post and use the function above just provide those arugments the authors id so user id, and data of of the post and ir returns back a user and we have a promise which prints it to the screen
/*
createPostUser('cjr0w00fi002r0709tv1gv8x3', {
    title: "great books to read",
    body : "the war of art",
    published: true
}).then((user) => {
    console.log(JSON.stringify(user, undefined,2))
}).catch((error) => {
    console.log(error)
})
*/



//we have to use exists to verfiy is this post exists
/*
const updatePostForUser = async (postId, data) => {
    //check if post Exists
    const postExists = await prisma.exists.Post({id:postId});

    //if there is not post that exists
    if(!postExists) {
        throw new Error('Post not found')
    }
    //everything runs if there is a post
    const post = await prisma.mutation.updatePost({
        where: {
            id: postId
        }, 
        data
    }, '{ author { id  name email posts {id title published}} }')
/*
    const user = await prisma.query.user({
        where: {
            id: post.author.id
        }
    }, '{id name email posts {id title published}}')
    return user
    */
   //contains the exact same information as user
  // return post.author
//}
/*
updatePostForUser("cjr0vpzcp00230709c4fx81r", {published: false}).then((user) => {
    console.log(JSON.stringify(user,undefined,2))
}).catch((error) => {
    console.log(error.message)
})
*/