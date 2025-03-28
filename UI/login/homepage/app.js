
let content = document.querySelector(".content");


document.querySelector('#home').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8000/posts/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error:', error.detail);
        } 
            const data = await response.json();
            console.log(data)

            data.forEach(posts => {
                let post = document.createElement("div");
                post.className = "post"; 
                content.appendChild(post);
    
                // Post ID
                let id = document.createElement("div");
                id.className = "id"; 
                id.innerHTML = `ID: ${posts.Post.id}`;
                post.appendChild(id);
    
                // Post Title
                let title = document.createElement("div");
                title.className = "title"; 
                title.innerHTML = `<strong>${posts.Post.title}</strong>`;
                post.appendChild(title);
    
                // Post Content
                let text = document.createElement("div");
                text.className = "text"; 
                text.innerHTML = posts.Post.content;
                post.appendChild(text);
    
                // User Name
                let user_name = document.createElement("div");
                user_name.className = "user_name"; 
                user_name.innerHTML = `By: ${posts.Post.user_name}`;
                post.appendChild(user_name);
    
                let vo = document.createElement("div");
                vo.className = "vo"; 
                post.appendChild(vo);
    
                let totalVotes = document.createElement("div");
                totalVotes.className = "totalVotes"; 
                totalVotes.innerHTML = `Votes: ${posts.votes}`;
                vo.appendChild(totalVotes);
    
                let vote = document.createElement("div");
                vote.className = "vote"; 
                vo.appendChild(vote);
    
                let btn = document.createElement("button");
                btn.className = "btn"; 
                btn.innerHTML = "Vote";
                btn.addEventListener("click", () => {
                    alert(`You voted for: ${posts.Post.title}`);
                });
                vote.appendChild(btn);
            });

    } catch (error) { // This handles any errors that occur outside of the HTTP response (e.g., network issues).
        console.error('Fetch error:', error);
    }

});
