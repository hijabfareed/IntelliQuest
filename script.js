// ============================================================================
// INTELLIQUEST — ADVANCED DEVELOPER & ENGINEERING ASSESSMENT ENGINE
// ============================================================================
// WHAT THIS CODE DOES:
// This file defines a single-page client-side assessment platform for evaluating
// engineering knowledge across four advanced technical tracks.
// The application stores quiz data locally, renders track cards dynamically,
// displays instruction screens, asks scenario-based questions, checks answers,
// and then produces a final competency scorecard with an attestation summary.
//
// WHY THIS CODE IS USED:
// This code is used to keep the quiz logic fully client-side and self-contained.
// It allows the page to run without a backend because all assessment content is
// embedded in JavaScript and then rendered into the DOM by browser code.
//
// JAVASCRIPT CONCEPTS USED:
// - const: declares values that should remain stable after initial setup
// - Arrays: organize lists of track data and question sets
// - Objects: store structured data such as track metadata and question details
// - Nested data structures: arrays inside objects, and objects inside arrays
// - DOM APIs: document.getElementById() and related methods
// - Event listeners: attach user interactions to buttons and UI elements
// - Functions: reusable logic for rendering, scoring, and state transitions
// - State management: object variables track current question index and score
//
// HOW IT WORKS:
// When the page loads, the script renders quiz track cards from the in-memory
// data structure. User interaction changes the active track and displays
// assessment questions one at a time. Each answer is checked against a correct
// index, user score is updated, and then a final result screen summarizes
// performance. The entire experience runs inside the browser without needing
// a server.
//
// CONNECTION WITH OTHER CODE:
// This file connects directly to the HTML structure in the page by selecting
// the existing DOM elements using their id values. Later functions reference
// these stored element variables to update content, show/hide sections, and
// add visual feedback to answers.
//
// Pure ECMAScript ES6+ Client-Side Diagnostic System.
// Covers four engineering tracks:
// 1. JavaScript Mastery
// 2. Deep Learning
// 3. Artificial Intelligence in Different Fields
// 4. Flutter App Development
//
// Strictly decoupled from gamification/XP elements. Focused exclusively on
// technical evaluation, scenario rationale, and attestation metrics.
// ============================================================================

