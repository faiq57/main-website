const addNewComment = async (author, content, postId) => {
    const request = new Request("https://blog-data.phaeiq.com/comments", {
        method: "POST",
        body: JSON.stringify({
            'author': author,
            'content': content,
            'postId': postId
        })
    })
    const response = await fetch(request)
}

const createCommentCollection = async (postId) => {
    const request = new Request("https://blog-data.phaeiq.com/comments/" + postId.toString(), {
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

const mainContentContainer = document.getElementById('main-content-container')

const request = new Request("https://blog-data.phaeiq.com/posts", {
    method: "GET",
})

const response = await fetch(request)
if (!response.ok) {
    console.log("posts aren't loading, something is wrong")
}
const posts = await response.json()

const artIds = []

for (let post of posts) {
    console.log(post)
    let article = document.createElement('article')
    article.id = 'article-' + post.id.toString()

    // Put title in
    let postTitle = document.createElement('h2')
    postTitle.innerText = post.title
    article.appendChild(postTitle)

    let authorTimeLine = document.createElement('div')
    authorTimeLine.classList.add('author-time-line')

    // Put author name in
    let authorLine = document.createElement('div')
    authorLine.innerText = 'By ' + post.author
    authorTimeLine.appendChild(authorLine)

    // Put timestamp in
    let postTime = document.createElement('div')
    postTime.classList.add('timestamp')
    const time = new Date(post.timestamp + "Z")
    postTime.innerText = time.toLocaleString()
    authorTimeLine.appendChild(postTime)

    article.appendChild(authorTimeLine)

    // Put content in
    let postContent = document.createElement('div')
    postContent.classList.add('content-container')
    postContent.innerHTML = post.content
    article.appendChild(postContent)

    mainContentContainer.appendChild(article)
    artIds.push([article, post.id])
}

for (let artId of artIds) {
    console.log(artId)
    // Made a comment section
    let newCommentSection = document.createElement('div')
    newCommentSection.classList.add('comments-section')

    // Added a header for the comment section
    let commentHeader = document.createElement('h3')
    commentHeader.innerText = 'Comments'
    newCommentSection.appendChild(commentHeader)

    // textbox for posting comments
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
        await addNewComment(commentAuthorWriter.value, commentWriter.value, artId[1])
        const replacementCommentSection = await createCommentCollection(artId[1])
        const commentSection = artId[0].lastElementChild
        commentSection.lastElementChild.remove()
        commentSection.appendChild(replacementCommentSection)
    }
    commentBox.appendChild(commentSubmitButton)
    newCommentSection.appendChild(commentBox)

    // Append all the relevant comments
    newCommentSection.appendChild(await createCommentCollection(artId[1]))

    artId[0].appendChild(newCommentSection)
}