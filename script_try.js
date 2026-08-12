        // --- 0. PROCEDURAL SOUND ENGINE (Web Audio API) & GYROSCOPE ---
        const SoundEngine = {
            ctx: null,
            init() { },
            playHover() { },
            playClick() { },
            playSweep(up = true) { }
        };

        // Gyroscope Orientation Handler for Mobile Parallax
        function handleOrientation(event) {
            let x = event.gamma || 0; // [-90, 90]
            let y = event.beta || 0;  // [-180, 180]

            // Constrain tilt to 45 degrees max for smooth usability
            x = Math.max(-45, Math.min(45, x));
            y = Math.max(-45, Math.min(45, y));

            // Map degrees to our normalized -1 to +1 range
            normX = x / 45;
            normY = -(y / 45); // Invert Y so tilting phone forward points camera down
        }

        // Initialize Audio and Gyroscope on first interaction
        window.addEventListener('pointerdown', () => {
            SoundEngine.init();

            // Request Gyro permission (required for iOS 13+)
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        }, { once: true });


        // --- 1. THEME TOGGLE LOGIC ---
        const themeBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        let isLightMode = false;

        themeBtn.addEventListener('click', () => {
            isLightMode = !isLightMode;
            document.body.classList.toggle('light-theme', isLightMode);
            themeIcon.className = isLightMode ? 'fas fa-moon' : 'fas fa-sun';

            if (scene) {
                if (isLightMode) {
                    scene.fog.color.setHex(0xf4f0f8);
                    if (nexusData.ambientLight) { nexusData.ambientLight.color.setHex(0xffffff); nexusData.ambientLight.intensity = 0.8; }
                    if (nexusData.topo) nexusData.topo.material.color.setHex(0xb76e79);
                    if (nexusData.pointLight) nexusData.pointLight.color.setHex(0xb76e79);
                    if (nexusData.storm) nexusData.storm.material.color.setHex(0xb76e79);
                    if (nexusData.kinetic) {
                        nexusData.kinetic.material.color.setHex(0xe0dae6);
                        nexusData.kinetic.material.roughness = 0.6;
                    }
                    if (nexusData.singularityUniforms) {
                        nexusData.singularityUniforms.uColor1.value.setHex(0xffffff);
                        nexusData.singularityUniforms.uColor2.value.setHex(0xb76e79);
                    }
                } else {
                    scene.fog.color.setHex(0x1a1a24);
                    if (nexusData.ambientLight) { nexusData.ambientLight.color.setHex(0x333344); nexusData.ambientLight.intensity = 1.0; }
                    if (nexusData.topo) nexusData.topo.material.color.setHex(0x444455);
                    if (nexusData.pointLight) nexusData.pointLight.color.setHex(0xA855F7);
                    if (nexusData.storm) nexusData.storm.material.color.setHex(0x888888);
                    if (nexusData.kinetic) {
                        nexusData.kinetic.material.color.setHex(0x22222a);
                        nexusData.kinetic.material.roughness = 0.2;
                    }
                }
            }
        });

        // --- 2. DATA INJECTION & LOGIC ---
        const projects = [
            {
                "id": "project-06",
                "title": "Adaptive Evidence RAG – Self-Evaluating Retrieval Pipeline",
                "preview_img": "adaptive_rag.png",
                "main_desc": "Adaptive multi-agent RAG pipeline with cross-encoder NLI context filtering.",
                "points": [
                    "Achieved <10% hallucination rate & >75% Exact Match accuracy via multi-agent filtering.",
                    "Accelerated evidence processing & reduced token generation by ~80% via NLI scoring (>=0.70).",
                    "Deployed full-stack containerized (React + FastAPI) app on HF Spaces with <2s latency."
                ],
                "stack": ["FastAPI", "React.js", "PyTorch", "LangGraph", "Qwen-4bit", "HF Spaces"],
                "links": {
                    "live": "https://huggingface.co/spaces/Dyno1307/adaptive-evidence-rag",
                    "github": "https://github.com/DYNOSuprovo/adaptive-evidence-rag"
                }
            },
            {
                "id": "project-07",
                "title": "Pluto – Multi-Agent Document Intelligence Pipeline",
                "preview_img": "image copy 5.png",
                "main_desc": "Multi-agent RAG system (Router, Extractor, Synthesizer, Critic) for verifiable quote mapping.",
                "points": [
                    "Improved evidence traceability & quote mapping by 100% over single-model baselines.",
                    "Accelerated extraction stage latency by ~80% via 8-worker thread pooling & 2-layer cache.",
                    "Reduced API costs via token-overlap verification heuristic (match score >= 0.72)."
                ],
                "stack": ["FastAPI", "Vue.js", "PostgreSQL", "LLaMA-3", "Mistral", "Docker"],
                "links": {
                    "live": "https://huggingface.co/spaces/ayushKishor/plutoV2_miniProject_3rd-yr",
                    "github": "https://github.com/DYNOSuprovo/Pluto"
                }
            },
            {
                "id": "project-05",
                "title": "Intent Compiler – Multi-Agent AI Architecture Generator",
                "preview_img": "image copy 6.png",
                "main_desc": "AI system that converts product ideas into structured system architecture using LLM orchestration.",
                "points": [
                    "Built multi-agent pipeline that converts natural language product ideas into structured technical architecture.",
                    "Generates requirements, database schema, and pseudo-code using agent orchestration.",
                    "Interactive Streamlit interface for real-time architecture generation."
                ],
                "stack": ["LangGraph", "Groq LLaMA", "Streamlit", "Python"],
                "links": {
                    "live": "https://intent-compiler-bydyno.streamlit.app/",
                    "github": "https://github.com/DYNOSuprovo/intent-compiler"
                }
            },
            {
                "id": "project-02",
                "title": "Aahar – AI-Powered Diet & Wellness Companion",
                "preview_img": "image copy 3.png",
                "main_desc": "RAG-based nutrition assistant with vector retrieval for Indian diet planning.",
                "points": [
                    "Built RAG-based nutrition assistant with vector retrieval for Indian diet planning.",
                    "Designed personalized calorie computation and AI-driven health advisory system.",
                    "Integrated multi-model LLM routing using Gemini and Groq APIs."
                ],
                "stack": ["LangChain", "Gemini API", "ChromaDB", "FastAPI", "Next.js"],
                "links": {
                    "live": "https://aahar-react.vercel.app/",
                    "github": null
                }
            },
            {
                "id": "project-03",
                "title": "Translate-V2 – Neural Machine Translation System",
                "preview_img": "image copy.png",
                "main_desc": "Multilingual neural machine translation system for Nepali/Sinhala to English.",
                "points": [
                    "Deployed NLLB-200 based multilingual translation (Nepali/Sinhala → English).",
                    "Reduced inference latency by 38% through optimized batching and model loading."
                ],
                "stack": ["Transformers", "PyTorch", "FastAPI", "Docker"],
                "links": {
                    "live": "https://huggingface.co/spaces/Dyno1307/Translate-V2",
                    "github": null
                }
            },
            {
                "id": "project-01",
                "title": "Wheat Guardian – AI Disease Detection",
                "preview_img": "image copy 4.png",
                "main_desc": "AI-Based Wheat Disease Detection System using EfficientNetV2 and FastAPI.",
                "points": [
                    "Fine-tuned EfficientNetV2B2 achieving 93%+ accuracy on multi-class disease classification.",
                    "Built end-to-end inference pipeline with REST APIs and modular backend design.",
                    "Containerized and deployed with optimized cloud inference latency (~300ms)."
                ],
                "stack": ["TensorFlow", "EfficientNetV2", "FastAPI", "OpenCV", "Docker"],
                "links": {
                    "live": "https://wheat-analysis-app.vercel.app",
                    "github": null
                }
            },
            {
                "id": "project-04",
                "title": "AI Expense Advisor",
                "preview_img": "image copy.png",
                "main_desc": "Contextual AI budgeting assistant with embedding-based FAQ retrieval.",
                "points": [
                    "Built contextual AI budgeting assistant with embedding-based FAQ retrieval."
                ],
                "stack": ["Streamlit", "LangChain", "Gemini API"],
                "links": {
                    "live": null,
                    "github": null
                }
            }
        ];


        const skillLogos = {
            "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original-wordmark.svg",
            "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg",
            "C++": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
            "TensorFlow": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original-wordmark.svg",
            "PyTorch": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original-wordmark.svg",
            "scikit-learn": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg",
            "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original-wordmark.svg",
            "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original-wordmark.svg",
            "Jupyter": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original-wordmark.svg",
            "Google Colab": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg",
            "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original-wordmark.svg",
            "AWS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
            "LangChain": "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
            "Gemini API": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg",
            "ChromaDB": "https://mintlify.s3-us-west-1.amazonaws.com/chroma/logo/dark.svg",
            "Ollama": "https://raw.githubusercontent.com/ollama/ollama/main/docs/ollama.png",
            "LangGraph": "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
            "LlamaIndex": "https://github.com/run-llama.png",
            "GCP": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
            "GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
        };

        const skills = [
            "Python", "Java", "C++", "TensorFlow", "PyTorch", "scikit-learn", "LangChain", "LlamaIndex",
            "LangGraph", "RAG", "Vector Databases", "Gemini API", "ChromaDB", "FAISS", "Ollama", "Agentic AI",
            "Docker", "Git", "GitHub", "Jupyter", "Google Colab", "VS Code", "GCP", "AWS"
        ];

        // Inject Skills (3-Row DNA Marquee)
        const marqueeContainer = document.getElementById('skills-marquee');
        if (marqueeContainer) {
            // Split skills into 3 chunks
            const row1 = skills.slice(0, 8);
            const row2 = skills.slice(8, 16);
            const row3 = skills.slice(16, 24);

            const rowsData = [
                { data: row1, dir: 'left', speed: '35s' },
                { data: row2, dir: 'right', speed: '40s' },
                { data: row3, dir: 'left', speed: '32s' }
            ];

            rowsData.forEach(row => {
                if (row.data.length === 0) return;
                const rowEl = document.createElement('div');
                rowEl.className = `marquee-row ${row.dir}`;

                const track = document.createElement('div');
                track.className = 'marquee-track';
                track.style.animationDuration = row.speed;

                let itemsHTML = '';
                row.data.forEach(skill => {
                    if (skillLogos[skill]) {
                        itemsHTML += `<div class="skill-logo-item hover-target" title="${skill}">
                            <img src="${skillLogos[skill]}" alt="${skill}">
                        </div>`;
                    } else {
                        itemsHTML += `<div class="skill-logo-item text-logo hover-target" title="${skill}">${skill}</div>`;
                    }
                });

                // Duplicate items for seamless infinite scroll
                track.innerHTML = itemsHTML + itemsHTML + itemsHTML + itemsHTML;

                rowEl.appendChild(track);
                marqueeContainer.appendChild(rowEl);
            });
        }

        // Inject Projects (3D Flip Grid)
        const projectsGrid = document.getElementById('projects-grid');

        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'large-flip-card hover-target';

                const stackTags = project.stack.slice(0, 4).map(tech => `<span class="skill-tag">${tech}</span>`).join('');
                const shortAppName = project.title.split('–')[0].split('-')[0].trim().toUpperCase();

                card.innerHTML = `
                    <div class="large-flip-card-inner">
                        <!-- Front Face -->
                        <div class="large-flip-card-front">
                            <div>
                                <div class="proj-badge-row">
                                    <span class="proj-category-tag" style="font-size: 0.8rem; padding: 6px 14px;">AI / ML Enterprise Solution</span>
                                    <i class="fas fa-microchip" style="color: var(--accent-color); font-size: 1.5rem; opacity: 0.8;"></i>
                                </div>
                                <h3 class="large-proj-title">${project.title}</h3>
                                <p class="large-proj-desc">${project.main_desc}</p>
                                <div class="proj-card-stack" style="gap: 10px;">${stackTags}</div>
                            </div>
                            <div class="proj-flip-hint">
                                <div class="flip-pill-btn hover-target">
                                    <span>Touch to <span class="styled-flip-text"><b><i><span class="f-blue">F</span><span class="lip-white">LIP</span></i></b></span> <i class="fas fa-hand-pointer" style="margin-left: 8px; color: #00f0ff;"></i></span>
                                    <i class="fas fa-sync" style="font-size: 1.25rem; color: #00f0ff;"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Back Face (App Screenshot Preview & Actions) -->
                        <div class="large-flip-card-back" style="display: flex; flex-direction: row; gap: 30px; padding: 40px;">
                            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                                <div class="app-preview-header" style="margin-bottom: 20px;">
                                    <span class="mockup-dot dot-red"></span>
                                    <span class="mockup-dot dot-yellow"></span>
                                    <span class="mockup-dot dot-green"></span>
                                    <span class="app-title-display" style="font-size: 0.9rem;">// ${shortAppName}.APP</span>
                                </div>
                                <div class="app-preview-img-container" style="height: 380px; border-radius: 16px;">
                                    <img src="${project.preview_img}" alt="${project.title}" class="app-preview-img">
                                </div>
                            </div>
                            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding-left: 20px;">
                                <h3 style="font-family: var(--font-heading); font-size: 2rem; color: #fff; margin-bottom: 20px;">System Details</h3>
                                <ul style="list-style: none; padding-left: 0; color: #d0d0e0; font-size: 1.1rem; line-height: 1.8; margin-bottom: 40px;">
                                    ${project.points.slice(0, 3).map(p => `<li style="margin-bottom: 15px; position: relative; padding-left: 30px;"><span style="position: absolute; left: 0; color: var(--accent-color);">⚡</span> ${p}</li>`).join('')}
                                </ul>
                                <div class="card-actions-row" style="margin-top: auto; justify-content: flex-start; gap: 20px;">
                                    ${project.links.live ? `<a href="${project.links.live}" target="_blank" class="card-action-btn primary" style="font-size: 1rem; padding: 12px 24px;">Live Demo <i class="fas fa-arrow-up-right-from-square"></i></a>` : ''}
                                    <button class="card-action-btn secondary modal-open-btn" style="font-size: 1rem; padding: 12px 24px;">Full Specs</button>
                                    <div class="flip-pill-btn flip-back-btn hover-target" style="padding: 12px 24px; font-size: 1rem; margin-left: auto;">
                                        <span>Touch to <span class="styled-flip-text"><b><i><span class="f-blue">F</span><span class="lip-white">LIP</span></i></b></span> <i class="fas fa-undo" style="margin-left: 6px; color: #00f0ff;"></i></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                const modalBtn = card.querySelector('.modal-open-btn');
                if (modalBtn) {
                    modalBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openModal(project);
                    });
                }

                const frontFace = card.querySelector('.large-flip-card-front');
                const backFace = card.querySelector('.large-flip-card-back');
                const inner = card.querySelector('.large-flip-card-inner');
                let isAnimating = false;

                function syncPointerEvents() {
                    const flipped = card.classList.contains('is-flipped');
                    if (flipped) {
                        frontFace.style.pointerEvents = 'none';
                        backFace.style.pointerEvents = 'auto';
                    } else {
                        frontFace.style.pointerEvents = 'auto';
                        backFace.style.pointerEvents = 'none';
                    }
                    isAnimating = false;
                }

                // Sync after CSS transition ends
                if (inner) {
                    inner.addEventListener('transitionend', (e) => {
                        if (e.propertyName === 'transform') {
                            syncPointerEvents();
                        }
                    });
                }

                // Initial state
                syncPointerEvents();

                card.addEventListener('click', (e) => {
                    if (e.target.closest('a, .modal-open-btn')) return;
                    if (isAnimating) return;
                    isAnimating = true;

                    // Immediately allow clicks to pass through both faces during transition
                    frontFace.style.pointerEvents = 'none';
                    backFace.style.pointerEvents = 'none';

                    card.classList.toggle('is-flipped');
                    if (typeof SoundEngine !== 'undefined' && SoundEngine.playClick) {
                        try { SoundEngine.playClick(); } catch(err) {}
                    }

                    // Fallback in case transitionend doesn't fire
                    setTimeout(() => {
                        syncPointerEvents();
                    }, 900);
                });

                projectsGrid.appendChild(card);
            });
        }

        // Add global click sound listener for interactive elements
        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('.hover-target, a, button, .project-card, .skill-card');
            if (target) {
                SoundEngine.playClick();
            }
        });

        // --- 3. MODAL & API LOGIC ---
        const projectModal = document.getElementById('project-modal');
        const aiSummaryModal = document.getElementById('ai-summary-modal');
        let currentProjectName = null;

        function openModal(project) {
            if (!projectModal) return;

            SoundEngine.playSweep(true);

            currentProjectName = project.title;

            const titleEl = document.getElementById('modal-project-title');
            if (titleEl) titleEl.textContent = project.title;

            const descContainer = document.getElementById('modal-project-description');
            if (descContainer) {
                descContainer.innerHTML = `<p>${project.main_desc}</p>`;
                if (project.points) {
                    const ul = document.createElement('ul');
                    project.points.forEach(pt => {
                        const li = document.createElement('li'); li.innerHTML = pt; ul.appendChild(li);
                    });
                    descContainer.appendChild(ul);
                }
            }

            const stackContainer = document.getElementById('modal-project-stack');
            if (stackContainer) {
                stackContainer.innerHTML = '';
                project.stack.forEach(tech => {
                    const span = document.createElement('span'); span.className = 'skill-tag'; span.textContent = tech;
                    stackContainer.appendChild(span);
                });
            }

            const liveLnk = document.getElementById('modal-link-live');
            if (liveLnk) {
                liveLnk.style.display = project.links.live ? 'inline-flex' : 'none';
                liveLnk.href = project.links.live || '#';
            }

            const gitLnk = document.getElementById('modal-link-github');
            if (gitLnk) {
                gitLnk.style.display = project.links.github ? 'inline-flex' : 'none';
                gitLnk.href = project.links.github || '#';
            }

            projectModal.style.display = 'flex';
        }

        const projModalClose = document.getElementById('modal-close-btn');
        if (projModalClose) projModalClose.onclick = () => {
            SoundEngine.playSweep(false);
            projectModal.style.display = 'none';
        }

        const aiModalClose = document.getElementById('ai-summary-close-btn');
        if (aiModalClose) aiModalClose.onclick = () => {
            SoundEngine.playSweep(false);
            aiSummaryModal.style.display = 'none';
        }

        // Gemini AI Fetch
        const aiSummaryBtn = document.getElementById('modal-ai-summary-btn');
        if (aiSummaryBtn) {
            aiSummaryBtn.addEventListener('click', async () => {
                if (!currentProjectName) return;
                const textEl = document.getElementById('ai-summary-text');
                if (textEl) textEl.innerHTML = `<i>Establishing connection to LLM cluster...</i>`;

                SoundEngine.playSweep(true);
                if (aiSummaryModal) aiSummaryModal.style.display = 'flex';

                try {
                    const prompt = `Provide a concise, 2-sentence AI-generated summary for the project: "${currentProjectName}". Focus on its core functionality and tech stack. Make it sound highly professional for an AI engineer portfolio.`;
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });

                    if (!response.ok) throw new Error("API Error");
                    const result = await response.json();
                    if (textEl) textEl.textContent = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Summary generation failed.";
                } catch (error) {
                    if (textEl) textEl.textContent = "Error communicating with AI Service.";
                }
            });
        }

        // --- 4. UI INTERACTIONS (Scroll, Custom Ring Cursor, Observer) ---
        const cursorDot = document.getElementById('cursor-dot');
        const cursorRing = document.getElementById('cursor-ring');

        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let ringX = mouseX, ringY = mouseY;
        let normX = 0, normY = 0, scrollPercent = 0;

        // Listen to mouse movements for PC parallax
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            normX = (e.clientX / window.innerWidth) * 2 - 1;
            normY = -(e.clientY / window.innerHeight) * 2 + 1;
            if (cursorDot) {
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
            }
        });

        function animateCursor() {
            // Cursor ring lerp
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            if (cursorRing) {
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        function initCursorHover() {
            document.body.addEventListener('mouseover', (e) => {
                if (!cursorDot || !cursorRing) return;
                const target = e.target.closest('.hover-target, a, button, h1, h2, h3, .project-card, .large-flip-card, .skill-card, .editorial-card, .cert-link, .nav-link, .nav-logo, .contact-link-icon');

                if (target) {
                    if (!target.contains(e.relatedTarget)) {
                        SoundEngine.playHover();
                    }

                    // Context-aware cursor text
                    let cursorHtml = '';
                    if (target.classList.contains('live-demo-btn') || (target.innerText && target.innerText.includes('Demo'))) {
                        cursorHtml = 'DEMO';
                    } else if (target.classList.contains('project-card') || target.classList.contains('large-flip-card') || target.closest('.large-flip-card')) {
                        cursorHtml = '<span class="styled-flip-text" style="font-size: 13px;"><b><i><span class="f-blue">F</span><span class="lip-white">LIP</span></i></b></span>';
                    } else if (target.classList.contains('resume-btn')) {
                        cursorHtml = 'GET';
                    }

                    if (cursorHtml) {
                        cursorDot.innerHTML = cursorHtml;
                        cursorDot.style.width = '70px';
                        cursorDot.style.height = '70px';
                        cursorDot.style.background = 'rgba(10, 12, 20, 0.92)';
                        cursorDot.style.border = '1px solid rgba(0, 240, 255, 0.6)';
                        cursorDot.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.4)';
                        cursorDot.style.mixBlendMode = 'normal';
                        cursorRing.style.width = '0px';
                        cursorRing.style.height = '0px';
                        cursorRing.style.opacity = '0';
                    } else {
                        cursorDot.innerHTML = '';
                        cursorDot.style.width = '45px';
                        cursorDot.style.height = '45px';
                        cursorDot.style.background = '#ffffff';
                        cursorDot.style.border = 'none';
                        cursorDot.style.boxShadow = 'none';
                        cursorDot.style.mixBlendMode = 'difference';
                        cursorRing.style.width = '0px';
                        cursorRing.style.height = '0px';
                        cursorRing.style.opacity = '0';
                    }
                }
            });

            document.body.addEventListener('mouseout', (e) => {
                if (!cursorDot || !cursorRing) return;
                const target = e.target.closest('.hover-target, a, button, h1, h2, h3, .project-card, .large-flip-card, .skill-card, .editorial-card, .cert-link, .nav-link, .nav-logo, .contact-link-icon');

                if (target && !target.contains(e.relatedTarget)) {
                    cursorDot.innerHTML = '';
                    cursorDot.style.width = '8px';
                    cursorDot.style.height = '8px';
                    cursorDot.style.background = '#ffffff';
                    cursorDot.style.border = 'none';
                    cursorDot.style.boxShadow = 'none';
                    cursorDot.style.mixBlendMode = 'difference';
                    cursorRing.style.width = '36px';
                    cursorRing.style.height = '36px';
                    cursorRing.style.opacity = '1';
                }
            });
        }
        initCursorHover();

        // Scroll Tracking & Nav Highlight
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');

        let currentSection = 'home';
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Check which section's top edge is closest to (but above) the viewport center
                    let newCurrent = 'home';
                    const trigger = window.innerHeight * 0.35; // 35% from top of viewport

                    sections.forEach(sec => {
                        const rect = sec.getBoundingClientRect();
                        // A section is "current" if its top has scrolled above the trigger line
                        // AND its bottom is still below it (i.e. we're still inside it)
                        if (rect.top <= trigger && rect.bottom > trigger) {
                            newCurrent = sec.getAttribute('id');
                        }
                    });

                    if (newCurrent !== currentSection) {
                        currentSection = newCurrent;
                        navLinks.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href').includes(currentSection));
                        });
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Intersection Observer (Fade in)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.editorial-card, .section-title, .skills-marquee-container').forEach(el => observer.observe(el));

        // --- 5. THE NEXUS WEBGL ENGINE (REMOVED) ---

        // --- PRE-LOADER & FLIP ANIMATION LOGIC ---
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const loaderBar = document.getElementById('loader-bar');
        const loaderText = document.getElementById('loader-percentage');
        const loaderWrapper = document.getElementById('loader');
        const dynamicSuuu = document.getElementById('dynamic-suuu');
        const targetLogoText = document.getElementById('nav-logo-text');

        let suuuText = "S";
        let hasTriggeredAppReady = false;

        function updateRealLoadingProgress(pct) {
            if (hasTriggeredAppReady) return;

            if (loaderBar) loaderBar.style.width = `${pct}%`;
            if (loaderText) loaderText.innerText = `${pct}%`;

            if (pct < 30) suuuText = "S";
            else if (pct < 60) suuuText = "Su";
            else if (pct < 90) suuuText = "Suu";
            else suuuText = "Suuu!";
            if (dynamicSuuu) dynamicSuuu.innerText = suuuText;

            if (pct >= 100) {
                hasTriggeredAppReady = true;
                if (loaderText) loaderText.innerHTML = `<span class="loader-ready-text">SYSTEM READY</span>`;

                setTimeout(() => {
                    document.body.classList.add('app-ready');
                    document.body.style.overflow = '';

                    try {
                        if (dynamicSuuu && targetLogoText) {
                            dynamicSuuu.innerText = "SUPROVO";
                            dynamicSuuu.style.animation = "none";
                            dynamicSuuu.style.textShadow = "none";

                            const barContainer = document.querySelector('.loader-bar-container');
                            if (barContainer) barContainer.style.opacity = '0';
                            if (loaderText) loaderText.style.opacity = '0';

                            const startRect = dynamicSuuu.getBoundingClientRect();
                            const targetRect = targetLogoText.getBoundingClientRect();

                            if (targetRect && targetRect.width > 0) {
                                const moveX = (targetRect.left + targetRect.width / 2) - (startRect.left + startRect.width / 2);
                                const moveY = (targetRect.top + targetRect.height / 2) - (startRect.top + startRect.height / 2);
                                const scaleW = targetRect.width / Math.max(startRect.width, 1);

                                dynamicSuuu.style.transition = "transform 1s cubic-bezier(0.77, 0, 0.175, 1), color 1s, letter-spacing 1s";
                                dynamicSuuu.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleW})`;
                                dynamicSuuu.style.color = "var(--text-main)";
                                dynamicSuuu.style.letterSpacing = "1px";
                            }
                        }
                    } catch (err) {
                        console.warn("Logo fly animation bypassed:", err);
                    }

                    if (loaderWrapper) {
                        loaderWrapper.classList.add('slide-out');
                        loaderWrapper.style.pointerEvents = "none";
                    }

                    setTimeout(() => {
                        if (loaderWrapper) loaderWrapper.style.display = 'none';
                        if (targetLogoText) targetLogoText.style.opacity = "1";
                    }, 1000);

                }, 300);

            }
        }

        // --- FRAME SEQUENCE LOGIC (Scroll-driven 4K Engine) ---
        const seqCanvas = document.getElementById('seq-canvas');
        const seqOverlay = document.getElementById('seq-overlay');
        const seqCtx = seqCanvas ? seqCanvas.getContext('2d', { alpha: false }) : null;

        const TOTAL_FRAMES = 1200; // 1,200 clean fast-forwarded frames
        const GIF_LOOP_FRAMES = 40; // Bottom section GIF loop range
        const GIF_START_INDEX = TOTAL_FRAMES - GIF_LOOP_FRAMES; // Frame 1160 (0-indexed 1159)

        const frames = new Array(TOTAL_FRAMES).fill(null);
        let framesLoaded = 0;
        let currentFrameIdx = -1;
        let appReadyOpacity = 1.0;
        var cachedMaxScrollable = 1; // var so it's accessible from updateProjectsHeight

        if (seqCanvas && seqCtx) {
            function resizeCanvas() {
                const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                seqCanvas.width = Math.floor(window.innerWidth * dpr);
                seqCanvas.height = Math.floor(window.innerHeight * dpr);
                seqCtx.imageSmoothingEnabled = true;
                seqCtx.imageSmoothingQuality = 'high';
                currentFrameIdx = -1; // Force redraw on resize
                if (framesLoaded > 0) drawFrame(Math.max(currentFrameIdx, 0));
            }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            // Direct Fast Preloader for ALL 1,200 frames
            function loadFrame(frameIdx) {
                if (frameIdx < 0 || frameIdx >= TOTAL_FRAMES || frames[frameIdx]) return;
                const img = new Image();
                img.src = `try/frames_webp/frame_${String(frameIdx + 1).padStart(4, '0')}.webp`;
                img.onload = () => {
                    frames[frameIdx] = img;
                    framesLoaded++;

                    const pct = Math.min(Math.floor((framesLoaded / 30) * 100), 100);
                    updateRealLoadingProgress(pct);

                    if (framesLoaded === 1 || frameIdx === 0) {
                        resizeCanvas();
                        drawFrame(0);
                    }
                };
            }

            // Immediately load first 30 frames for instant visual render
            for (let f = 0; f < 30; f++) {
                loadFrame(f);
            }

            // Progressive loader for remaining 1170 frames in background batches
            let nextFrameToLoad = 30;
            function loadRestOfFrames() {
                if (nextFrameToLoad < TOTAL_FRAMES) {
                    const batchEnd = Math.min(nextFrameToLoad + 10, TOTAL_FRAMES);
                    for (let f = nextFrameToLoad; f < batchEnd; f++) {
                        loadFrame(f);
                    }
                    nextFrameToLoad = batchEnd;
                    setTimeout(loadRestOfFrames, 200);
                }
            }
            setTimeout(loadRestOfFrames, 500);

            // Instant Fallback Renderer
            function getBestLoadedFrame(frameIdx) {
                if (frames[frameIdx] && frames[frameIdx].complete && frames[frameIdx].naturalWidth > 0) return frames[frameIdx];
                if (frames[0] && frames[0].complete && frames[0].naturalWidth > 0) return frames[0];
                for (let offset = 1; offset < 50; offset++) {
                    const left = frameIdx - offset;
                    const right = frameIdx + offset;
                    if (left >= 0 && frames[left] && frames[left].complete && frames[left].naturalWidth > 0) return frames[left];
                    if (right < TOTAL_FRAMES && frames[right] && frames[right].complete && frames[right].naturalWidth > 0) return frames[right];
                }
                return null;
            }

            function drawFrame(idx) {
                if (!seqCtx) return;
                const img = getBestLoadedFrame(idx);
                if (!img) return;

                const cw = seqCanvas.width;
                const ch = seqCanvas.height;
                if (cw === 0 || ch === 0) return;

                const iw = img.naturalWidth || img.width;
                const ih = img.naturalHeight || img.height;
                const scale = Math.max(cw / iw, ch / ih);
                const dw = iw * scale;
                const dh = ih * scale;
                const dx = (cw - dw) / 2;
                const dy = (ch - dh) / 2;

                seqCtx.drawImage(img, dx, dy, dw, dh);
            }

            let gifFrame = GIF_START_INDEX;
            let gifDirection = 1;

            function recalcMaxScrollable() {
                cachedMaxScrollable = Math.max((document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight, 1);
            }
            window.addEventListener('resize', recalcMaxScrollable);
            setTimeout(recalcMaxScrollable, 100);
            setTimeout(recalcMaxScrollable, 600);
            setTimeout(recalcMaxScrollable, 1500);

            function renderLoop() {
                const scrollY = window.scrollY || window.pageYOffset || 0;
                const maxScrollable = cachedMaxScrollable;
                const scrollPercent = Math.min(Math.max(scrollY / maxScrollable, 0), 1.0);

                // Direct frame mapping from scroll position
                const scrollFrame = Math.min(Math.max(Math.round(scrollPercent * (TOTAL_FRAMES - 1)), 0), TOTAL_FRAMES - 1);

                let displayFrame = scrollFrame;

                // SMART ADAPTIVE CONTINUOUS GIF LOOP FOR LAST BLOCK (Contact section):
                if (scrollFrame >= GIF_START_INDEX) {
                    gifFrame += 0.4 * gifDirection;
                    if (gifFrame >= TOTAL_FRAMES - 1) {
                        gifFrame = TOTAL_FRAMES - 1;
                        gifDirection = -1;
                    } else if (gifFrame <= GIF_START_INDEX) {
                        gifFrame = GIF_START_INDEX;
                        gifDirection = 1;
                    }
                    displayFrame = Math.round(gifFrame);
                } else {
                    gifFrame = GIF_START_INDEX; // Reset
                }

                if (displayFrame !== currentFrameIdx) {
                    currentFrameIdx = displayFrame;
                    drawFrame(currentFrameIdx);
                }

                // Fade in canvas and overlay after loader completes
                if (document.body.classList.contains('app-ready')) {
                    appReadyOpacity = Math.min(appReadyOpacity + 0.035, 1.0);
                }

                seqCanvas.style.opacity = appReadyOpacity.toFixed(3);
                if (seqOverlay) seqOverlay.style.opacity = appReadyOpacity.toFixed(3);

                requestAnimationFrame(renderLoop);
            }
            renderLoop();
        }
        // --- 6. ID CARD PENDULUM PHYSICS ---
        const idCard = document.getElementById('id-card');
        const lineLeft = document.getElementById('lanyard-line-left');
        const lineRight = document.getElementById('lanyard-line-right');
        const lineLeftBg = document.getElementById('lanyard-line-left-bg');
        const lineRightBg = document.getElementById('lanyard-line-right-bg');
        const physicsContainer = document.getElementById('physics-container');

        if (idCard && lineLeft && lineRight && physicsContainer) {
            let isDragging = false;
            let anchorX = 0, anchorY = -140;
            let cardX = 0, cardY = 0;
            let velocityX = 0, velocityY = 0;
            let restLength = 380;
            const k = 0.055;
            const damp = 0.88;
            const gravity = 1.8;

            let dragOffsetX = 0, dragOffsetY = 0;
            let initialTopMargin = null;

            function updateAnchor() {
                const rect = physicsContainer.getBoundingClientRect();
                anchorX = rect.width / 2;
                if (initialTopMargin === null || initialTopMargin <= 0) {
                    const scrollY = window.scrollY || document.documentElement.scrollTop;
                    initialTopMargin = Math.max(80, rect.top + scrollY);
                }
                anchorY = -initialTopMargin; // Fixed relative to top of container, aligned to top of screen when scrollY=0
            }

            updateAnchor();
            cardX = anchorX;
            cardY = anchorY + restLength;

            function physicsLoop() {
                updateAnchor();

                // Keep ID card fully visible and interactive so it scrolls up naturally with page
                idCard.style.opacity = "1";
                idCard.style.pointerEvents = "auto";
                lineLeft.style.opacity = "0.8";
                lineRight.style.opacity = "0.8";
                if (lineLeftBg) lineLeftBg.style.opacity = "0.4";
                if (lineRightBg) lineRightBg.style.opacity = "0.4";

                if (!isDragging) {
                    const dx = cardX - anchorX;
                    const dy = cardY - anchorY;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                    const force = (distance - restLength) * k;
                    const fx = -(dx / distance) * force;
                    const fy = -(dy / distance) * force;

                    velocityY += gravity;
                    velocityX += fx;
                    velocityY += fy;

                    // Apply a subtle, organic wind force
                    const time = Date.now() / 1500;
                    const windForce = Math.sin(time) * 0.12 + Math.sin(time * 2.3) * 0.04;
                    velocityX += windForce;

                    velocityX *= damp;
                    velocityY *= damp;

                    cardX += velocityX;
                    cardY += velocityY;
                }

                // Smooth rotation based on horizontal swing
                const angle = (cardX - anchorX) * 0.015 + (velocityX * 0.08);
                const rad = angle * (Math.PI / 180);

                const cardWidth = idCard.offsetWidth || 215;
                idCard.style.transform = `translate(${cardX - cardWidth / 2}px, ${cardY}px) rotate(${angle}deg)`;

                // Dual lanyard string anchors at top margin
                const anchorOffset = 45;
                const anchorLeftX = anchorX - anchorOffset;
                const anchorRightX = anchorX + anchorOffset;

                // Attachment points on clips (left & right clips)
                const clipDistance = 62; // Offset from card center
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);

                const clipLeftX = cardX - clipDistance * cos;
                const clipLeftY = cardY - clipDistance * sin;
                const clipRightX = cardX + clipDistance * cos;
                const clipRightY = cardY + clipDistance * sin;

                [lineLeft, lineLeftBg].forEach(el => {
                    if (!el) return;
                    el.setAttribute('x1', anchorLeftX);
                    el.setAttribute('y1', anchorY);
                    el.setAttribute('x2', clipLeftX);
                    el.setAttribute('y2', clipLeftY);
                });

                [lineRight, lineRightBg].forEach(el => {
                    if (!el) return;
                    el.setAttribute('x1', anchorRightX);
                    el.setAttribute('y1', anchorY);
                    el.setAttribute('x2', clipRightX);
                    el.setAttribute('y2', clipRightY);
                });

                requestAnimationFrame(physicsLoop);
            }

            idCard.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = physicsContainer.getBoundingClientRect();
                dragOffsetX = (e.clientX - rect.left) - cardX;
                dragOffsetY = (e.clientY - rect.top) - cardY;
                velocityX = 0; velocityY = 0;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const rect = physicsContainer.getBoundingClientRect();
                const prevX = cardX; const prevY = cardY;
                cardX = (e.clientX - rect.left) - dragOffsetX;
                cardY = (e.clientY - rect.top) - dragOffsetY;
                velocityX = cardX - prevX; velocityY = cardY - prevY;
            });

            window.addEventListener('mouseup', () => { isDragging = false; });

            idCard.addEventListener('touchstart', (e) => {
                isDragging = true;
                const rect = physicsContainer.getBoundingClientRect();
                const touch = e.touches[0];
                dragOffsetX = (touch.clientX - rect.left) - cardX;
                dragOffsetY = (touch.clientY - rect.top) - cardY;
                velocityX = 0; velocityY = 0;
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                // Try to prevent scroll if the user is dragging the card, only works if non-passive but we handle it gracefully
                if (e.cancelable) e.preventDefault();
                const rect = physicsContainer.getBoundingClientRect();
                const touch = e.touches[0];
                const prevX = cardX; const prevY = cardY;
                cardX = (touch.clientX - rect.left) - dragOffsetX;
                cardY = (touch.clientY - rect.top) - dragOffsetY;
                velocityX = cardX - prevX; velocityY = cardY - prevY;
            }, { passive: false });

            window.addEventListener('touchend', () => { isDragging = false; });

            physicsLoop();
        }

        // --- 7. MATRIX CODE RAIN ANIMATION (ONLY ID CARD BG) ---
        const matrixCanvas = document.getElementById('id-matrix-canvas');
        if (matrixCanvas && idCard) {
            const mCtx = matrixCanvas.getContext('2d');
            const chars = '0110100101アイウエオカキクケコサシスセソタチツテト0123456789<>/*={}+-';
            const fontSz = 9;
            let cols = 0;
            let drops = [];

            function initMatrix() {
                matrixCanvas.width = 230;
                matrixCanvas.height = 350;
                cols = Math.floor(matrixCanvas.width / fontSz);
                drops = [];
                for (let i = 0; i < cols; i++) {
                    drops[i] = Math.floor(Math.random() * -25);
                }
            }

            initMatrix();

            function renderMatrix() {
                // Pause background Matrix drawing when scrolled out of view to save CPU/GPU cycles
                if ((window.scrollY || window.pageYOffset || 0) > window.innerHeight * 1.2) return;

                // Dark translucent trail fade
                mCtx.fillStyle = 'rgba(10, 10, 15, 0.22)';
                mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                mCtx.font = fontSz + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const char = chars.charAt(Math.floor(Math.random() * chars.length));
                    const x = i * fontSz;
                    const y = drops[i] * fontSz;

                    // High contrast head of rain drop
                    if (Math.random() > 0.88) {
                        mCtx.fillStyle = '#ffffff';
                    } else {
                        mCtx.fillStyle = 'rgba(0, 240, 255, 0.7)';
                    }

                    mCtx.fillText(char, x, y);

                    if (y > matrixCanvas.height && Math.random() > 0.95) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            setInterval(renderMatrix, 40);
        }

        // --- 8. HORIZONTAL PROJECTS SCROLL LOGIC ---
        const projectsWrapper = document.getElementById('projects');
        const projectsTrack = document.getElementById('projects-grid');

        function getMaxHScroll() {
            if (!projectsTrack) return 0;
            return Math.max(projectsTrack.scrollWidth - window.innerWidth, 0);
        }

        function updateProjectsHeight() {
            if (!projectsWrapper || !projectsTrack) return;
            const maxH = getMaxHScroll();
            // Wrapper height = viewport + horizontal distance to scroll
            // Use a 0.5 ratio so the user scrolls 2x the vertical pixels per 1 horizontal pixel
            // This makes the experience slower and more controlled
            const wrapperH = window.innerHeight + maxH * 0.5;
            projectsWrapper.style.height = wrapperH + 'px';

            // IMPORTANT: Recalculate the frame-sequence scroll cache
            // so the background video doesn't break from the added height
            cachedMaxScrollable = Math.max(
                (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight, 1
            );
        }

        window.addEventListener('load', updateProjectsHeight);
        window.addEventListener('resize', updateProjectsHeight);
        setTimeout(updateProjectsHeight, 200);
        setTimeout(updateProjectsHeight, 1000);

        // Smooth lerp-based horizontal scroll
        let hScrollTarget = 0;
        let hScrollCurrent = 0;
        const LERP_FACTOR = 0.08; // Lower = smoother/slower glide

        window.addEventListener('scroll', () => {
            if (!projectsWrapper || !projectsTrack) return;
            const rect = projectsWrapper.getBoundingClientRect();
            if (rect.top > window.innerHeight || rect.bottom < 0) return;

            const maxH = getMaxHScroll();

            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                const scrollableVert = rect.height - window.innerHeight;
                const progress = Math.min(Math.abs(rect.top) / Math.max(scrollableVert, 1), 1);
                hScrollTarget = progress * maxH;
            } else if (rect.top > 0) {
                hScrollTarget = 0;
            } else {
                hScrollTarget = maxH;
            }
        });

        function smoothHScroll() {
            // Lerp current toward target
            hScrollCurrent += (hScrollTarget - hScrollCurrent) * LERP_FACTOR;

            // Snap when close enough to avoid endless micro-updates
            if (Math.abs(hScrollTarget - hScrollCurrent) < 0.5) {
                hScrollCurrent = hScrollTarget;
            }

            if (projectsTrack) {
                projectsTrack.style.transform = `translateX(-${hScrollCurrent}px)`;
            }
            requestAnimationFrame(smoothHScroll);
        }
        requestAnimationFrame(smoothHScroll);


window.addEventListener("scroll", () => {
    const parallaxBg = document.getElementById("parallax-bg");
    if (parallaxBg) {
        let scrollPos = window.scrollY;
        // Move the background slower than the scroll speed
        parallaxBg.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }
});

