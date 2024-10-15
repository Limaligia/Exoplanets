document.getElementById('exoplanet-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const properties = Object.fromEntries(formData);
    
    animateSimulation(properties);
});

function animateSimulation(properties) {
    const canvas = document.getElementById('simulation-canvas');
    const ctx = canvas.getContext('2d');

    // Propriedades da simulação
    const semiEixoPlaneta = parseFloat(properties.semiEixoPlaneta) * 100; // Convertendo UA para pixels
    const periodoOrbital = parseFloat(properties.periodoOrbital);
    const excentricidade = parseFloat(properties.excentricidade);
    const inclinacao = parseFloat(properties.inclinacao) || 0; // Inclinação da órbita (graus)
    const massaEstrela = parseFloat(properties.massaEstrela);
    const raioEstrela = parseFloat(properties.raioEstrela) * 10; // Convertido para pixels
    const albedo = parseFloat(properties.albedo);
    const temperaturaEstrela = parseFloat(properties.tempEstrela);
    const profundidadeTransito = parseFloat(properties.profundidadeTransito);
    const grauInsolacao = parseFloat(properties.grauInsolacao);
    const tempEquilibrio = parseFloat(properties.tempEquilibrio);
    const habitabilityInner = parseFloat(properties.habitabilityInner) * 100; // Convertendo UA para pixels
    const habitabilityOuter = parseFloat(properties.habitabilityOuter) * 100; // Convertendo UA para pixels

    const maxOrbitalSpeed = 0.1; // Velocidade máxima da órbita
    const speed = (2 * Math.PI) / periodoOrbital; // Velocidade orbital inversamente proporcional ao período

    let angle = 0;

    // Função para mapear a temperatura da estrela para uma cor (aproximada)
    function getStarColor(temperature) {
        if (temperature > 7500) return 'blue';
        if (temperature > 6000) return 'white';
        if (temperature > 5000) return 'yellow';
        if (temperature > 3500) return 'orange';
        return 'red';
    }

    // Função para desenhar a zona de habitabilidade como uma rosquinha (faixa)
    function drawHabitabilityZone() {
        // Desenhar o limite externo da zona habitável
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'; // Transparência ajustada para 0.5
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, habitabilityOuter, habitabilityOuter / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Desenhar o centro da zona habitável com a mesma cor do fundo
        ctx.fillStyle = '#ffffff'; // Cor sólida do fundo (preto)
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, habitabilityInner, habitabilityInner / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Função para desenhar a órbita completa (elíptica ou circular)
    function drawOrbit() {
        const orbitWidth = semiEixoPlaneta * (1 - excentricidade);
        const orbitHeight = semiEixoPlaneta * (1 + excentricidade);

        // Transformação para inclinação
        const inclinationRadians = inclinacao * (Math.PI / 180);
        
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;

        ctx.save(); // Salvar o estado atual do contexto
        ctx.translate(canvas.width / 2, canvas.height / 2); // Mover o centro para o meio da tela
        ctx.rotate(inclinationRadians); // Rotacionar a órbita conforme a inclinação

        // Desenhar a órbita
        ctx.beginPath();
        ctx.ellipse(0, 0, orbitWidth, orbitHeight, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore(); // Restaurar o estado original do contexto
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar a zona de habitabilidade
        drawHabitabilityZone();

        // Desenhar a órbita
        drawOrbit();

        // Desenhar a estrela
        ctx.fillStyle = getStarColor(temperaturaEstrela); // Cor da estrela com base na temperatura
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, raioEstrela, 0, Math.PI * 2);
        ctx.fill();

        // Cálculo da excentricidade na órbita do planeta
        const planetX = canvas.width / 2 + semiEixoPlaneta * (1 - excentricidade) * Math.cos(angle);
        const planetY = canvas.height / 2 + semiEixoPlaneta * (1 + excentricidade) * Math.sin(angle);

        // Desenhar o planeta
        const planetSize = 5 + albedo * 5; // O tamanho do planeta é influenciado pelo albedo
        ctx.fillStyle = rgba(0, 0, 255, ${1 - profundidadeTransito / 100}); // Cor com base na profundidade de trânsito
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetSize, 0, Math.PI * 2);
        ctx.fill();

        // Atualizar o ângulo para mover o planeta
        angle += speed * (1 + grauInsolacao / 1000); // A velocidade de rotação aumenta com a insolação

        // Repetir a animação
        requestAnimationFrame(draw);
    }

    draw(); // Iniciar a animação
} 