// ============================================================================
// STEP 1: CONFIGURATION & QUIZ DATA STORE
// ============================================================================
// WHAT THIS CODE DOES:
// This section creates the complete in-memory assessment dataset.
// Each object in the array represents one quiz track, and each track contains
// several question objects with answer choices, the correct answer position,
// and a reasoned explanation.
//
// WHY THIS CODE IS USED:
// A structured dataset is required because the application renders different
// tracks and questions dynamically. Without this source of truth, the UI would
// need hardcoded content in the HTML and would be difficult to extend.
//
// JAVASCRIPT CONCEPTS USED:
// - const: fixed reference to the main quiz dataset
// - Array literal: stores track objects in order
// - Object literal: stores related properties under one track
// - property names: define labels such as id, title, category, image
// - nested arrays: questions are themselves stored in an array inside each track
//
// HOW IT WORKS:
// The variable QUIZ_DATA is assigned an array. That array contains four track
// objects. Each track object contains its own questions property, which is an
// array of question objects. Later, the code loops through this data to render
// cards and question prompts.
//
// CONNECTION WITH OTHER CODE:
// The rest of the application reads this data when rendering the quiz hub,
// selecting a track, displaying instruction screens, and scoring answers.
// Every question in the app comes from this dataset, so consistency is preserved.
const QUIZ_DATA = [
  {
    // WHAT THIS CODE DOES:
    // This object defines the JavaScript mastery quiz track.
    // It contains the track identity, display title, category label, icon,
    // descriptive text, image, and the array of assessment questions.
    //
    // WHY THIS CODE IS USED:
    // Every track is represented as a single object so its metadata and questions
    // can be passed around as one logical unit.
    //
    // JAVASCRIPT CONCEPTS USED:
    // - object literal
    // - property names
    // - nested array
    //
    // HOW IT WORKS:
    // JavaScript reads this object as a data structure with named properties.
    // The code later retrieves these property values to populate the UI.
    //
    // CONNECTION WITH OTHER CODE:
    // The selected track object is passed into render functions and state updates.
    // This object is the main source for displaying course metadata and questions.
    //
    // The "id" property gives this track a unique string identifier.
    // The string "js-mastery" is a label used to match the selected track.
    // The colon separates the property name from its value.
    // The trailing comma means another property follows.
    id: "js-mastery",

    // WHAT THIS CODE DOES:
    // This property sets the visible title shown in the quiz card and scorecard.
    // It is a human-readable label for the track.
    //
    // WHY THIS CODE IS USED:
    // UI text should be stored as data so it can be rendered dynamically.
    //
    // JAVASCRIPT CONCEPTS USED:
    // - string value
    // - property assignment
    title: "JavaScript Mastery",

    // WHAT THIS CODE DOES:
    // This property stores the text used to label the track category.
    // It is displayed as a badge or tag in the interface.
    category: "V8 & RUNTIME INTERNALS",

    // WHAT THIS CODE DOES:
    // This property stores the Font Awesome icon class used for the track.
    // It will be inserted into the HTML so the CSS and icon library can display it.
    icon: "fa-brands fa-js",

    // WHAT THIS CODE DOES:
    // This property describes the technical focus of the quiz.
    // This description explains what the user will be assessed on.
    description: "Evaluates closures, execution contexts, microtask queues, prototype inheritance, and async mechanics.",

    // WHAT THIS CODE DOES:
    // This property contains the image URL used for the track card.
    // It is assigned to an <img> element later by the render function.
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=700&auto=format&fit=crop&q=80",

    // WHAT THIS CODE DOES:
    // This property begins the questions array for this track.
    // Each element in the array is one question object.
    //
    // WHY THIS CODE IS USED:
    // Arrays let JavaScript keep multiple related values in a single ordered list.
    // The array order matters because the quiz proceeds in sequence.
    //
    // JAVASCRIPT CONCEPTS USED:
    // - array literal
    // - ordered collection
    questions: [
      {
        // WHAT THIS CODE DOES:
        // This object represents one assessment question.
        // It holds the prompt, answer choices, the correct answer index, and the explanation.
        question: "Consider this asynchronous execution sequence. What is the exact logged order in modern V8?\n\nconsole.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3')).then(() => console.log('4'));\nconsole.log('5');",
        options: [
          "1, 5, 2, 3, 4",
          "1, 5, 3, 4, 2",
          "1, 3, 5, 4, 2",
          "1, 5, 3, 2, 4"
        ],
        // WHAT THIS CODE DOES:
        // This property stores the zero-based index of the correct option.
        // In JavaScript, array indexes start at 0, so 1 means the second option.
        // This value will later be compared against the user's selected index.
        correctIndex: 1,
        explanation: "Synchronous code executes first ('1', '5'). Next, microtasks queued via Promises are drained completely ('3', then chained '4') before the macrotask timer ('2') is dequeued from the event loop."
      },
      {
        question: "What is the result of executing this closure and object binding pattern?\n\nconst obj = {\n  val: 42,\n  getVal: () => this.val,\n  getRegular() { return this.val; }\n};\nconst fn = obj.getRegular;\nconsole.log(obj.getVal(), fn());",
        options: [
          "42, 42",
          "undefined, 42",
          "undefined, undefined",
          "42, undefined"
        ],
        // WHAT THIS CODE DOES:
        // This property says the correct option is the third choice in the array.
        // Because arrays are zero-indexed, index 2 refers to the third item.
        correctIndex: 2,
        explanation: "Arrow functions inherit 'this' lexically from the enclosing scope (window/global, where val is undefined). Extracting 'obj.getRegular' to a standalone reference loses implicit receiver binding, evaluating to undefined in non-strict mode."
      },
      {
        question: "How does the JavaScript engine handle variable hoisting and the Temporal Dead Zone (TDZ) in the following block?\n\nlet x = 10;\nfunction test() {\n  console.log(x);\n  let x = 20;\n}\ntest();",
        options: [
          "Logs 10 due to outer scope resolution",
          "Logs undefined because 'let' is hoisted without initialization",
          "Throws ReferenceError: Cannot access 'x' before initialization",
          "Logs 20"
        ],
        correctIndex: 2,
        explanation: "The inner 'let x' is hoisted to the top of the function's lexical environment, creating a Temporal Dead Zone from the start of the block until the declaration is evaluated. Accessing it prior triggers a ReferenceError."
      },
      {
        question: "In prototypal inheritance, what occurs when modifying an inherited property via direct assignment: `instance.arr = [1, 2, 3]` vs `instance.arr.push(4)`?",
        options: [
          "Both actions modify the prototype object directly.",
          "Direct assignment shadows the property on the instance, while .push() mutates the shared array on the prototype.",
          "Both actions shadow the property on the instance.",
          ".push() throws a TypeError if the prototype is frozen."
        ],
        correctIndex: 1,
        explanation: "Property lookup delegates up the prototype chain. Assignment (`instance.arr = ...`) creates an 'own property' directly on the instance (shadowing). Calling a mutating method like `.push()` modifies the existing referenced array stored on the prototype object."
      },
      {
        question: "Which statement accurately describes memory retention in JavaScript Closures and WeakMaps?",
        options: [
          "Closures keep every variable in the outer function scope alive indefinitely.",
          "WeakMaps prevent keys from being garbage collected if values hold references to them.",
          "WeakMap keys must be objects (or non-registered symbols) and allow held keys to be collected when no other strong references exist.",
          "Arrow functions prevent closure memory leaks automatically."
        ],
        correctIndex: 2,
        explanation: "WeakMaps hold weak references to object keys, allowing the garbage collector to reclaim key objects when no other strong references exist, avoiding memory leaks common in traditional caching."
      }
    ]
  },
  {
    // WHAT THIS CODE DOES:
    // This object defines the deep learning track.
    // It contains a different set of technical prompts related to neural networks,
    // calculus, optimization, and model behavior.
    id: "deep-learning",
    title: "Deep Learning",
    category: "NEURAL NETWORKS & CALCULUS",
    icon: "fa-solid fa-network-wired",
    description: "Evaluates backpropagation calculus, transformer attention matrices, vanishing gradients, and regularization mechanics.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&auto=format&fit=crop&q=80",
    questions: [
      {
        question: "In the Scaled Dot-Product Attention equation `Attention(Q, K, V) = softmax((Q * K^T) / √d_k) * V`, why is the dot product scaled by `1 / √d_k`?",
        options: [
          "To enforce unitary normalization across batch embeddings.",
          "To prevent the dot products from growing large in magnitude for high dimensions, which would push softmax into regions with extremely small gradients.",
          "To ensure the Query and Key matrices have matching column dimensions.",
          "To regularize the model and prevent overfitting on small sequence lengths."
        ],
        correctIndex: 1,
        explanation: "For large dimensions `d_k`, the dot products grow large in magnitude, causing softmax to yield extremely peaked probability distributions with vanishingly small gradients during backpropagation. Scaling by √d_k stabilizes variance."
      },
      {
        question: "How does Batch Normalization differ from Layer Normalization in deep architectures?",
        options: [
          "Batch Normalization computes statistics across spatial dimensions; Layer Normalization does not use mean centering.",
          "Batch Normalization computes mean and variance across the mini-batch dimension, making it dependent on batch size; Layer Normalization computes statistics across feature/channel dimensions independently per sample.",
          "Layer Normalization cannot be used during inference.",
          "Batch Normalization is exclusively designed for recurrent neural networks (RNNs)."
        ],
        correctIndex: 1,
        explanation: "Batch Norm computes statistics across batch instances, causing instability with small batch sizes. Layer Norm normalizes across the feature dimension for each individual sequence item, making it ideal for RNNs and Transformers."
      },
      {
        question: "Why does the Adam optimizer combine both Momentum and RMSProp mechanisms?",
        options: [
          "To perform exact second-order Hessian matrix inversion in O(N) time.",
          "To maintain an exponentially decaying average of past gradients (first moment) and past squared gradients (second moment) for adaptive per-parameter learning rates.",
          "To eliminate the need for backpropagation through deep hidden layers.",
          "To guarantee convergence to the global minimum in non-convex loss surfaces."
        ],
        correctIndex: 1,
        explanation: "Momentum accelerates descent in directions of persistent gradient (first moment estimation), while RMSProp scales updates inversely by the root of recent gradient magnitudes (second raw moment estimation)."
      },
      {
        question: "What primary structural mechanism allows Residual Networks (ResNets) to train networks exceeding 100+ layers without suffering from catastrophic vanishing gradients?",
        options: [
          "Replacing ReLU activations with Leaky ReLUs across all convolutional blocks.",
          "Employing Identity Shortcut Connections (`y = F(x) + x`), allowing gradients to flow unimpeded directly through the addition operator during backpropagation.",
          "Using stochastic gradient clipping at every layer boundary.",
          "Using non-parametric dense pooling layers instead of convolution kernels."
        ],
        correctIndex: 1,
        explanation: "Identity skip connections add the input directly to the residual output. When differentiating `F(x) + x`, the gradient term contains `(dF/dx + 1)`, ensuring a gradient component of 1 persists throughout the chain rule regardless of network depth."
      },
      {
        question: "How does Dropout behave differently between training and inference phases in a neural network?",
        options: [
          "Dropout randomly zeros activations with probability p during training; during inference, all units are active with activations scaled by (1 - p) or inverted during training.",
          "Dropout is active in both training and inference to provide stochastic ensemble predictions.",
          "Dropout is only applied to convolutional layers during training and fully connected layers during inference.",
          "Dropout updates the learning rate dynamically based on neuron sparsity."
        ],
        correctIndex: 0,
        explanation: "Standard Dropout deactivates a fraction p of units during training to prevent co-adaptation. At inference, the full network is used deterministically with weights/activations scaled to match expected activation magnitudes."
      }
    ]
  },
  {
    // WHAT THIS CODE DOES:
    // This object represents the applied AI systems track.
    // It contains questions about practical AI deployment in healthcare, autonomous systems, financial modeling, RAG systems, and fair governance.
    id: "applied-ai-systems",
    title: "Applied AI & Intelligent Systems",
    category: "PRACTICAL DOMAIN ARCHITECTURES",
    icon: "fa-solid fa-brain",
    description: "Evaluates production AI deployments across Healthcare, Autonomous Navigation, FinTech, and Enterprise RAG systems.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=700&auto=format&fit=crop&q=80",
    questions: [
      {
        question: "In clinical Computer Vision for radiology diagnostics, why is Model Explainability (e.g., Grad-CAM) prioritized alongside pure AUROC classification metrics?",
        options: [
          "Grad-CAM compresses the high-resolution DICOM imagery to conserve GPU VRAM.",
          "Grad-CAM provides visual heatmap localization of feature activations to verify the model bases its decision on genuine pathological lesions rather than imaging artifacts.",
          "Grad-CAM completely eliminates false negatives in diagnostic screening.",
          "Grad-CAM replaces the final Softmax layer with an ensemble voting classifier."
        ],
        correctIndex: 1,
        explanation: "Medical AI requires validation that visual inferences correspond to authentic anatomical biomarkers rather than confounding hospital watermarks, scan tags, or imaging artifacts."
      },
      {
        question: "In High-Frequency Algorithmic Finance, why are Recurrent/Transformer models often combined with Graph Neural Networks (GNNs)?",
        options: [
          "GNNs process tabular market depth order books without floating point arithmetic.",
          "GNNs model inter-asset dependencies, counterparty transaction networks, and cross-market contagion that single sequential models cannot capture.",
          "GNNs guarantee zero market slippage on automated order executions.",
          "Transformers cannot ingest time-series data without GNN tokenizers."
        ],
        correctIndex: 1,
        explanation: "Financial ecosystems involve multi-entity relational topologies (supply chains, cross-holdings). GNNs capture spatial-relational network contagion while sequence models capture temporal pricing trends."
      },
      {
        question: "In Autonomous Vehicle Perception, what is the core engineering tradeoff of 'Late Fusion' vs 'Early/Sensor Fusion' across LiDAR and Camera feeds?",
        options: [
          "Early fusion combines raw sensor point clouds/pixels prior to feature extraction requiring strict temporal calibration; late fusion merges high-level bounding box detections independently generated per sensor modality.",
          "Late fusion requires higher network bandwidth and faster compute hardware.",
          "Early fusion cannot detect 3D spatial coordinates under foggy weather.",
          "Late fusion eliminates the need for camera sensors entirely."
        ],
        correctIndex: 0,
        explanation: "Early fusion aligns raw spatial data into a single unified tensor (computationally demanding and sensitive to calibration errors), whereas Late Fusion processes each sensor independently and aggregates high-level object hypotheses."
      },
      {
        question: "In Enterprise Retrieval-Augmented Generation (RAG), what strategy best mitigates semantic hallucination during vector database document retrieval?",
        options: [
          "Increasing the LLM temperature parameter to 1.0.",
          "Implementing hybrid search (Dense Vector Embeddings + Sparse BM25 Keyword Search) combined with a Cross-Encoder Reranker.",
          "Storing vector embeddings strictly in uncompressed CSV text files.",
          "Removing all system prompts and few-shot examples."
        ],
        correctIndex: 1,
        explanation: "Dense vectors capture conceptual semantic meaning, while Sparse BM25 captures precise keyword identifiers (product codes, names). A subsequent Cross-Encoder reranks the joint results to ensure context relevance."
      },
      {
        question: "Regarding AI Ethics and Model Fairness, what does the 'Disparate Impact Ratio' metric evaluate in automated loan decisioning algorithms?",
        options: [
          "The speed discrepancy between cloud inference and on-premise execution.",
          "The ratio of favorable outcomes received by a protected demographic group relative to the majority group, evaluating institutional parity.",
          "The percentage of memory consumed by gradient tensors across different hardware nodes.",
          "The correlation between model loss and training dataset size."
        ],
        correctIndex: 1,
        explanation: "The Disparate Impact ratio measures algorithmic fairness by calculating (Favorable Rate for Protected Group) / (Favorable Rate for Unprotected Group), with values below 0.80 typically signaling adverse bias."
      }
    ]
  },
  {
    // WHAT THIS CODE DOES:
    // This object defines the Flutter development assessment track.
    // It focuses on widget trees, rendering, state, and Dart runtime behavior.
    id: "flutter-dev",
    title: "Flutter App Development",
    category: "DART RUNTIME & RENDER ENGINE",
    icon: "fa-solid fa-mobile-screen-button",
    description: "Evaluates widget render trees, InheritedWidgets, Dart isolates, asynchronous zones, and state management architectures.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&auto=format&fit=crop&q=80",
    questions: [
      {
        question: "What fundamental relationship exists between the Widget, Element, and RenderObject trees in Flutter's architecture?",
        options: [
          "Widgets are heavy mutable render nodes, Elements define styling, and RenderObjects represent compile-time bytecode.",
          "Widgets are immutable configurations; Elements represent the persistent lifecycle management nodes; RenderObjects handle layout, sizing, and compositing.",
          "RenderObjects are only generated when using StatefulWidget instances.",
          "The Element tree is completely discarded and rebuilt on every setState() invocation."
        ],
        correctIndex: 1,
        explanation: "Widgets are lightweight immutable configurations created and destroyed cheaply. The Element tree manages the persistent lifecycle hierarchy and updates the underlying RenderObject tree which performs the actual layout and painting."
      },
      {
        question: "In Dart's asynchronous execution model, how do Microtasks differ from Event loop events?",
        options: [
          "Events are executed inside web workers; Microtasks execute on native OS background threads.",
          "The Microtask queue has higher priority than the Event queue; all scheduled microtasks are fully drained before processing the next event from the Event queue (e.g., I/O, timers, user taps).",
          "Future.delayed() schedules items directly onto the Microtask queue.",
          "Streams operate exclusively within the Microtask queue."
        ],
        correctIndex: 1,
        explanation: "Dart runs a single isolate loop with two queues. The Microtask queue takes absolute precedence over the Event queue. Starving the event loop occurs if microtasks continuously enqueue more microtasks."
      },
      {
        question: "How does `InheritedWidget` optimize widget subtree rebuilds compared to passing state down constructor chains?",
        options: [
          "By caching serialized JSON widgets directly into local SQLite storage.",
          "By allowing dependent descendant elements that call `dependOnInheritedWidgetOfExactType` to subscribe specifically and only rebuild when `updateShouldNotify` returns true.",
          "By converting descendant StatefulWidgets into pure RenderObjects automatically.",
          "By executing widget build methods on a separate background Dart Isolate."
        ],
        correctIndex: 1,
        explanation: "InheritedWidget establishes an O(1) ancestor lookup context. Descendants registering dependencies only trigger rebuilds when `updateShouldNotify` returns true for the modified state data."
      },
      {
        question: "What is the key functional difference between Dart Isolates and traditional OS multi-threading?",
        options: [
          "Isolates share memory directly using synchronized mutex primitives.",
          "Isolates have their own isolated memory heaps and single-threaded event loops, communicating exclusively via asynchronous message passing (Port messaging) without shared memory locks.",
          "Isolates cannot execute mathematical computations.",
          "Isolates are supported on Flutter web, but not on iOS or Android."
        ],
        correctIndex: 1,
        explanation: "Unlike shared-memory multi-threading, Dart Isolates encapsulate their own isolated heaps and garbage collectors, preventing race conditions and thread-locking bottlenecks by relying on message passing via `SendPort` and `ReceivePort`."
      },
      {
        question: "In Dart sound null safety, what is the exact semantic difference between the `late` keyword and nullable types (`T?`)?",
        options: [
          "Both allow a variable to be assigned `null` at any time without runtime errors.",
          "`T?` explicitly allows null as a valid state; `late` declares a non-nullable variable whose initialization is deferred to runtime, throwing a `LateInitializationError` if accessed prior to assignment.",
          "`late` forces variable values to be evaluated at compile time.",
          "`late` variables are automatically garbage collected immediately after their first read."
        ],
        correctIndex: 1,
        explanation: "`T?` allows the variable to hold null. `late` indicates a non-nullable variable will be initialized before its first read; accessing it prematurely throws a runtime error rather than returning null."
      }
    ]
  },
  {
    id: "databases",
    title: "Databases",
    category: "RELATIONAL SYSTEMS & STORAGE",
    icon: "fa-solid fa-database",
    description: "Evaluates SQL design, indexing strategy, normalization, transactions, and data integrity across production systems.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&auto=format&fit=crop&q=80",
    questions: [
      {
        question: "In a relational schema, why is a surrogate primary key often preferred over a natural business key when modeling customer records?",
        options: [
          "Natural keys always guarantee faster joins than surrogate keys.",
          "Surrogate keys are immutable, compact identifiers that decouple identity from changing business attributes and simplify indexing and referential integrity.",
          "Natural keys are never allowed in relational databases.",
          "Primary keys must always contain a meaningful business value to remain valid."
        ],
        correctIndex: 1,
        explanation: "A surrogate key provides a stable, system-generated identifier independent of business changes such as email updates or name changes. This reduces update anomalies and keeps foreign-key relationships consistent and efficient."
      },
      {
        question: "What is the main purpose of database normalization beyond the first normal form?",
        options: [
          "To increase redundant data storage for better reporting speed.",
          "To minimize insertion, update, and deletion anomalies by reducing redundant and dependent data while preserving logical integrity.",
          "To remove all indexes from a schema to reduce maintenance overhead.",
          "To force every table to have exactly one foreign key."
        ],
        correctIndex: 1,
        explanation: "Normalization organizes data to reduce duplication and dependency problems. It keeps each fact in one logical place, improving integrity and making updates more predictable while preserving relational consistency."
      },
      {
        question: "Which SQL behavior best describes the difference between an inner join and a left join in a one-to-many relationship?",
        options: [
          "LEFT JOIN returns only rows that match on both sides, while INNER JOIN returns all rows from the left table regardless of matches.",
          "INNER JOIN returns only matching rows, while LEFT JOIN returns all rows from the left table and fills unmatched rows with NULL values on the right side.",
          "Both join types always duplicate rows in the same way for many-to-many structures.",
          "LEFT JOIN eliminates duplicates automatically, while INNER JOIN retains all unmatched records."
        ],
        correctIndex: 1,
        explanation: "An inner join filters to matches only. A left join preserves every row from the left table, even when there is no corresponding row on the right, which is essential for reporting partial relationships without losing the source row."
      },
      {
        question: "Why are indexes important in relational databases, and which condition makes indexing most beneficial?",
        options: [
          "Indexes make every query faster, regardless of table size or column selectivity.",
          "Indexes speed up data retrieval for frequent filtering or join conditions, especially on high-cardinality columns, but they add write overhead and must be chosen carefully.",
          "Indexes replace primary keys and automatically enforce uniqueness across all columns.",
          "Indexes are only useful for NoSQL document stores, not relational engines."
        ],
        correctIndex: 1,
        explanation: "Indexes create lookup structures that reduce search time for common queries, especially when filtering on selective columns. However, indexes also increase write cost because the index must be maintained during inserts, updates, and deletes."
      },
      {
        question: "Which statement best describes ACID guarantees in a transactional database system?",
        options: [
          "ACID ensures only availability and consistency, without isolation or durability constraints.",
          "ACID guarantees Atomicity, Consistency, Isolation, and Durability, ensuring reliable transaction processing even during failures or concurrent access.",
          "ACID is a SQL-only optimization feature used to compress indexes.",
          "ACID guarantees that all queries are executed in parallel for maximum throughput."
        ],
        correctIndex: 1,
        explanation: "ACID is a classic database property set designed to protect transaction correctness. Atomicity ensures all-or-nothing execution, consistency preserves valid states, isolation prevents dirty or conflicting reads, and durability ensures committed transactions survive failures."
      }
    ]
  },
  {
    id: "web-security",
    title: "Web Security & Cybersecurity",
    category: "APPLICATION SECURITY",
    icon: "fa-solid fa-user-shield",
    description: "Evaluates secure coding patterns, authentication boundaries, input validation, and common web vulnerability defenses.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=700&auto=format&fit=crop&q=80",
    questions: [
      {
        question: "Why is Prepared Statement parameterization considered a primary defense against SQL injection in application code?",
        options: [
          "It prevents database schema changes by locking table definitions.",
          "It separates SQL logic from user input so untrusted input is treated as data rather than executable SQL syntax.",
          "It disables all foreign key constraints during a transaction.",
          "It replaces the need for hashing passwords before storage."
        ],
        correctIndex: 1,
        explanation: "Prepared statements bind user-provided values as parameters instead of embedding them directly into the SQL command string. This prevents injection payloads from altering the query structure or logic."
      },
      {
        question: "What is the key difference between authentication and authorization in a web application?",
        options: [
          "Authentication verifies identity, while authorization decides whether a verified user is allowed to access a specific resource or action.",
          "Authentication decides access control, and authorization handles password hashing.",
          "Both are identical processes managed by the browser alone.",
          "Authentication is only for APIs; authorization applies only to databases."
        ],
        correctIndex: 0,
        explanation: "Authentication answers the question, 'Who are you?' by validating credentials. Authorization answers, 'What are you allowed to do?' by checking permissions, roles, and policy rules against the authenticated identity."
      },
      {
        question: "In a web application, why is output encoding or escaping required when rendering user-controlled data in HTML or JavaScript contexts?",
        options: [
          "It reduces HTTP response size and speeds up page load time.",
          "It prevents XSS by ensuring special characters are interpreted as data instead of active markup or script syntax.",
          "It automatically encrypts all cookies in the browser.",
          "It guarantees that CSRF tokens are always valid."
        ],
        correctIndex: 1,
        explanation: "If user-provided text is rendered without proper escaping, attackers may inject script or HTML that executes in a victim's browser. Encoding neutralizes dangerous characters so they are displayed as text rather than executable code."
      },
      {
        question: "What is the core purpose of a CSRF token in a state-changing web request?",
        options: [
          "To require users to log in using multi-factor authentication every time.",
          "To bind a request to a valid user session and validate that the request originated from the app itself rather than a malicious third-party site.",
          "To encrypt database credentials before transmission.",
          "To disable browser caching for static assets."
        ],
        correctIndex: 1,
        explanation: "CSRF protection helps ensure that a request coming from a malicious external site cannot trigger an authenticated action on behalf of the user. The token acts as a challenge/response link between the authenticated session and the request."
      },
      {
        question: "Which practice provides the strongest defense against credential theft from phishing and password reuse attacks?",
        options: [
          "Using only one long password with no rotation schedule.",
          "Reusing the same password across all services and storing it in plaintext.",
          "Using strong unique passwords with password managers, MFA, and secure password hashing on the server side.",
          "Disabling HTTPS because it blocks legitimate login flows."
        ],
        correctIndex: 2,
        explanation: "Password reuse creates a chain reaction if one service is breached. Strong unique passwords, MFA, and secure server-side hashing reduce the impact of phishing attempts and credential leaks while keeping the application resilient."
      }
    ]
  }
];

