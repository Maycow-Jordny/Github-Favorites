import { GitHubUser } from "./githubuser.js"


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')
        this.nothingFavorites = this.root.querySelector('.footer')

        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))

        if (this.entries.length >= 1) {
            this.addHide()
        } else {
            this.removeHide()
        }

        return this.entries
    }



    async validateUserInput(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username.toLowerCase() || entry.login === username.toUpperCase())

            if (userExists) {
                throw new Error("Usuário já cadastrado")
            }
            const user = await GitHubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }


            this.entries = [user, ...this.entries]
            this.update()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
    }
}


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.update()
        this.addFavorites()

    }

    addHide() {
        this.nothingFavorites.classList.add("hide")
    }

    removeHide() {
        this.nothingFavorites.classList.remove("hide")
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {

            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.button-remove').onclick = () => {
                const isOK = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOK) {
                    this.delete(user)
                }

            }
            this.tbody.append(row)
        })

        this.save()
    }

    addFavorites() {
        const addButton = this.root.querySelector('.favorites-button button')
        const input = this.root.querySelector("#input-search")

        addButton.addEventListener('click', () => {
            const { value } = this.root.querySelector("#input-search")
            this.validateUserInput(value)
        })

        input.addEventListener('keypress', (event) => {
            if (event.key === "Enter") {
                event.preventDefault()
                addButton.click()
            }
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `  <td class="user">
     <img src="https://github.com/maykbrito.png" alt="imagem de Mayk Brito">
     <a href="https://github.com/maykbrito" target="_blank">
     <p>Mayk Brito</p>
    <span>maykbrito</span>
     </a>
     </td>
     <td class="repositories">
        123
     </td>
     <td class="followers">
        1234
    </td>
     <td>
        <button class="button-remove">Remover</button>
    </td>`
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }


}




