export const DEFAULT_HTML = `
<div class="card">
  <div class="card-content">
    <h2>AI CodePen</h2>
    <p>A modern, AI-powered frontend playground.</p>
    <button id="actionButton">Try Me!</button>
  </div>
</div>
`;

export const DEFAULT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: #fff;
  overflow: hidden; /* Hide particles that go off-screen */
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem 3rem;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 10;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 40px 0 rgba(0, 0, 0, 0.45);
}

.card h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

button {
  background: #fdbb2d;
  color: #1a2a6c;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

button:hover {
  transform: scale(1.05);
}

.card.clicked {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) translateY(-10px); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) translateY(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(5px) translateY(-10px); }
}

/* Particle styles for the JS effect */
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  animation: burst 1s ease-out forwards;
}

@keyframes burst {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
}
`;

export const DEFAULT_JS = `
const button = document.getElementById('actionButton');
const card = document.querySelector('.card');

button.addEventListener('click', () => {
  card.classList.add('clicked');
  
  // Create a little burst effect
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    document.body.appendChild(particle);

    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 400;
    const size = Math.random() * 10 + 5;
    
    particle.style.setProperty('--x', x + 'px');
    particle.style.setProperty('--y', y + 'px');
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    // Add class after styles are set
    particle.classList.add('particle');
    
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }
  
  setTimeout(() => {
    card.classList.remove('clicked');
  }, 500);
});
`;
