 // ============================================================
// श्री हनुमान चालीसा — Interactive Devotional Website
// ============================================================


// ------------------------------------------------------------
// TAB SWITCHING
// ------------------------------------------------------------

function switchTab(tabId, event) {

    // Hide all sections
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active state from desktop buttons
    document.querySelectorAll('.nav-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    const target = document.getElementById(tabId);

    if (target) {
        target.classList.add('active');
    }

    // Activate clicked button
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {

        const matchingButton =
            document.querySelector(
                `.nav-tabs .tab-btn[onclick*="'${tabId}'"]`
            );

        if (matchingButton) {
            matchingButton.classList.add('active');
        }
    }

    // Smooth scroll on mobile
    if (window.innerWidth < 768) {

        const container = document.querySelector('.container');

        if (container) {
            container.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Update URL
    history.replaceState(null, '', `#${tabId}`);
}


// ------------------------------------------------------------
// PATH START EXPERIENCE
// ------------------------------------------------------------

function startPath() {

    const overlay = document.getElementById('startOverlay');

    if (overlay) {
        overlay.hidden = false;
    }
}


function closeStartOverlay() {

    const overlay = document.getElementById('startOverlay');

    if (overlay) {
        overlay.hidden = true;
    }

    document.body.classList.add('path-started');

    const path = document.getElementById('path');

    if (path) {
        path.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


function beginSacredPath() {

    const overlay = document.getElementById('startOverlay');

    if (overlay) {
        overlay.hidden = true;
    }

    document.body.classList.add('path-started');

    // Play Shankh
    playShankh();

    // Scroll to path
    const path = document.getElementById('path');

    if (path) {
        path.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


// ------------------------------------------------------------
// SHANKH NAAD
// ------------------------------------------------------------

function playShankh() {

    const audio = document.getElementById('shankhAudio');
    const status = document.getElementById('shankhStatus');

    if (!audio) {

        playSynthesizerHarmonic(220, 3.5);

        return;
    }

    audio.currentTime = 0;

    audio.play()
        .then(() => {

            if (status) {
                status.textContent =
                    '🐚 शंख नाद संपन्न — श्रद्धा से पाठ प्रारंभ करें';
            }

        })
        .catch(() => {

            // Fallback sound
            playSynthesizerHarmonic(220, 3.5);

            if (status) {
                status.textContent =
                    '🐚 पावन शंख नाद — श्रद्धा से पाठ प्रारंभ करें';
            }
        });
}


// ------------------------------------------------------------
// RAM NAAM COUNTER
// ------------------------------------------------------------

let japCount =
    parseInt(
        localStorage.getItem('ramJapCount') || '0',
        10
    );


// Make sure count is valid
if (!Number.isFinite(japCount) || japCount < 0) {
    japCount = 0;
}


// Update counter UI
function updateJapUI() {

    const display =
        document.getElementById('japCountDisplay');

    const milestone =
        document.getElementById('japMilestone');

    const progressBar =
        document.getElementById('japProgressBar');


    // Counter
    if (display) {

        display.textContent =
            japCount.toLocaleString('hi-IN');
    }


    // Milestones
    const milestones = [
        108,
        216,
        501,
        1008,
        10080
    ];


    const next =
        milestones.find(
            number => japCount < number
        );


    if (milestone) {

        if (next) {

            milestone.textContent =
                `अगला संकल्प: ${next.toLocaleString('hi-IN')} नाम`;

        } else {

            milestone.textContent =
                '🙏 आपका जप निरंतर बढ़ता रहे';
        }
    }


    // Progress bar
    if (progressBar) {

        const target = next || 10080;

        const previous =
            milestones
                .slice()
                .reverse()
                .find(number => number <= japCount) || 0;


        const range =
            Math.max(
                1,
                target - previous
            );


        const progress =
            Math.min(
                100,
                Math.max(
                    0,
                    ((japCount - previous) / range) * 100
                )
            );


        progressBar.style.width =
            `${progress}%`;
    }
}


// Initial UI
updateJapUI();


// Increase Ram Naam count
function incrementJap() {

    japCount++;


    // Save locally
    localStorage.setItem(
        'ramJapCount',
        String(japCount)
    );


    // Update screen
    updateJapUI();


    // Play Ram sound
    const ramAudio =
        document.getElementById('ramAudio');


    if (ramAudio) {

        ramAudio.currentTime = 0;

        ramAudio.play()
            .catch(() => {

                playSynthesizerHarmonic(
                    330,
                    0.35
                );

            });

    } else {

        playSynthesizerHarmonic(
            330,
            0.35
        );
    }


    // Mobile vibration
    if (navigator.vibrate) {
        navigator.vibrate(35);
    }


    // Milestone notification
    const milestones = [
        108,
        216,
        501,
        1008,
        10080
    ];


    if (milestones.includes(japCount)) {

        showToast(
            `🙏 ${japCount.toLocaleString('hi-IN')} नाम पूर्ण`
        );
    }
}


// Reset counter
function resetJap() {

    if (
        confirm(
            'क्या आप नाम जप संख्या को शून्य करना चाहते हैं?'
        )
    ) {

        japCount = 0;

        localStorage.setItem(
            'ramJapCount',
            '0'
        );

        updateJapUI();
    }
}


// ------------------------------------------------------------
// MEDITATION TIMER
// ------------------------------------------------------------

let timerInterval = null;

let totalSeconds = 600;

let initialSeconds = 600;

let isTimerRunning = false;


// Update timer display
function updateDisplay() {

    const mins =
        Math.floor(
            totalSeconds / 60
        )
        .toString()
        .padStart(2, '0');


    const secs =
        (totalSeconds % 60)
        .toString()
        .padStart(2, '0');


    const display =
        document.getElementById(
            'timeDisplay'
        );


    if (display) {

        display.textContent =
            `${mins}:${secs}`;
    }


    // Update circular timer
    const ring =
        document.querySelector(
            '.timer-ring'
        );


    if (
        ring &&
        initialSeconds > 0
    ) {

        const progress =
            (
                (initialSeconds - totalSeconds) /
                initialSeconds
            ) * 360;


        ring.style.background =
            `
            radial-gradient(
                circle,
                #fffdf7 57%,
                transparent 58%
            ),
            conic-gradient(
                var(--saffron) ${progress}deg,
                var(--gold-light) ${progress}deg,
                rgba(201,151,22,.15) ${progress}deg
            )
            `;
    }
}


// Set timer
function setTimer(secs) {

    clearInterval(timerInterval);

    isTimerRunning = false;

    totalSeconds = secs;

    initialSeconds = secs;


    const actionButton =
        document.getElementById(
            'timerActionBtn'
        );


    if (actionButton) {

        actionButton.textContent =
            'प्रारंभ करें';
    }


    // Active preset
    document
        .querySelectorAll('.preset-btn')
        .forEach(button => {

            button.classList.toggle(
                'active-preset',
                button.dataset.seconds ===
                String(secs)
            );

        });


    updateDisplay();
}


// Start / Pause timer
function toggleTimer() {

    const actionButton =
        document.getElementById(
            'timerActionBtn'
        );


    // Pause
    if (isTimerRunning) {

        clearInterval(timerInterval);

        isTimerRunning = false;

        if (actionButton) {
            actionButton.textContent =
                'प्रारंभ करें';
        }

        return;
    }


    // Restart if finished
    if (totalSeconds <= 0) {

        totalSeconds =
            initialSeconds || 600;
    }


    isTimerRunning = true;


    if (actionButton) {

        actionButton.textContent =
            'विराम दें';
    }


    timerInterval =
        setInterval(() => {

            if (totalSeconds > 0) {

                totalSeconds--;

                updateDisplay();

            } else {

                clearInterval(timerInterval);

                isTimerRunning = false;


                if (actionButton) {

                    actionButton.textContent =
                        'प्रारंभ करें';
                }


                // Play Shankh when meditation ends
                playShankh();


                // Notification
                showToast(
                    '🕉️ ध्यान साधना पूर्ण'
                );
            }

        }, 1000);
}


// Reset timer
function resetTimer() {

    clearInterval(timerInterval);

    isTimerRunning = false;

    totalSeconds = 600;

    initialSeconds = 600;


    const actionButton =
        document.getElementById(
            'timerActionBtn'
        );


    if (actionButton) {

        actionButton.textContent =
            'प्रारंभ करें';
    }


    setTimer(600);
}


// ------------------------------------------------------------
// WEB AUDIO FALLBACK
// ------------------------------------------------------------

function playSynthesizerHarmonic(
    frequency,
    duration
) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return;
        }


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.type =
            'sine';


        oscillator.frequency.setValueAtTime(
            frequency,
            context.currentTime
        );


        gain.gain.setValueAtTime(
            0.25,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + duration
        );


        oscillator.connect(gain);

        gain.connect(
            context.destination
        );


        oscillator.start();

        oscillator.stop(
            context.currentTime + duration
        );


        setTimeout(() => {

            if (context.close) {
                context.close();
            }

        }, (duration + 0.2) * 1000);


    } catch (error) {

        console.log(
            'Audio fallback unavailable'
        );
    }
}


// ------------------------------------------------------------
// TOAST NOTIFICATION
// ------------------------------------------------------------

function showToast(message) {

    let toast =
        document.getElementById(
            'siteToast'
        );


    // Create toast if it doesn't exist
    if (!toast) {

        toast =
            document.createElement(
                'div'
            );


        toast.id =
            'siteToast';


        toast.className =
            'site-toast';


        document.body.appendChild(
            toast
        );
    }


    toast.textContent =
        message;


    toast.classList.add(
        'show'
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                'show'
            );

        }, 2200);
}


// ------------------------------------------------------------
// TIMER PRESET INITIALIZATION
// ------------------------------------------------------------

document
    .querySelectorAll('.preset-btn')
    .forEach(button => {

        const onclick =
            button.getAttribute(
                'onclick'
            );


        if (!onclick) {
            return;
        }


        const match =
            onclick.match(
                /setTimer\((\d+)\)/
            );


        if (match) {

            button.dataset.seconds =
                match[1];
        }

    });


// Default timer
setTimer(600);


// ------------------------------------------------------------
// RESTORE TAB FROM URL
// ------------------------------------------------------------

window.addEventListener(
    'DOMContentLoaded',
    () => {

        const hash =
            location.hash.replace(
                '#',
                ''
            );


        const validTabs = [
            'path',
            'arth',
            'dhyan',
            'jap'
        ];


        if (
            validTabs.includes(hash)
        ) {

            const button =
                document.querySelector(
                    `.nav-tabs .tab-btn[onclick*="'${hash}'"]`
                );


            switchTab(
                hash,
                {
                    currentTarget: button
                }
            );
        }


        // Register service worker
        if (
            'serviceWorker' in navigator
        ) {

            navigator.serviceWorker
                .register('./sw.js')
                .catch(() => {});
        }

    }
);


// ------------------------------------------------------------
// PWA INSTALL PROMPT
// ------------------------------------------------------------

let deferredInstallPrompt = null;


window.addEventListener(
    'beforeinstallprompt',
    event => {

        event.preventDefault();

        deferredInstallPrompt =
            event;


        const installButton =
            document.getElementById(
                'installBtn'
            );


        if (installButton) {

            installButton.hidden =
                false;
        }
    }
);


const installButton =
    document.getElementById(
        'installBtn'
    );


if (installButton) {

    installButton.addEventListener(
        'click',
        async () => {

            if (!deferredInstallPrompt) {
                return;
            }


            deferredInstallPrompt.prompt();


            await deferredInstallPrompt
                .userChoice;


            deferredInstallPrompt =
                null;


            installButton.hidden =
                true;

        }
    );
}