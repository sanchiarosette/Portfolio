 // Three.js Hero Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('hero-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0x0ea5e9, size: 0.5 });

const starsVertices = [];
for (let i = 0; i < 1000; i++) {
  starsVertices.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

const planetGeometry = new THREE.SphereGeometry(5, 32, 32);
const planetMaterial = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.set(10, 5, -20);
// scene.add(planet); // Commented out to remove the round yellow sphere

camera.position.z = 50;

function animate() {
  requestAnimationFrame(animate);
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;
  // planet.rotation.y += 0.005; // Commented out to stop rotation of removed sphere
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.section').forEach((section, index) => {
  gsap.from(section, {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  });
});

gsap.utils.toArray('.project-card').forEach((card, index) => {
  gsap.from(card, {
    opacity: 0,
    y: 50,
    rotationX: -15,
    duration: 0.8,
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  });
});

// Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar with close button
sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
      sidebar.classList.remove('open'); // Close sidebar on mobile
    }
  });
});

// Highlight active nav link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sectionsForNav = document.querySelectorAll('main .section');

window.addEventListener('scroll', () => {
  let current = '';
  sectionsForNav.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });

  // Scroll progress bar update
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
});

// Skill Circles Animation
function animateSkillCircles() {
  const skillCircles = document.querySelectorAll('.skill-circle');
  skillCircles.forEach(circle => {
    const percent = circle.getAttribute('data-percent');
    gsap.to(circle, {
      background: `conic-gradient(#0ea5e9 0% ${percent}%, #1e293b ${percent}% 100%)`,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: circle,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

// Contact form validation and submission
const contactForm = document.getElementById('contact-form');
if (contactForm) { /* Form has been removed, this logic is no longer needed */ }

// Project Cards Tilt Effect
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

// Modal for Project Previews
const modal = document.createElement('div');
modal.className = 'project-modal';
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-modal">&times;</span>
    <div class="modal-body">
      <h2 id="modal-title"></h2>
      <img id="modal-image" src="" alt="Project Screenshot">
      <p id="modal-description"></p>
      <div id="modal-tech-stack"></div>
      <a id="modal-link" href="#" target="_blank">View Live Demo</a>
    </div>
  </div>
`;
document.body.appendChild(modal);

document.querySelectorAll('.btn-demo').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const card = btn.closest('.project-card');
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-image').src = 'https://via.placeholder.com/600x400.png?text=Project+Screenshot';
    document.getElementById('modal-tech-stack').innerHTML = '<span class="tech-tag">HTML</span><span class="tech-tag">CSS</span><span class="tech-tag">JavaScript</span>';
    document.getElementById('modal-link').href = '#';

    modal.style.display = 'block';
  });
});

document.querySelector('.close-modal').addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Learning Timeline Animation
function animateLearningTimeline() {
  const timelineItems = document.querySelectorAll('.learning-timeline .timeline-content');

  timelineItems.forEach((item, index) => {
    gsap.fromTo(item, {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
}

if (themeToggle) {
  const themeIcon = themeToggle.querySelector('i');

  function updateThemeIcon(theme) {
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }
  }

  // Initialize theme icon
  updateThemeIcon(savedTheme || 'dark');

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Add smooth transition effect
    gsap.fromTo(body, { opacity: 0.8 }, { opacity: 1, duration: 0.3 });
  });
}

// Voice/Audio Interactions
class VoiceAssistant {
  constructor() {
    this.isEnabled = true; // Enable by default
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.init();
  }

  init() {
    // Check for browser support
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Handle voices loading
    this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
    };

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      this.processCommand(command);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.updateVoiceButton();
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.updateVoiceButton();
    };
  }

  playIntro() {
    if (!this.synthesis || this.synthesis.speaking) return;

    if (this.hasPlayedIntro) return; // Only play once per page load
    this.hasPlayedIntro = true;

    const introText = "Hi, I'm Sanchia Rosette, welcome to my portfolio.";
    this.speakResponse(introText);
  }

  startListening() {
    if (!this.recognition || this.isListening) return;

    try {
      this.recognition.start();
      this.isListening = true;
      this.updateVoiceButton();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;

    this.recognition.stop();
    this.isListening = false;
    this.updateVoiceButton();
  }

  processCommand(command) {
    console.log('Voice command received:', command);

    // Define navigation commands
    const commands = {
      'home': 'hero',
      'about': 'about',
      'skills': 'skills',
      'learning': 'learning',
      'soft skills': 'soft-skills',
      'projects': 'projects',
      'internship': 'internship',
      'contact': 'contact'
    };

    // Check for navigation commands
    for (const [keyword, sectionId] of Object.entries(commands)) {
      if (command.includes(keyword) || command.includes(`go to ${keyword}`)) {
        this.navigateToSection(sectionId);
        this.speakResponse(`Navigating to ${keyword}`);
        return;
      }
    }

    // Handle other commands
    if (command.includes('help') || command.includes('commands')) {
      this.speakResponse('You can say: go to home, go to about, go to skills, go to projects, go to contact, or other sections.');
    } else if (command.includes('stop') || command.includes('disable')) {
      this.disable();
      this.speakResponse('Voice commands disabled');
    } else {
      this.speakResponse('Sorry, I didn\'t understand that command. Say "help" for available commands.');
    }
  }

  navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });

      // Close sidebar if open
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    }
  }

  speakResponse(text) {
    if (!this.synthesis || this.synthesis.speaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Ensure voices are loaded and select a female voice
    const getVoicesAndSpeak = () => {
      const voices = this.synthesis.getVoices();
      const femaleVoice = voices.find(voice =>
        voice.lang.startsWith('en') && (
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('susan')
        )
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      this.synthesis.speak(utterance);
    };

    if (this.synthesis.getVoices().length) {
      getVoicesAndSpeak();
    } else {
      this.synthesis.onvoiceschanged = getVoicesAndSpeak;
    }
  }

  enable() {
    this.isEnabled = true;
    this.updateVoiceButton();
    this.speakResponse('Voice commands enabled. Say "help" for available commands.');
  }

  disable() {
    this.isEnabled = false;
    this.stopListening();
    this.updateVoiceButton();
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  updateVoiceButton() {
    const voiceButton = document.getElementById('voice-toggle');
    if (voiceButton) {
      const icon = voiceButton.querySelector('i');
      if (this.isEnabled) {
        voiceButton.classList.add('active');
        if (this.isListening) {
          icon.className = 'fas fa-microphone-slash';
          voiceButton.style.background = 'var(--button-hover)';
        } else {
          icon.className = 'fas fa-microphone';
          voiceButton.style.background = 'var(--button-bg)';
        }
      } else {
        voiceButton.classList.remove('active');
        icon.className = 'fas fa-microphone-slash';
        voiceButton.style.background = 'rgba(14, 165, 233, 0.3)';
      }
    }
  }
}

// Initialize voice assistant
const voiceAssistant = new VoiceAssistant();

// Add voice toggle button to HTML
function addVoiceToggleButton() {
  const voiceButton = document.createElement('button');
  voiceButton.id = 'voice-toggle';
  voiceButton.className = 'voice-toggle active'; // Start as active since voice is enabled by default
  voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
  voiceButton.title = 'Click to speak, Right-click to toggle feature';
  voiceButton.setAttribute('aria-label', 'Voice Commands');

  voiceButton.addEventListener('click', () => {
    if (voiceAssistant.isEnabled) {
      if (voiceAssistant.isListening) {
        voiceAssistant.stopListening();
      } else {
        voiceAssistant.startListening();
      }
    } else {
      voiceAssistant.speakResponse("Voice commands are disabled. Right-click the microphone to enable.");
    }
  });

  voiceButton.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent default context menu
    voiceAssistant.toggle(); // This will enable/disable the feature
  });

  // Insert after theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.parentNode.insertBefore(voiceButton, themeToggle.nextSibling);
  } else {
    document.body.appendChild(voiceButton);
  }
}

// Skill Tree Animation and Interactivity
function animateSkillTree() {
  const skillBranches = document.querySelectorAll('.skill-branch');

  skillBranches.forEach((branch, index) => {
    gsap.fromTo(branch, {
      opacity: 0,
      y: 50,
      scale: 0.8
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: index * 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: branch,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Add hover interactivity
  const skillNodes = document.querySelectorAll('.skill-node');
  skillNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      gsap.to(node, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    node.addEventListener('mouseleave', () => {
      gsap.to(node, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Add click to toggle details
    node.addEventListener('click', () => {
      const description = node.querySelector('p');
      if (description) {
        gsap.to(description, {
          opacity: description.style.opacity === '0' ? 1 : 0,
          height: description.style.opacity === '0' ? 'auto' : 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });
}

// Code Runner Functionality
function initializeCodeRunner() {
  const runnerContainer = document.getElementById('try-my-code');
  if (!runnerContainer) return; // Exit if the code runner is not on this page

  const tabs = runnerContainer.querySelectorAll('.tab');
  const codeEditor = runnerContainer.querySelector('#code-editor');
  const runButton = runnerContainer.querySelector('#run-code');
  const outputWindow = runnerContainer.querySelector('#output');

  const codeSamples = {
    javascript: `// Reverse an array
const arr = [1, 2, 3, 4, 5];
const reversed = arr.reverse();
console.log(reversed);`,
    python: `# Calculate sum of numbers
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum: {total}")`
  };

  function updateCodeEditor(language) {
    const codeElement = codeEditor.querySelector('code');
    if (codeElement) {
      codeEditor.className = `language-${language}`;
      codeElement.className = `language-${language}`;
      codeElement.textContent = codeSamples[language];
      if (window.Prism) {
        Prism.highlightElement(codeElement);
      }
    }

    runButton.disabled = false;
    runButton.style.cursor = 'pointer';
    runButton.style.opacity = '1';
    outputWindow.textContent = '';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const language = tab.getAttribute('data-lang');
      updateCodeEditor(language);
    });
  });

  runButton.addEventListener('click', () => {
    const language = runnerContainer.querySelector('.tab.active').getAttribute('data-lang');
    const code = codeEditor.textContent;
    outputWindow.textContent = 'Running...\n';
    if (language === 'javascript') runJavaScript(code);
    if (language === 'python') runPython(code);
  });

  function runJavaScript(code) {
    try {
      let output = '';
      const originalLog = console.log;
      console.log = (...args) => {
        output += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ') + '\n';
        originalLog.apply(console, args);
      };
      eval(code);
      console.log = originalLog;
      outputWindow.textContent = output || 'Code executed successfully (no output).\n';
    } catch (error) {
      outputWindow.textContent = `Error: ${error.message}\n`;
    }
  }

  async function runPython(code) {
    try {
      if (!window.pyodide) {
        outputWindow.textContent = 'Loading Python environment...\n';
        window.pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/" });
      }
      window.pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
      `);
      await window.pyodide.runPythonAsync(code);
      const output = window.pyodide.runPython('sys.stdout.getvalue()');
      outputWindow.textContent = output || 'Code executed successfully (no output).\n';
    } catch (error) {
      outputWindow.textContent = `Error: ${error.message}\n`;
    }
  }

  updateCodeEditor('javascript');
}

function loadPyodide(config) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${config.indexURL}pyodide.js`;
    script.onload = () => window.loadPyodide(config).then(resolve).catch(reject);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  animateSkillCircles();
  animateLearningTimeline();
  animateSkillTree(); // Add skill tree animation
  initializeCodeRunner();

  // Add voice toggle button
  addVoiceToggleButton();

  // Play voice intro after a short delay
  setTimeout(() => {
    voiceAssistant.playIntro();
  }, 1500);
});
