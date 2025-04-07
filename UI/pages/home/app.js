let content = document.querySelector(".content");
let greeting = document.querySelector(".greeting");
let myPosts = document.querySelector('.my-posts');
let post = document.querySelector('.post');
let newPost = document.querySelector('.new-post')
let extraPosts = document.querySelector('.post-container');

let newPostTitle = document.querySelector('.new-post-title');
let newPostContent = document.querySelector('.new-post-content');
let newPostBtn = document.querySelector('.post-button');
let cancelBtn = document.querySelector('.cancel-button');


let noPosts = document.querySelector('.no-posts');
let update = document.querySelector('.update');
let del = document.querySelector('.delete');


let jwtToken = localStorage.getItem('token');
let user = localStorage.getItem('user');

let moment = require('moment');

// browserify UI/pages/home/app.js -o bundle.js
// npm run watch
// npm run dev

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
    user_name.innerHTML = `@${posts.Post.user_name}`;
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

    // Voteup
    let voteup = document.createElement("button");
    voteup.className = "voteup vote-button";
    vote_container.appendChild(voteup);

    // Votedown
    let votedown = document.createElement("button");
    votedown.className = "votedown vote-button";
    vote_container.appendChild(votedown);

    // id
    let id = document.createElement("div");
    id.className = "id";
    id.innerHTML = posts.Post.id;
    vote_container.appendChild(id);

    // Vote icon
    let vote_icon = document.createElement("i");
    vote_icon.className = "fa-regular fa-heart";
    voteup.appendChild(vote_icon);

    // Vote icon2
    let vote_icon2 = document.createElement("i");
    vote_icon2.className = "fa-solid fa-heart-crack";
    votedown.appendChild(vote_icon2);

    voteup.addEventListener('click', async () => {
        console.log('clicked');
        const postId = id.innerHTML;
        const sendData = {
            post_id: postId,
            dir: 1
        }
        try {
            const response = await fetch('http://localhost:8000/vote/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(sendData)
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('Error:', error.detail);
            }
            if (response.ok) {
                content.innerHTML = '';
                homePage()
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    });

    votedown.addEventListener('click', async () => {
        console.log('clicked');
        const postId = id.innerHTML;
        const sendData = {
            post_id: postId,
            dir: 0
        }
        try {
            const response = await fetch('http://localhost:8000/vote/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(sendData)
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('Error:', error.detail);
            }
            if (response.ok) {
                content.innerHTML = '';
                homePage()
            }

        } catch (error) {
            console.error('Fetch error:', error);
        }
    });
}

let delButton = false;
let updateButton = false;

const myPlacement = (posts) => {

    // Loop through each post in the array
    posts.forEach(post => {

        // Each post container
        let myPost = document.createElement("div");
        myPost.className = "my-post-container";
        extraPosts.appendChild(myPost);

        // Post Header
        let header = document.createElement("div");
        header.className = "header";
        myPost.appendChild(header);

        // Date
        let date = document.createElement("div");
        date.className = "date";
        date.innerHTML = `Posted ${moment(post.Post.created_at).fromNow()}`;
        header.appendChild(date);

        // Post Title
        let title = document.createElement("div");
        title.className = "title";
        title.innerHTML = `<strong>${post.Post.title}</strong>`;
        myPost.appendChild(title);

        // Post text
        let text = document.createElement("div");
        text.className = "text";
        text.innerHTML = post.Post.content;
        myPost.appendChild(text);

        // Vote Container
        let vote_container = document.createElement("div");
        vote_container.className = "vote-container";
        myPost.appendChild(vote_container);

        // Votes
        let votes = document.createElement("div");
        votes.className = "votes";
        votes.innerHTML = `Total Votes: ${post.votes}`;
        vote_container.appendChild(votes);

        if (delButton) {
            let delBtn = document.createElement('button');
            delBtn.className = 'delete-btn';
            delBtn.innerHTML = 'Delete';
            myPost.appendChild(delBtn);
            delBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`http://localhost:8000/posts/${post.Post.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${jwtToken}`
                        }
                    })
                    console.log(response);
                    if (!response.ok) {
                        const error = await response.json();
                        console.error('Error:', error.detail);
                    }
                    if (response.ok) {
                        content.innerHTML = '';
                        extraPosts.innerHTML = '';
                        homePage()
                        getUserPosts()
                        delButton = false;
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                }

            })
        }
        if (updateButton === true) {
            let updateBtn = document.createElement('button');
            updateBtn.className = 'update-btn';
            updateBtn.innerHTML = 'Update';
            myPost.appendChild(updateBtn);

            updateBtn.addEventListener('click', () => {
                let oldTitle = post.Post.title;
                let oldContent = post.Post.content;

                let newTitle = document.createElement('input');
                newTitle.className = 'update-title new-post-title';
                newTitle.value = oldTitle;

                let newContent = document.createElement('textarea')
                newContent.className = 'update-text  new-post-content';
                newContent.value = oldContent;

                title.parentNode.replaceChild(newTitle, title);
                text.parentNode.replaceChild(newContent, text);

                let updateCheck = document.createElement('button');
                updateCheck.className = 'update-check';
                updateCheck.innerHTML = 'Check'

                let updateCancel = document.createElement('button')
                updateCancel.className = 'update-cancel';
                updateCancel.innerHTML = 'Cancel'

                myPost.append(updateCheck, updateCancel)
                updateBtn.remove()

                updateCancel.addEventListener('click', () => {
                    extraPosts.innerHTML = '';
                    getUserPosts()
                })
                updateCheck.addEventListener('click', async () => {

                    let sendData = {
                        title: newTitle.value,
                        content: newContent.value
                    }
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/posts/${post.Post.id}`, {
                            method: "PUT",
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${jwtToken}`
                            },
                            body: JSON.stringify(sendData)
                        });

                        if (!response.ok) {
                            let answer = response.json;
                            console.log("error:", answer);
                        }
                        if (response.ok) {
                            updateButton = false;
                            content.innerHTML = '';
                            extraPosts.innerHTML = '';
                            homePage()
                            getUserPosts()
                        }
                    } catch (error) {
                        console.error("Error:", error)
                    }
                })
            })
        }
    });
}



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
                extraPosts.innerHTML = '';

            } else {
                document.querySelector('.no-posts').style.display = 'none';
                console.log(data);
                content.innerHTML = '';
                extraPosts.innerHTML = '';
                homePage();
                myPlacement(data);
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
getUserPosts();


const homePage = async () => {
    greeting.innerHTML = `Hello ${user}, Welcome!`;
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
        content.innerHTML = '';
        data.forEach(posts => {
            placement(posts)
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

homePage();

cancelBtn.addEventListener('click', () => {
    newPost.style.display = 'none';
    newPostTitle.value = '';
    newPostContent.value = '';
})

newPostBtn.addEventListener('click', async () => {
    if (newPostTitle.value.trim() === '') {
        newPostTitle.value = "Can't be Empty";
    } else if (newPostContent.value.trim() === '') {
        newPostContent.value = "Can't be Empty";
    }
    else {
        const sendData = {
            title: newPostTitle.value,
            content: newPostContent.value
        }
        try {
            const response = await fetch('http://localhost:8000/posts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(sendData)
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('Error:', error.detail);
            }
            if (response.ok) {
                content.innerHTML = '';
                content.innerHTML = '';
                homePage()
                getUserPosts()
                newPost.style.display = 'none';
                newPostTitle.value = '';
                newPostContent.value = '';
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
});

post.addEventListener('click', () => {
    noPosts.style.display = 'none';
    newPost.style.display = 'flex';
})

del.addEventListener('click', () => {
    console.log(delButton);
    if (delButton === false) {
        delButton = true;
        getUserPosts();
    } else {
        delButton = false;
        getUserPosts();
    }
})

update.addEventListener('click', () => {
    if (updateButton === false) {
        updateButton = true;
        getUserPosts();
    } else {
        updateButton = false;
        getUserPosts();
    }
})