// ============================================================================
// STEP 2: DOM ELEMENT SELECTION & CACHING
// ============================================================================
// WHAT THIS CODE DOES:
// This section stores references to important HTML elements into variables.
// Instead of repeatedly calling document.getElementById() throughout the file,
// the script caches elements once and reuses them later.
//
// WHY THIS CODE IS USED:
// DOM lookups are relatively slow compared to using existing references.
// Caching improves efficiency and keeps the code easier to maintain.
//
// JAVASCRIPT CONCEPTS USED:
// - const
// - document.getElementById()
// - variable references to DOM nodes
//
// HOW IT WORKS:
// Each call to getElementById() searches the HTML document for an element whose
// id matches the provided string. The returned object is stored in a variable.
// Later functions use those variables to update text, classes, and content.
//
// CONNECTION WITH OTHER CODE:
// These DOM references are used by render functions, click handlers, and the
// score screen update logic.
const quizGridElement = document.getElementById("quiz-grid");
const quizAppContainer = document.getElementById("quiz-app-container");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Instruction Screen Node Elements
const instructionView = document.getElementById("instruction-view");
const instCategory = document.getElementById("inst-category");
const instTitle = document.getElementById("inst-title");
const instDescription = document.getElementById("inst-description");
const instQuestionCount = document.getElementById("inst-question-count");
const btnBackHub = document.getElementById("btn-back-hub");
const btnBeginQuiz = document.getElementById("btn-begin-quiz");

