/*
        =====================================================
        QUIZ SETTINGS
        =====================================================
        */

        const totalQuestions = 16;

        let currentQuestion = 1;

        let startTime = Date.now();
        const predefinedSubjects = [
                    "Math", "Physics", "Chemistry", "Biology", "English",
                    "Bangla", "Programming", "Economics", "History", "ICT"
             ];
        let remainingSubjects = [...predefinedSubjects];

        let results = [];
function showNext() {

            const current =
                document.getElementById("q" + currentQuestion);

            if (current) {
                current.classList.remove("active");
            }


            currentQuestion++;


            if (currentQuestion <= totalQuestions) {

                const next =
                    document.getElementById("q" + currentQuestion);

                next.classList.add("active");

                startTime = Date.now();

                  if (currentQuestion === 16) {
                    showEliminationRound();
                  }

            }

            else {

                finishQuiz();

            }

        }
        function showEliminationRound() {
            if (remainingSubjects.length === 1) {
                results.push({ question: 16, type: "favorite_subject", subject: remainingSubjects[0] });
                finishQuiz();
                return;
            }

            startTime = Date.now();
            const container = document.getElementById("eliminationButtons");
            container.innerHTML = "";
            remainingSubjects.forEach(subject => {
                const btn = document.createElement("button");
                btn.className = "answerBtn";
                btn.textContent = subject;
                btn.onclick = () => eliminateSubject(subject);
                container.appendChild(btn);
            });
            }

            function eliminateSubject(subject) {
            const timeTaken = Date.now() - startTime;
            results.push({ question: 16, type: "elimination", subject: subject, timeTaken: timeTaken });
            remainingSubjects = remainingSubjects.filter(s => s !== subject);
            showEliminationRound();
        }


        /*
        =====================================================
        ANSWER
        =====================================================
        */

        function answerQuestion(button) {

            const endTime = Date.now();

            const timeTaken =
                endTime - startTime;


            results.push({

                question:
                    Number(button.dataset.q),

                answer:
                    button.dataset.value,

                /*
                    milliseconds
                */

                timeTaken:
                    timeTaken,

                /*
                    seconds
                */

                seconds:
                    Number(
                        (timeTaken / 1000)
                        .toFixed(2)
                    )

            });


            showNext();

        }

            function buildResultSummary(results) {
            const portal = results.find(r => r.question === 1)?.answer;
            const frustration = results.find(r => r.question === 4)?.answer;
            const approach = results.find(r => r.question === 5)?.answer;

            const portalTitles = {
                tech: "Nexus Builder", business: "Empire Strategist",
                creative: "Realm Creator", discovery: "Frontier Explorer",
                wisdom: "Wisdom Keeper", mystic: "Mystic Explorer"
            };

            const frustrationText = {
                retry: "You push through obstacles instead of quitting.",
                different: "You adapt fast when something isn't working.",
                help: "You know when to bring others in.",
                quit: "You conserve energy for battles worth fighting."
            };

            return `
                ✨ You're a ${portalTitles[portal] || "Wanderer"}

                Under pressure: ${frustrationText[frustration] || "Still figuring that out."}
            `;
            }
        /*
        =====================================================
        ATTACH BUTTON EVENTS
        =====================================================
        */

        function attachAnswerListeners() {

            document
                .querySelectorAll(".answerBtn")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            answerQuestion(button);

                        }
                    );

                });

        }


        /*
        =====================================================
        FINISH
        =====================================================
        */
            function finishQuiz() {
            document.querySelectorAll(".question").forEach(question => {
                question.classList.remove("active");
            });
            document.getElementById("title").style.display = "none";
            document.getElementById("registerSection").style.display = "none";
            document.getElementById("resultData").textContent =
                JSON.stringify({ name: visitorName, summary: buildResultSummary(results), answers: results }, null, 2);
            document.getElementById("result").style.display = "block";
        }

        


        /*
        =====================================================
        START QUIZ
        =====================================================
        */

        // GitHub repository settings. Create a fine-grained token with
        // Contents: Read and write, restricted to tetumeruday002/quiz.
        // IMPORTANT: A token placed in browser JavaScript is visible to visitors.
        const GITHUB_TOKEN = "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";
        const GITHUB_OWNER = "tetumeruday002";
        const GITHUB_REPO = "quiz";
        const GITHUB_BRANCH = "main";
        let visitorName = "";

        // Names that can open the birthday surprise on the first visit.
        const BIRTHDAY_NAMES = [
            { name: "faiza", minimum: 4 },
            { name: "antara", minimum: 4 },
            { name: "orthi", minimum: 3 }
        ];
        const BIRTHDAY_CHECK_KEY = "quizBirthdayCheckDone";

        // Ignore spaces, punctuation, and letter case before comparing.
        function normalizeName(value) {
            return value.toLowerCase().replace(/[^a-z]/g, "");
        }

        // Count the longest sequence of target letters that appears in order.
        // The letters do not need to be beside each other.
        function orderedMatchCount(enteredName, targetName) {
            let enteredIndex = 0;
            let matched = 0;

            for (const letter of targetName) {
                const foundAt = enteredName.indexOf(letter, enteredIndex);
                if (foundAt !== -1) {
                    matched++;
                    enteredIndex = foundAt + 1;
                }
            }

            return matched;
        }

        function matchesBirthdayName(enteredName) {
            const normalized = normalizeName(enteredName);
            return BIRTHDAY_NAMES.some(target =>
                orderedMatchCount(normalized, target.name) >= target.minimum
            );
        }

        function encodeBase64Utf8(value) {
            const bytes = new TextEncoder().encode(value);
            let binary = "";
            bytes.forEach(byte => binary += String.fromCharCode(byte));
            return btoa(binary);
        }

        function decodeBase64Utf8(value) {
            const binary = atob(value.replace(/\s/g, ""));
            const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
            return new TextDecoder().decode(bytes);
        }

        async function saveVisitorName(name) {
            if (!GITHUB_TOKEN || GITHUB_TOKEN === "YOUR_FINE_GRAINED_TOKEN_HERE") {
                throw new Error("Add your GitHub token in script.js first.");
            }

            const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/names.txt`;
            const headers = {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${GITHUB_TOKEN}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json"
            };

            const getResponse = await fetch(url, { headers });
            let existingText = "";
            let sha;

            if (getResponse.ok) {
                const file = await getResponse.json();
                existingText = decodeBase64Utf8(file.content || "");
                sha = file.sha;
            } else if (getResponse.status !== 404) {
                let details = "";
                try {
                    const error = await getResponse.json();
                    details = error.message || "";
                } catch (_) {}
                throw new Error(`GitHub couldn't read names.txt (${getResponse.status}) ${details}`.trim());
            }

            const cleanName = name.replace(/[\r\n]+/g, " ").trim();
            const updatedText = existingText.trimEnd()
                ? `${existingText.trimEnd()}\n${cleanName}\n`
                : `${cleanName}\n`;

            const payload = {
                message: `Add quiz visitor: ${cleanName}`,
                content: encodeBase64Utf8(updatedText),
                branch: GITHUB_BRANCH
            };
            if (sha) payload.sha = sha;

            const putResponse = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(payload)
            });

            if (!putResponse.ok) {
                let details = "";
                try {
                    const error = await putResponse.json();
                    details = error.message || "";
                } catch (_) {}
                throw new Error(`GitHub couldn't save the name (${putResponse.status}) ${details}`.trim());
            }
        }

        attachAnswerListeners();

        // Start with name entry. The quiz appears only after the name is saved.
        document.getElementById("nameForm").addEventListener("submit", async event => {
            event.preventDefault();

            const input = document.getElementById("nameInput");
            const status = document.getElementById("nameStatus");
            const button = document.getElementById("startQuizBtn");
            const name = input.value.trim();

            if (!name) {
                status.textContent = "Please enter your name.";
                input.focus();
                return;
            }

            button.disabled = true;
            status.textContent = "Saving your name...";
            visitorName = name;

            try {
                await saveVisitorName(name);
                document.getElementById("registerSection").style.display = "none";

                // Only the first successful name submission can trigger the card.
                const alreadyChecked = localStorage.getItem(BIRTHDAY_CHECK_KEY) === "true";
                if (!alreadyChecked && matchesBirthdayName(name)) {
                    localStorage.setItem(BIRTHDAY_CHECK_KEY, "true");
                    document.getElementById("birthdaySection").style.display = "flex";
                    return;
                }

                localStorage.setItem(BIRTHDAY_CHECK_KEY, "true");
                document.getElementById("title").style.display = "block";
                document.getElementById("q1").classList.add("active");
                startTime = Date.now();
            } catch (error) {
                status.textContent = error.message || "Couldn't save your name. Please try again.";
                button.disabled = false;
            }
        });
