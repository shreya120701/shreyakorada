// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x00d9ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Geometric Shapes
const torusGeometry = new THREE.TorusGeometry(10, 2, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x7b2ff7,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.z = -20;
scene.add(torus);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const coloredLight1 = new THREE.PointLight(0x00d9ff, 1.5);
coloredLight1.position.set(-20, 10, 10);
scene.add(coloredLight1);

const coloredLight2 = new THREE.PointLight(0x7b2ff7, 1.5);
coloredLight2.position.set(20, -10, -10);
scene.add(coloredLight2);

// Mouse Movement
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Scroll Animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = 30 + t * -0.01;
    camera.position.x = -3 + t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    torus.rotation.x += 0.005;
    torus.rotation.y += 0.003;
    torus.rotation.z += 0.005;
    
    particlesMesh.rotation.y += 0.0003;
    particlesMesh.rotation.x += 0.0001;
    
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    
    coloredLight1.position.x = Math.sin(Date.now() * 0.0005) * 25;
    coloredLight1.position.z = Math.cos(Date.now() * 0.0005) * 25;
    
    coloredLight2.position.x = Math.cos(Date.now() * 0.0005) * 25;
    coloredLight2.position.z = Math.sin(Date.now() * 0.0005) * 25;
    
    renderer.render(scene, camera);
}

animate();

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Navigation Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Typing Animation
const typingText = document.querySelector('.typing-text');
const titles = [
    'DevOps Lead',
    'Kubernetes Expert',
    'CI/CD Specialist',
    'Cloud Architect',
    'Automation Enthusiast'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeTitle() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentTitle.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeTitle, typingSpeed);
}

// Start typing animation after page load
setTimeout(typeTitle, 1000);

// Skill Progress Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to nav links on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Fade in elements on scroll
const fadeElements = document.querySelectorAll('.info-card, .skill-item, .project-card, .contact-item');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Project Card Click Analytics (optional)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        console.log('Project clicked:', card.querySelector('h3').textContent);
    });
});