// Question Screen Node Elements
const questionView = document.getElementById("question-view");
const activeTrackName = document.getElementById("active-track-name");
const questionCounter = document.getElementById("question-counter");
const progressBarFill = document.getElementById("progress-bar-fill");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const explanationBox = document.getElementById("explanation-box");
const explanationText = document.getElementById("explanation-text");
const btnNextQuestion = document.getElementById("btn-next-question");

// Result Screen Node Elements
const resultView = document.getElementById("result-view");
const scorePercentage = document.getElementById("score-percentage");
const scoreFraction = document.getElementById("score-fraction");
const performanceGrade = document.getElementById("performance-grade");
const correctCountEl = document.getElementById("correct-count");
const incorrectCountEl = document.getElementById("incorrect-count");
const accuracyRatingEl = document.getElementById("accuracy-rating");
const competencyTierEl = document.getElementById("competency-tier");
const certTitle = document.getElementById("cert-title");
const certDate = document.getElementById("cert-date");
const btnRetakeQuiz = document.getElementById("btn-retake-quiz");
const btnReturnHub = document.getElementById("btn-return-hub");

// ============================================================================
// STEP 3: APPLICATION STATE MANAGEMENT
// ============================================================================
// WHAT THIS CODE DOES:
// This object stores the mutable application state for the active assessment.
// It tracks which track is selected, which question is currently visible,
// how many correct answers the user has, the selected answers, and whether
// the current question has already been answered.
//
// WHY THIS CODE IS USED:
// The UI is state-driven. The application relies on variables that represent
// the current experience and change as the user interacts with the quiz.
//
// JAVASCRIPT CONCEPTS USED:
// - let: allows state to change over time
// - object literal: keeps related state values together
// - property names: currentTrack, currentQuestionIndex, userScore, userAnswers
//
// HOW IT WORKS:
// The appState object is initialized once and then updated as the user selects
// tracks, answers questions, and finishes the assessment. The rest of the code
// reads this state to determine which question to show and how the result screen
// should be calculated.
//
// CONNECTION WITH OTHER CODE:
// Functions such as selectAssessmentTrack(), renderActiveScenario(),
// handleOptionCommit(), and compileAssessmentScorecard() all read and write this
// state object.
let appState = {
  currentTrack: null,
  currentQuestionIndex: 0,
  userScore: 0,
  userAnswers: [],
  hasAnsweredCurrent: false
};

