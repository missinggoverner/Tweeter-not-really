let content = document.querySelector(".content");
let greeting = document.querySelector(".greeting");
let home =document.querySelector('#home')
let myPosts = document.querySelector('.my-posts');
let noPosts = document.querySelector('.no-posts');

let jwtToken = localStorage.getItem('token');
let user = localStorage.getItem('user');

let moment = require('moment');

// browserify UI/pages/home/app.js -o bundle.js

const placement = (posts) => {

            // Each post container
            let post = document.createElement("div");
            post.className = "post-container"; 
            content.appendChild(post);

            // Post Header
            let header = document.createElement("div");
            header.className = "header"; 
            post.appendChild(header);

            // User Name
            let user_name = document.createElement("div");
            user_name.className = "user-name"; 
            user_name.innerHTML = `By:@${posts.Post.user_name}`;
            header.appendChild(user_name);

            // Date
            let date = document.createElement("div");
            date.className = "date"; 
            date.innerHTML = `Posted ${moment(posts.Post.created_at).fromNow()}`;
            header.appendChild(date);

            // Post Title
            let title = document.createElement("div");
            title.className = "title"; 
            title.innerHTML = `<strong>${posts.Post.title}</strong>`;
            post.appendChild(title);

            // Post text
            let text = document.createElement("div");
            text.className = "text"; 
            text.innerHTML = posts.Post.content;
            post.appendChild(text); 

            // Vote Container
            let vote_container = document.createElement("div");
            vote_container.className = "vote-container"; 
            post.appendChild(vote_container);

            // Votes
            let votes = document.createElement("div");
            votes.className = "votes"; 
            votes.innerHTML = posts.votes;
            vote_container.appendChild(votes);

            // Vote Button
            let vote_button = document.createElement("button");
            vote_button.className = "vote-button"; 
            vote_container.appendChild(vote_button);

            // Vote icon
            let vote_icon = document.createElement("i");
            vote_icon.className = "fa-regular fa-heart"; 
            vote_button.appendChild(vote_icon);

}

const myPlacement = (posts) => { 

    // Loop through each post in the array
    posts.forEach(post => {
        // Each post container
        let postContainer = document.createElement("div");
        postContainer.className = "post-container"; 
        myPosts.appendChild(postContainer);

        // Post Header
        let header = document.createElement("div");
        header.className = "header"; 
        postContainer.appendChild(header);

        // Date
        let date = document.createElement("div");
        date.className = "date"; 
        date.innerHTML = `Posted ${moment(post.Post.created_at).fromNow()}`;
        header.appendChild(date);

        // Post Title
        let title = document.createElement("div");
        title.className = "title"; 
        title.innerHTML = `<strong>${post.Post.title}</strong>`;
        postContainer.appendChild(title);

        // Post text
        let text = document.createElement("div");
        text.className = "text"; 
        text.innerHTML = post.Post.content;
        postContainer.appendChild(text); 

        // Vote Container
        let vote_container = document.createElement("div");
        vote_container.className = "vote-container"; 
        postContainer.appendChild(vote_container);

        // Votes
        let votes = document.createElement("div");
        votes.className = "votes"; 
        votes.innerHTML = `Total Votes: ${post.votes}`;
        vote_container.appendChild(votes);
    });
}


greeting.innerHTML = `Hello ${user}, Welcome!`;
const getUserPosts = async () => {
    try {
        const response = await fetch('http://localhost:8000/posts/mine', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            },
        });
        if (response.ok) {
            const data = await response.json();
            if (data.length === 0) {
                console.log('No posts found');
                
            } else {
                document.querySelector('.no-posts').style.display = 'none';
                myPosts.innerHTML = '';
                console.log(data);
                myPlacement(data);
            }
        } 
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
getUserPosts();


home.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8000/posts/', {
            method: 'GET',
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error:', error.detail);
        } 
        const data = await response.json();
        console.log(data);
        greeting.style.display = 'none';
        content.innerHTML = '';
        data.forEach(posts => {
            placement(posts)
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }
}); 



const postNewPost = () => {
    return
}

const deletePost = () => {
    return
}

const editPost = () => {
    return
}



