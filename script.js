class BaralhoGame {
    constructor() {
        this.cards = [
            { id: 1, image: 'Imagens/1.png', meaning: 'Coração Aberto', interpretation: 'Você está em um momento de abertura emocional. Sua vulnerabilidade é sua força, permitindo conexões genuínas e crescimento pessoal.' },
            { id: 2, image: 'Imagens/2.png', meaning: 'Equilíbrio Interior', interpretation: 'Você busca harmonia em sua vida. Este é um momento para encontrar o equilíbrio entre razão e emoção, trabalho e lazer.' },
            { id: 3, image: 'Imagens/3.png', meaning: 'Transformação', interpretation: 'Mudanças significativas estão acontecendo em sua vida. Abrace a transformação, pois ela o levará a um novo nível de consciência.' },
            { id: 4, image: 'Imagens/4.png', meaning: 'Sabedoria Profunda', interpretation: 'Você possui uma sabedoria interior profunda. Confie em sua intuição e conhecimento interno para guiar suas decisões.' },
            { id: 5, image: 'Imagens/5.png', meaning: 'Nova Perspectiva', interpretation: 'É hora de ver as coisas de uma nova perspectiva. Abra sua mente para possibilidades que antes não considerava.' }
        ];
        
        this.deck = [];
        this.currentCard = null;
        this.isDrawing = false;
        
        this.initializeElements();
        this.bindEvents();
        this.shuffleDeck();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.deckElement = document.getElementById('deck');
        this.cardArea = document.getElementById('cardArea');
    }
    
    bindEvents() {
        // Suporte para click e touch
        this.deckElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.drawCard();
        });
        
        // Suporte para touch para dispositivos móveis
        this.deckElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.drawCard();
        });
    }
    
    shuffleDeck() {
        // Cria uma cópia das cartas e embaralha usando Fisher-Yates
        this.deck = [...this.cards];
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    drawCard() {
        if (this.isDrawing) {
            return;
        }
        
        // Remove foco se estiver ativo e puxa nova carta
        if (document.body.classList.contains('focused')) {
            document.body.classList.remove('focused');
            // Aguarda um pouco para remover o foco e depois puxa nova carta
            setTimeout(() => {
                this.drawNewCard();
            }, 500);
            return;
        }
        
        this.drawNewCard();
    }
    
    drawNewCard() {
        // Se o baralho estiver vazio, embaralha novamente
        if (this.deck.length === 0) {
            this.shuffleDeck();
        }
        
        this.isDrawing = true;
        
        // Remove a primeira carta do baralho
        const drawnCard = this.deck.shift();
        this.currentCard = drawnCard;
        
        // Cria a carta com verso
        this.createCard(drawnCard);
        
        // Atualiza contador
        this.updateDisplay();
        
        // Anima a carta saindo do baralho e virando
        setTimeout(() => {
            this.animateCardDraw();
        }, 1000);
    }
    
    
    createCard(card) {
        // Remove carta anterior se existir com animação de volta
        const existingCard = this.cardArea.querySelector('.card');
        if (existingCard && !existingCard.classList.contains('card-return')) {
            this.animateCardReturn(existingCard);
        } else if (!existingCard) {
            // Se não há carta anterior, cria a nova imediatamente
            this.createNewCard();
        }
        
        // Armazena a carta para criar depois
        this.cardToFlip = card;
    }
    
    animateCardReturn(cardElement) {
        // Detecta se é mobile e aplica a animação correta
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            cardElement.classList.add('card-return-mobile');
        } else {
            cardElement.classList.add('card-return');
        }
        
        // Remove a carta após a animação e cria a nova carta
        setTimeout(() => {
            if (cardElement.parentNode) {
                cardElement.remove();
            }
            // Cria a nova carta após a anterior voltar
            this.createNewCard();
        }, 800);
    }
    
    createNewCard() {
        this.createAndAnimateCard();
    }
    
    animateCardDraw() {
        // Verifica se já existe uma carta sendo processada
        const existingCard = this.cardArea.querySelector('.card');
        if (existingCard) {
            return; // Não cria nova carta se já existe uma
        }
        
        this.createAndAnimateCard();
    }
    
    createAndAnimateCard() {
        // Cria a carta inicialmente com o verso
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `<img src="Imagens/Verso.png" alt="Verso da carta">`;
        
        this.cardArea.appendChild(cardElement);
        
        // Aplica o efeito selecionado
        this.applyEffect(cardElement);
        
        // Depois de 1.2s: vira a carta e adiciona destaque
        setTimeout(() => {
            const img = cardElement.querySelector('img');
            if (img) {
                img.src = this.cardToFlip.image;
                img.alt = this.cardToFlip.meaning;
                // Adiciona transição suave para a virada
                img.style.transition = 'all 0.5s ease-in-out';
            }
            cardElement.classList.add('card-highlight');
            
            // Adiciona foco na página
            document.body.classList.add('focused');
            
            this.isDrawing = false;
        }, 1200);
    }
    
    applyEffect(cardElement) {
        // Detecta se é mobile e aplica a animação correta
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            cardElement.classList.add('card-fly-from-deck-mobile');
        } else {
            cardElement.classList.add('card-fly-from-deck');
        }
    }
    
    
    
    
    updateDisplay() {
        // Baralho sempre disponível (sempre embaralha quando vazio)
        this.deckElement.style.opacity = '1';
        this.deckElement.style.cursor = 'pointer';
    }
    
    resetGame() {
        this.currentCard = null;
        this.isDrawing = false;
        
        // Remove carta atual
        const existingCard = this.cardArea.querySelector('.card');
        if (existingCard) {
            existingCard.remove();
        }
        
        // Embaralha o baralho novamente
        this.shuffleDeck();
        
        // Reset display
        this.updateDisplay();
    }
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new BaralhoGame();
});