const THEME_STORAGE_KEY = "intelliquest-theme";

function applyTheme(themeName) {
  const resolvedTheme = themeName === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);

  if (themeIcon) {
    themeIcon.className = resolvedTheme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `Toggle ${resolvedTheme === "dark" ? "light" : "dark"} mode`);
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(startTheme);
}

// ============================================================================
// STEP 4: TRACK HUB RENDERING
// ============================================================================
// WHAT THIS CODE DOES:
// This function renders the main quiz hub by generating HTML for each quiz track.
// It uses the QUIZ_DATA array to build track cards with image, category, title,
// description, and an action button.
//
// WHY THIS CODE IS USED:
// The data is dynamic, so the page cannot hardcode each card. Rendering from
// data ensures the code remains scalable and easy to maintain.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - Array.prototype.map()
// - template literals
// - string interpolation
// - .join()
// - DOM innerHTML assignment
//
// HOW IT WORKS:
// The map() method transforms each track object into a string of HTML.
// The resulting HTML strings are joined together and assigned to quizGridElement.innerHTML.
// This updates the DOM and displays the cards in the browser.
//
// CONNECTION WITH OTHER CODE:
// This function is called during initialization and creates the starting screen
// of the website. The cards later call selectAssessmentTrack() when the user clicks.
function renderTrackCards() {
  // WHAT THIS CODE DOES:
  // This line replaces the contents of the quiz grid container with HTML built
  // from the QUIZ_DATA array.
  //
  // WHY THIS CODE IS USED:
  // The grid is a dynamic section of the page that should show current track cards.
  //
  // JAVASCRIPT CONCEPTS USED:
  // - innerHTML: writes HTML into a DOM element
  // - template literal: creates HTML using embedded expressions
  quizGridElement.innerHTML = QUIZ_DATA.map((quiz) => `
    <div class="track-card">
      <div class="track-card-img-wrapper">
        <img src="${quiz.image}" alt="${quiz.title}" class="track-card-img">
        <div class="track-card-overlay"></div>
        <span class="track-category-tag">${quiz.category}</span>
      </div>
      <div class="track-card-body">
        <h3>${quiz.title}</h3>
        <p>${quiz.description}</p>
        <div class="track-card-meta">
          <span><i class="${quiz.icon}"></i> ${quiz.questions.length} Scenarios</span>
          <span><i class="fa-solid fa-microchip"></i> Senior Diagnostic</span>
        </div>
        <button class="btn btn-primary" onclick="selectAssessmentTrack('${quiz.id}')">
          <span>Evaluate Track</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// STEP 5: TRACK SELECTION LOGIC
// ============================================================================
// WHAT THIS CODE DOES:
// This function selects the user-chosen quiz track, resets state for a fresh run,
// and switches the interface from the track hub to the instruction screen.
//
// WHY THIS CODE IS USED:
// The user needs to move from a track browser into an active assessment. This
// function prepares the chosen question set and resets the score for a new run.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - Array.prototype.find()
// // - Arrow function callback
// - classList.add() and classList.remove()
// - scrollIntoView()
//
// HOW IT WORKS:
// The function searches QUIZ_DATA for the object whose id matches the selected ID.
// Once found, it assigns that object to appState.currentTrack, resets counters,
// fills in the instruction metadata, and hides or shows relevant UI sections.
//
// CONNECTION WITH OTHER CODE:
// This function is triggered by the evaluate button inside a rendered track card.
// It prepares the application state for startAssessmentSession() and renderActiveScenario().
function selectAssessmentTrack(trackId) {
  // WHAT THIS CODE DOES:
  // This line searches the QUIZ_DATA array for the object whose id matches the
  // clicked track button.
  //
  // WHY THIS CODE IS USED:
  // This ensures the selected track exists before the app tries to render it.
  //
  // JAVASCRIPT CONCEPTS USED:
  // - find(): searches for the first matching element
  // - callback function
  // - comparison with strict equality
  const selectedTrack = QUIZ_DATA.find((t) => t.id === trackId);

  // WHAT THIS CODE DOES:
  // This condition stops the function if no matching track is found.
  //
  // WHY THIS CODE IS USED:
  // It prevents null or undefined logic errors and avoids rendering broken UI.
  if (!selectedTrack) return;

  // WHAT THIS CODE DOES:
  // These assignments reset the current assessment state before the user begins.
  // They set the active track and restore all counters and answer arrays.
  appState.currentTrack = selectedTrack;
  appState.currentQuestionIndex = 0;
  appState.userScore = 0;
  appState.userAnswers = [];
  appState.hasAnsweredCurrent = false;

  // WHAT THIS CODE DOES:
  // These lines populate the instruction screen with the selected track's metadata.
  instCategory.textContent = selectedTrack.category;
  instTitle.textContent = `${selectedTrack.title} Guidelines`;
  instDescription.textContent = selectedTrack.description;
  instQuestionCount.textContent = `${selectedTrack.questions.length} Scenarios`;

  // WHAT THIS CODE DOES:
  // These lines change which UI sections are currently visible.
  // The track grid is hidden, and the assessment container is shown.
  quizGridElement.classList.add("hidden");
  quizAppContainer.classList.remove("hidden");
  instructionView.classList.remove("hidden");
  questionView.classList.add("hidden");
  resultView.classList.add("hidden");

  // WHAT THIS CODE DOES:
  // This scrolls the page so the current assessment section is visible.
  quizAppContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================================================
// STEP 6: START ASSESSMENT SESSION
// ============================================================================
// WHAT THIS CODE DOES:
// This function starts the actual quiz by hiding the instructions screen and
// showing the question screen.
//
// WHY THIS CODE IS USED:
// The assessment has multiple stages: track selection, instructions, question flow,
// and result screen. This function moves the app into the active question phase.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - classList.add()
// - classList.remove()
function startAssessmentSession() {
  // WHAT THIS CODE DOES:
  // This line hides the instruction view so the user no longer sees the overview panel.
  instructionView.classList.add("hidden");

  // WHAT THIS CODE DOES:
  // This line shows the question view so the first question becomes visible.
  questionView.classList.remove("hidden");

  // WHAT THIS CODE DOES:
  // This line calls the render function that updates the question text and options.
  renderActiveScenario();
}

// ============================================================================
// STEP 7: SCENARIO RENDERING & PROGRESSION
// ============================================================================
// WHAT THIS CODE DOES:
// This function displays the current question, updates the progress bar, and
// creates clickable answer options for the user.
//
// WHY THIS CODE IS USED:
// It updates the interface to match the current question state so the quiz feels
// like a sequence of problem screens rather than a static page.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - array indexing
// - string template literals
// - object property access
// - percentage calculation
// - DOM textContent and innerHTML updates
//
// HOW IT WORKS:
// The function reads the active track and current question index from appState.
// It calculates the progress percentage, fills the progress bar, and generates
// the list of answer buttons. Each option button is given an inline onclick
// handler that calls handleOptionCommit() with the option index.
//
// CONNECTION WITH OTHER CODE:
// This function is called when the assessment begins and again after each answer
// is moved to the next question. It keeps the UI synchronized with state.
function renderActiveScenario() {
  // WHAT THIS CODE DOES:
  // These lines read the active track and current question from the program state.
  const track = appState.currentTrack;
  const qIndex = appState.currentQuestionIndex;
  const currentQ = track.questions[qIndex];

  // WHAT THIS CODE DOES:
  // This resets the per-question answer status so the user can select an option.
  appState.hasAnsweredCurrent = false;

  // WHAT THIS CODE DOES:
  // This disables the next button until the user answers the current question.
  btnNextQuestion.disabled = true;

  // WHAT THIS CODE DOES:
  // This hides the explanation box until the current choice is evaluated.
  explanationBox.classList.add("hidden");

  // WHAT THIS CODE DOES:
  // These lines update the progress header with the active category and current question count.
  activeTrackName.textContent = track.category;
  questionCounter.textContent = `Scenario ${qIndex + 1} of ${track.questions.length}`;

  // WHAT THIS CODE DOES:
  // This calculates the current percentage of the assessment that has been completed.
  // It is used to set the width of the progress bar.
  const progressPercent = (qIndex / track.questions.length) * 100;

  // WHAT THIS CODE DOES:
  // This line adjusts the visual width of the progress bar to match the current question.
  progressBarFill.style.width = `${progressPercent}%`;

  // WHAT THIS CODE DOES:
  // This updates the visible question prompt and inserts line breaks for multi-line code.
  // The replace(/\n/g, '<br>') method turns newline characters into HTML line breaks.
  questionText.innerHTML = currentQ.question.replace(/\n/g, '<br>');

  // WHAT THIS CODE DOES:
  // This builds the answer button HTML for the current question.
  // Each option receives a button with a letter label, the text, and an onclick callback.
  optionsContainer.innerHTML = currentQ.options.map((optText, optIndex) => `
    <button class="option-btn" onclick="handleOptionCommit(${optIndex})">
      <span><strong>${String.fromCharCode(65 + optIndex)}.</strong> ${optText}</span>
      <i class="fa-regular fa-circle"></i>
    </button>
  `).join('');
}

// ============================================================================
// STEP 8: ANSWER COMMIT & IMMEDIATE RATIONALE EVALUATION
// ============================================================================
// WHAT THIS CODE DOES:
// This function checks the selected answer against the correct index, updates the
// score, paints the chosen options, and reveals the explanation for the question.
//
// WHY THIS CODE IS USED:
// The user must receive immediate feedback. This transforms the quiz from a passive
// question list into an interactive teaching tool that shows a rationale.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - strict equality comparison (===)
// - array push()
// - querySelectorAll()
// - forEach()
// - classList.add()
// - DOM style manipulation
//
// HOW IT WORKS:
// The function reads the active question from appState and compares the user's
// selected index to the correct answer index. If correct, it increments the score.
// Then it marks the correct option green and the wrong selection red, while
// revealing the explanation text.
//
// CONNECTION WITH OTHER CODE:
// This function is called directly from the onclick handler on each answer button.
// It is the primary scoring logic of the app and connects to the final results screen.
function handleOptionCommit(selectedIndex) {
  // WHAT THIS CODE DOES:
  // This condition prevents a second answer from being recorded for the same question.
  if (appState.hasAnsweredCurrent) return;

  // WHAT THIS CODE DOES:
  // This line marks the current question as answered so the user cannot click again.
  appState.hasAnsweredCurrent = true;

  // WHAT THIS CODE DOES:
  // This line gets the current question from the selected track.
  const currentQ = appState.currentTrack.questions[appState.currentQuestionIndex];

  // WHAT THIS CODE DOES:
  // This expression compares the user's chosen index with the correct answer index.
  // It returns true only when both values are exactly equal.
  const isCorrect = (selectedIndex === currentQ.correctIndex);

  // WHAT THIS CODE DOES:
  // If the answer is correct, the score increases by 1.
  if (isCorrect) {
    appState.userScore++;
  }

  // WHAT THIS CODE DOES:
  // This stores the result of the user's answer in the answers array.
  // Each object captures the question index, the selected index, and whether it was correct.
  appState.userAnswers.push({
    questionIndex: appState.currentQuestionIndex,
    selected: selectedIndex,
    isCorrect: isCorrect
  });

  // WHAT THIS CODE DOES:
  // This line selects all answer buttons in the current options container.
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  // WHAT THIS CODE DOES:
  // This loop visits each option button and updates its visual state.
  optionButtons.forEach((btn, idx) => {
    // WHAT THIS CODE DOES:
    // This adds the locked class to prevent further interaction.
    btn.classList.add("locked");

    // WHAT THIS CODE DOES:
    // If the current index matches the correct answer, the correct option receives a green highlight.
    if (idx === currentQ.correctIndex) {
      btn.classList.add("correct-choice");
      btn.querySelector("i").className = "fa-solid fa-circle-check";
    } else if (idx === selectedIndex && !isCorrect) {
      // WHAT THIS CODE DOES:
      // If the user selected an incorrect option, that button receives a red highlight.
      btn.classList.add("wrong-choice");
      btn.querySelector("i").className = "fa-solid fa-circle-xmark";
    }
  });

  // WHAT THIS CODE DOES:
  // This updates the explanation text with the technical rationale for the answer.
  explanationText.textContent = currentQ.explanation;
  explanationBox.classList.remove("hidden");

  // WHAT THIS CODE DOES:
  // This enables the next-question button so the user can progress.
  btnNextQuestion.disabled = false;
}

// ============================================================================
// STEP 9: QUESTION NAVIGATION & COMPLETION
// ============================================================================
// WHAT THIS CODE DOES:
// This function advances the quiz to the next question or calculates the final score
// when the last question is answered.
//
// WHY THIS CODE IS USED:
// The quiz needs a progression mechanism. It moves sequentially through the question array
// and only terminates the assessment when the final question is completed.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - increment operator ++
// - conditionals
// - function calls
function handleNextScenario() {
  // WHAT THIS CODE DOES:
  // This moves the index to the next question in the track.
  appState.currentQuestionIndex++;

  // WHAT THIS CODE DOES:
  // If there are more questions remaining, it shows the next question.
  if (appState.currentQuestionIndex < appState.currentTrack.questions.length) {
    renderActiveScenario();
  } else {
    // WHAT THIS CODE DOES:
    // If the user has reached the end, the progress bar is set to 100% and the scorecard is generated.
    progressBarFill.style.width = "100%";
    compileAssessmentScorecard();
  }
}

// ============================================================================
// STEP 10: SCORECARD & ATTESTATION GENERATION
// ============================================================================
// WHAT THIS CODE DOES:
// This function calculates the final score percentage, categorizes the performance level,
// and updates the result card and attestation panel.
//
// WHY THIS CODE IS USED:
// A quiz needs a completion summary so the user can see their performance at a glance.
// This also produces the final certificate-like completion block.
//
// JAVASCRIPT CONCEPTS USED:
// - function declaration
// - Math.round()
// // - if / else if conditions
// - template literals
// - Date API
//
// HOW IT WORKS:
// The function computes total questions, correct answers, and percentage accuracy.
// It then compares the value against thresholds to determine a grade and competency tier.
// Finally, it updates all result text fields and the final certificate date.
//
// CONNECTION WITH OTHER CODE:
// This function is triggered when the last question is answered. It is the final
// stage of the assessment flow before the user can retake or return home.
function compileAssessmentScorecard() {
  // WHAT THIS CODE DOES:
  // This hides the question view and shows the result view.
  questionView.classList.add("hidden");
  resultView.classList.remove("hidden");

  // WHAT THIS CODE DOES:
  // These variables store the evaluation summary metrics.
  const total = appState.currentTrack.questions.length;
  const score = appState.userScore;
  const percent = Math.round((score / total) * 100);
  const incorrect = total - score;

  // WHAT THIS CODE DOES:
  // These lines update the score and count values displayed on the result card.
  scorePercentage.textContent = `${percent}%`;
  scoreFraction.textContent = `${score} / ${total} Correct`;
  correctCountEl.textContent = score;
  incorrectCountEl.textContent = incorrect;
  accuracyRatingEl.textContent = `${percent}% Accuracy`;

  // WHAT THIS CODE DOES:
  // This variable defines the default grade when the score is low.
  let grade = "Novice / Foundational";
  let tier = "Needs Architectural Review";

  // WHAT THIS CODE DOES:
  // These conditions assign more advanced labels as the score increases.
  if (percent === 100) {
    grade = "Distinguished Principal Mastery";
    tier = "Senior / Staff Competency Verified";
  } else if (percent >= 80) {
    grade = "Advanced Production Ready";
    tier = "Solid Technical Depth";
  } else if (percent >= 60) {
    grade = "Competent Developer";
    tier = "Intermediate Foundation";
  }

  // WHAT THIS CODE DOES:
  // These lines update the result card with the final grade and tier.
  performanceGrade.textContent = grade;
  competencyTierEl.textContent = tier;

  // WHAT THIS CODE DOES:
  // This line updates the certificate title with the track name.
  certTitle.textContent = `${appState.currentTrack.title} Competency Attestation`;

  // WHAT THIS CODE DOES:
  // This line generates the date in YYYY-MM-DD format using the system clock.
  certDate.textContent = new Date().toISOString().split("T")[0];

  // WHAT THIS CODE DOES:
  // This scrolls the user to the result section for a smooth final viewing experience.
  quizAppContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================================================
// STEP 11: RESET & RETURN LOGIC
// ============================================================================
// WHAT THIS CODE DOES:
// This section contains the navigation logic for returning to the hub or retaking the current track.
//
// WHY THIS CODE IS USED:
// After completion, the user wants either a fresh attempt or a return to the main menu.
// These functions provide that flow without reloading the page.
//
// JAVASCRIPT CONCEPTS USED:
// - function declarations
// - conditional logic
// - object state reuse
// - scrollIntoView()
function returnToTrackHub() {
  // WHAT THIS CODE DOES:
  // This hides the assessment container and shows the main quiz grid.
  quizAppContainer.classList.add("hidden");
  quizGridElement.classList.remove("hidden");

  // WHAT THIS CODE DOES:
  // This scrolls the page to the quizzes section so the user can choose another assessment.
  document.getElementById("quizzes").scrollIntoView({ behavior: "smooth" });
}

function retakeActiveTrack() {
  // WHAT THIS CODE DOES:
  // This condition ensures there is an active track before retaking.
  if (appState.currentTrack) {
    // WHAT THIS CODE DOES:
    // This reuses the existing selection flow to reset and restart the same track.
    selectAssessmentTrack(appState.currentTrack.id);
  }
}

// ============================================================================
// STEP 12: EVENT LISTENERS BINDING
// ============================================================================
// WHAT THIS CODE DOES:
// This section attaches click handlers to buttons so user interaction triggers the
// app's logic.
//
// WHY THIS CODE IS USED:
// Without event listeners, the buttons would do nothing. Event listeners are the
// bridge between DOM elements and JavaScript functions.
//
// JAVASCRIPT CONCEPTS USED:
// - addEventListener()
// - callback functions
// - DOM events: click
//
// HOW IT WORKS:
// Each button has a corresponding listener. When a click happens, the browser
// calls the registered callback function. This is a core JavaScript event model.
//
// CONNECTION WITH OTHER CODE:
// These listeners call the functions that start the quiz, move to the next question,
// calculate results, and return to the hub.
btnBeginQuiz.addEventListener("click", startAssessmentSession);
btnBackHub.addEventListener("click", returnToTrackHub);
btnNextQuestion.addEventListener("click", handleNextScenario);
btnRetakeQuiz.addEventListener("click", retakeActiveTrack);
btnReturnHub.addEventListener("click", returnToTrackHub);

// Mobile navigation toggle
const mobileToggle = document.getElementById("mobile-toggle");
const navMenu = document.getElementById("nav-menu");
if (mobileToggle) {
  // WHAT THIS CODE DOES:
  // This event listener toggles the mobile navigation menu open and closed.
  mobileToggle.addEventListener("click", () => {
    // WHAT THIS CODE DOES:
    // The class "active" is toggled on the navigation menu.
    // This changes the CSS display state for the mobile menu.
    navMenu.classList.toggle("active");
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

// ============================================================================
// STEP 12: FEEDBACK FORM VALIDATION & STAR RATING INTERACTION
// ============================================================================
// WHAT THIS CODE DOES:
// This block validates the feedback form, keeps the input state consistent, and
// controls the five-star rating behavior shown in the feedback panel.
//
// WHY THIS CODE IS USED:
// The app needs a user-friendly validation layer so empty values, invalid email
// addresses, or missing ratings are blocked before the form is submitted.
// The star rating also needs a clean interactive state that highlights the chosen
// value plus all stars before it.
//
// JAVASCRIPT CONCEPTS USED:
// - querySelector() and querySelectorAll()
// - DOM attribute updates with setAttribute()
// - form validation logic
// - event handling and conditional branching
// - classList toggling for UI state changes
//
// HOW IT WORKS:
// Each time the form is submitted, the script reads the input values and checks
// required rules. If any validation fails, it displays an inline error message.
// If the values pass, it shows a success state and resets the form.
//
// CONNECTION WITH OTHER CODE:
// These functions work directly with the feedback fields in the HTML form and
// the star inputs rendered in the same UI section.
function setFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);

  if (field) {
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  if (errorEl) {
    errorEl.textContent = message || "";
  }
}

// WHAT THIS CODE DOES:
// This function checks whether a provided email string matches a standard email pattern.
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// WHAT THIS CODE DOES:
// This function updates the status text beneath the feedback form.
// It adds either a success or error style class depending on the validation result.
function showFormStatus(form, type, message) {
  const statusEl = form.querySelector(".form-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");
  statusEl.classList.add(type);
}

// WHAT THIS CODE DOES:
// This function converts the selected rating into a visual state.
// Any star whose numeric value is less than or equal to the selected rating gets the active color.
const feedbackRatingProfiles = {
  1: { low: [12, 18, 34], medium: [18, 26, 49], high: [24, 35, 63] },
  2: { low: [16, 27, 45], medium: [23, 39, 60], high: [31, 52, 74] },
  3: { low: [22, 39, 58], medium: [29, 51, 72], high: [38, 66, 84] },
  4: { low: [30, 52, 69], medium: [39, 68, 83], high: [48, 80, 91] },
  5: { low: [38, 66, 82], medium: [49, 78, 90], high: [60, 89, 96] }
};

let feedbackMetricStage = 0;

function updateFeedbackMetricDisplay(ratingValue = 0) {
  const selectedRating = Number(ratingValue) || 3;
  const stageNames = ['low', 'medium', 'high'];
  const stage = stageNames[feedbackMetricStage % stageNames.length];
  const metrics = feedbackRatingProfiles[selectedRating] || feedbackRatingProfiles[3];
  const values = metrics[stage] || metrics.medium;

  const gainEl = document.getElementById('learning-gain-value');
  const positionEl = document.getElementById('learning-position-value');
  const performanceEl = document.getElementById('performance-rate-value');

  if (gainEl) gainEl.textContent = `+${values[0]}%`;
  if (positionEl) positionEl.textContent = `+${values[1]}%`;
  if (performanceEl) performanceEl.textContent = `${values[2]}%`;
}

const ratingHelperLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Excellent',
  5: 'Outstanding'
};

function updateRatingHelperText(value = 0) {
  const helper = document.getElementById('rating-helper-text');
  const resolvedValue = Number(value) || 0;

  if (!helper) return;
  helper.textContent = resolvedValue > 0 ? ratingHelperLabels[resolvedValue] || 'Good' : 'Good';
}

function updateFeedbackStarState(selectedValue = 0) {
  const stars = document.querySelectorAll('.star-option');

  stars.forEach((star) => {
    const input = star.querySelector('input');
    const value = Number(input.value);
    star.classList.toggle('active', value <= selectedValue);
    star.setAttribute('aria-checked', value === selectedValue ? 'true' : 'false');
  });

  updateRatingHelperText(selectedValue);
  updateFeedbackMetricDisplay(selectedValue);
}

function startFeedbackMetricCycle() {
  const intervalId = window.setInterval(() => {
    const checkedRating = document.querySelector('input[name="rating"]:checked');
    const currentRating = Number(checkedRating ? checkedRating.value : 3);
    feedbackMetricStage = (feedbackMetricStage + 1) % 3;
    updateFeedbackMetricDisplay(currentRating);
  }, 5000);

  return intervalId;
}

// WHAT THIS CODE DOES:
// This function handles the form submission flow and validates all required fields.
function handleFeedbackFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const name = document.getElementById("feedback-name").value.trim();
  const email = document.getElementById("feedback-email").value.trim();
  const track = document.getElementById("feedback-track").value.trim();
  const message = document.getElementById("feedback-message").value.trim();
  const rating = document.querySelector('input[name="rating"]:checked');

  let isValid = true;

  if (!name) {
    setFieldError("feedback-name", "Please enter your student name.");
    isValid = false;
  } else {
    setFieldError("feedback-name", "");
  }

  if (email && !validateEmail(email)) {
    setFieldError("feedback-email", "Please enter a valid email address.");
    isValid = false;
  } else {
    setFieldError("feedback-email", "");
  }

  if (!track) {
    setFieldError("feedback-track", "Please select a track.");
    isValid = false;
  } else {
    setFieldError("feedback-track", "");
  }

  if (!rating) {
    setFieldError("rating", "Please choose a rating.");
    isValid = false;
  } else {
    setFieldError("rating", "");
  }

  if (!message) {
    setFieldError("feedback-message", "Please share your feedback.");
    isValid = false;
  } else {
    setFieldError("feedback-message", "");
  }

  if (!isValid) {
    showFormStatus(form, "error", "Please complete the required fields correctly.");
    return;
  }

  showFormStatus(form, "success", "Thank you for your feedback. Your response has been recorded.");
  feedbackMetricStage = 0;
  form.reset();
  updateFeedbackStarState(0);
}

// ============================================================================
// STEP 13: INITIALIZATION ON DOM READY
// ============================================================================
// WHAT THIS CODE DOES:
// This final block runs once the browser has finished parsing the HTML document.
// It renders the initial quiz cards to populate the homepage.
//
// WHY THIS CODE IS USED:
// The app should only render track cards after the DOM is ready and the required
// elements exist in the page.
//
// JAVASCRIPT CONCEPTS USED:
// - document.addEventListener()
// - DOMContentLoaded event
// - callback functions
//
// HOW IT WORKS:
// The browser fires the DOMContentLoaded event after parsing the complete document.
// The callback function runs once and renders the quiz cards into the grid.
//
// CONNECTION WITH OTHER CODE:
// This is the initialization step that kicks off the app and connects the data to the UI.
document.addEventListener("DOMContentLoaded", () => {
  // WHAT THIS CODE DOES:
  // This function call fills the main quiz grid with all available track cards.
  initializeTheme();
  renderTrackCards();

  // WHAT THIS CODE DOES:
  // This section attaches the star-selection behavior to each radio input and keeps the
  // visual state aligned with the user's chosen rating value.
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackStars = document.querySelectorAll('input[name="rating"]');

  if (feedbackStars.length) {
    feedbackStars.forEach((input) => {
      const starOption = input.closest('.star-option');

      input.addEventListener("change", () => {
        feedbackMetricStage = 0;
        updateFeedbackStarState(Number(input.value));
      });

      input.addEventListener("focus", () => {
        updateRatingHelperText(Number(input.value));
      });

      input.addEventListener("mouseenter", () => {
        updateRatingHelperText(Number(input.value));
      });

      if (starOption) {
        starOption.addEventListener("mouseleave", () => {
          const checkedRating = document.querySelector('input[name="rating"]:checked');
          updateRatingHelperText(Number(checkedRating ? checkedRating.value : 3));
        });
      }
    });

    updateFeedbackStarState(3);
    startFeedbackMetricCycle();
  }

  // WHAT THIS CODE DOES:
  // This final listener connects the feedback form to the validation logic so the user
  // cannot submit incomplete or invalid entries.
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedbackFormSubmit);
  }
});