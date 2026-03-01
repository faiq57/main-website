const articles = document.getElementsByTagName('article')

const addNewComment = async (author, content, articleID) => {
    const request = new Request("https://blog-data.phaeiq.com/comments", {
        method: "POST",
        body: JSON.stringify({
            'author': author,
            'content': content
        })
    })
    const response = await fetch(request)
}

const createCommentCollection = async () => {
    const request = new Request("https://blog-data.phaeiq.com/comments", {
    method: "GET",
    });

    const response = await fetch(request)
    if (!response.ok) {
        console.log("problem")
    }
    const comments = await response.json()
    console.log(comments)

    let commentCollection = document.createElement('div')
    commentCollection.classList.add('comment-collection')
    for (const comment of comments) {
        let newComment = document.createElement('div')
        newComment.classList.add('comment')

        let commentMeta = document.createElement('div')
        commentMeta.classList.add('comment-metadata')

        let commentAuthor = document.createElement('div')
        commentAuthor.innerText = comment.author
        commentMeta.appendChild(commentAuthor)
        let commentTime = document.createElement('div')

        const time = new Date(comment.timestamp + "Z")
        console.log(time)
        commentTime.innerText = time.toLocaleString()
        commentMeta.appendChild(commentTime)

        newComment.appendChild(commentMeta)

        let commentContent = document.createElement('div')
        commentContent.innerText = comment.content
        newComment.appendChild(commentContent)

        commentCollection.appendChild(newComment)
    }

    return commentCollection
}

for (let article of articles) {
    // Made a comment section
    let newCommentSection = document.createElement('div')
    newCommentSection.classList.add('comments-section')

    // Added a header for the comment section
    let commentHeader = document.createElement('h3')
    commentHeader.innerText = 'Comments'
    newCommentSection.appendChild(commentHeader)

    // *NOT FULLY IMPLEMENTED* textbox for posting comments
    let commentBox = document.createElement('div')
    commentBox.classList.add('comment-box')
    let nameLable = document.createElement('label')
    nameLable.innerText = 'Name: '
    commentBox.appendChild(nameLable)
    let commentAuthorWriter = document.createElement('input')
    commentAuthorWriter.type = 'text'
    nameLable.appendChild(commentAuthorWriter)
    let commentWriter = document.createElement('textarea')
    commentWriter.placeholder = 'Write your comment here'
    commentBox.appendChild(commentWriter)
    let commentSubmitButton = document.createElement('button')
    commentSubmitButton.innerText = 'Submit comment'
    commentSubmitButton.onclick = async () => {
        addNewComment(commentAuthorWriter.value, commentWriter.value, 0)
        // *MUST BE EDITED LATER*
        document.getElementsByClassName('comment-collection')[0].remove()
        const commentSection = document.getElementsByClassName('comments-section')[0]
        commentSection.appendChild(await createCommentCollection())
    }
    commentBox.appendChild(commentSubmitButton)
    newCommentSection.appendChild(commentBox)

    // Append all the relevant (not yet) comments
    newCommentSection.appendChild(await createCommentCollection())

    article.appendChild(newCommentSection)
}