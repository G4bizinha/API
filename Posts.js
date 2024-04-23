async function Posts(pageNumber) {
    try {
        const perPage = 10;
        const startIndex = (pageNumber - 1) * perPage;
        const endIndex = startIndex + perPage;

        // Requisição para obter os posts
        let postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${startIndex}&_end=${endIndex}`);
        const postDados = await postResponse.json();

        // Requisição para obter os usuários
        let userResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        const userDados = await userResponse.json();

        const outputDiv = document.getElementById('posts');
        outputDiv.innerHTML = '';

        // Função para encontrar o usuário pelo ID
        function findUserById(userId) {
            return userDados.find(user => user.id === userId);
        }

        // Iterar sobre os posts
            for (const post of postDados) {
                const user = findUserById(post.userId); // Encontrar o usuário correspondente ao post

                const postDiv = document.createElement('div');
                postDiv.classList.add('post');
                postDiv.innerHTML =
                `   
                    <div class="rounded-full p-2"></div>
                    <h2><strong>ID: </strong>${post.id}</h2>
                    <strong class="bg-zinc-200 text-black p-1 rounded-full">Autor <p class="text-blue-500"> ${user ? user.name : 'Desconhecido'} </p> </strong>
                    <p><strong>Titulo: ${post.title}</p></strong>
                    <p>${post.body}</p>
                    
                `;

                // Adiciona um espaço antes dos comentários
                postDiv.innerHTML += `<div class="mt-4">`;

                // Requisição para obter os comentários relacionados ao post
                let commentResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
                const commentDados = await commentResponse.json();

                // Iterar sobre os comentários
                for (const comment of commentDados) {
                    postDiv.innerHTML +=
                    `
                        <div class="p-2">
                            <p class="text-blue-800 p-1 rounded-md bg-blue-200 w-3/12 justify-between flex">${comment.email} <strong class="text-black p-1 rounded-full">E-mail do Autor</strong> </p>
                            <p>${comment.body}</p>
                        </div>
                    `;
                }

                postDiv.innerHTML += `</div>`; // Fecha a div dos comentários

                outputDiv.appendChild(postDiv);
            }

        const paginationDiv = document.getElementById('pagination');
        paginationDiv.innerHTML = '';

        for (let i = 1; i <= Math.ceil(100 / perPage); i++) { 
            const button = document.createElement('button');
            button.innerText = i;
            button.classList.add('pagination-button', 'border', 'border-gray-400', 'bg-gray-200', 'text-gray-700', 'px-4', 'py-2', 'rounded', 'transition-colors', 'duration-300');
            button.addEventListener('click', () => Posts(i));
            paginationDiv.appendChild(button);
        }
        paginationDiv.children[pageNumber - 1].classList.add('bg-green-500', 'text-white');
        
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    }
}

Posts(1);
