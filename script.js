class ExtensionsManager {
    constructor() {
        this.extensions = [];
        this.currentFilter = 'all';
        this.container = document.getElementById('extensions-container');
        this.filterButtons = document.querySelectorAll('.filter-btn');

        this.init();
    }

    async init() {
        await this.loadExtensions();
        this.setupEventListeners();
        this.renderExtensions();
    }

    async loadExtensions() {
        try {
            const response = await fetch('./data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            this.extensions = data.map((ext, index) => ({
                ...ext,
                id: index
            }));
        } catch (error) {
            console.error('Erro ao carregar extensões:', error);
            this.showEmptyState('Erro ao carregar extensões');
        }
    }

    setupEventListeners() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentFilter = e.target.dataset.filter;
                this.renderExtensions();
            });
        });
    }

    setActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    createCard(extension) {
        const card = document.createElement('div');
        card.className = `card ${extension.isActive ? 'active' : 'inactive'}`;
        card.dataset.id = extension.id;

        card.innerHTML = `
            <div class="card-header">
                <img src="${extension.logo}" alt="${extension.name} logo" 
                     onerror="this.src='https://via.placeholder.com/48x48/667eea/ffffff?text=${extension.name.charAt(0)}'">
                
                     <div class='header-text'>
                        <h2>${extension.name}</h2>
                        <p>${extension.description}</p>
                    </div>
            </div>
            <div class="card-actions">
                <button class="remove-btn" onclick="extensionsManager.removeExtension(${extension.id})">
                    Remove
                </button>
                <div class="toggle-switch" onclick="extensionsManager.toggleExtension(${extension.id})">
                    <input type="checkbox" id="toggle-${extension.id}" ${extension.isActive ? 'checked' : ''}>
                    <label for="toggle-${extension.id}" class="toggle-slider"></label>
                </div>
            </div>
        `;

        return card;
    }

    renderExtensions() {
        this.container.innerHTML = '';

        const filteredExtensions = this.getFilteredExtensions();

        if (filteredExtensions.length === 0) {
            this.showEmptyState();
            return;
        }

        filteredExtensions.forEach(extension => {
            const card = this.createCard(extension);
            this.container.appendChild(card);
        });
    }

    getFilteredExtensions() {
        switch (this.currentFilter) {
            case 'active':
                return this.extensions.filter(ext => ext.isActive);
            case 'inactive':
                return this.extensions.filter(ext => !ext.isActive);
            default:
                return this.extensions;
        }
    }

    showEmptyState(message = 'Nenhuma extensão encontrada para este filtro') {
        this.container.innerHTML = `
            <div class="empty-state">
                <img src='./assets/images/empty-state.png'/>
            </div>
        `;
    }

    removeExtension(id) {
        if (confirm('Tem certeza que deseja remover esta extensão?')) {
            this.extensions = this.extensions.filter(ext => ext.id !== id);
            this.renderExtensions();
        }
    }

    toggleExtension(id) {
        const extension = this.extensions.find(ext => ext.id === id);
        if (extension) {
            extension.isActive = !extension.isActive;
            this.renderExtensions();
        }
    }
}

let extensionsManager;
document.addEventListener('DOMContentLoaded', () => {
    extensionsManager = new ExtensionsManager();

    if (window.matchMedia("(prefers-color-scheme:light)").matches) {
        document.querySelector('html').classList.add("theme-light")
    }

    document.querySelector('#theme-btn').addEventListener('click', () => {
        document.querySelector('html').classList.toggle("theme-light")
    })

});